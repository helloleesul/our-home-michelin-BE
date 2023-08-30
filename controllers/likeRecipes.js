import Recipe from "../models/recipe.js";
import User from "../models/user.js";

export const toggleLikeRecipes = async (req, res) => {
  const recipeId = req.body.recipeId;
  // const userId = req.user._id;
  const userId = req.body.id;

  console.log("userId:", userId);
  console.log("req.user:", req.user);
  console.log("recipeId:", recipeId);

  try {
    const user = await User.findById(userId);
    console.log("User object:", user);

    let likeCountChange = 1;
    let updateAction;

    if (user.likeRecipes.includes(recipeId)) {
      likeCountChange = -1;
      updateAction = { $pull: { likeRecipes: recipeId } };
    } else {
      updateAction = { $addToSet: { likeRecipes: recipeId } };
    }

    await Recipe.updateOne({ _id: recipeId }, { $inc: { likeCount: likeCountChange } });

    await User.updateOne({ _id: userId }, updateAction);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
