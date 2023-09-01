import Recipe from "../models/recipe.js";
import User from "../models/user.js";

export const toggleLikeRecipes = async (req, res) => {
  const recipeId = req.body.recipeId;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    let likeCountChange = 1;
    let updateAction;

    if (user.likeRecipes.includes(recipeId)) {
      likeCountChange = -1;
      updateAction = { $pull: { likeRecipes: recipeId } };
    } else {
      updateAction = { $addToSet: { likeRecipes: recipeId } };
    }

    await User.updateOne({ _id: userId }, updateAction);
    await Recipe.updateOne(
      { _id: recipeId },
      { $inc: { likeCount: likeCountChange } }
    );

    const userLikedRecipes = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$likeRecipes" },
      {
        $lookup: {
          from: "recipes",
          localField: "likeRecipes",
          foreignField: "_id",
          as: "likedRecipesInfo",
        },
      },
    ]);
    res.status(200).json({ success: true, userLikedRecipes });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
