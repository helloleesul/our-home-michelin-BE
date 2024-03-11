import Recipe from "../models/recipe.js";
import User from "../models/user.js";

export const toggleLikeRecipes = async (req, res) => {
  const recipeId = req.body.recipeId;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const recipe = await Recipe.findById(recipeId);

    if (!user || !recipe) {
      return res
        .status(404)
        .json({ success: false, message: "User or Recipe not found" });
    }

    const isLiked = recipe.likeUsers.includes(userId);

    if (isLiked) {
      // If already liked, remove userId from likeUsers
      recipe.likeUsers = recipe.likeUsers.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // If not liked, add userId to likeUsers
      recipe.likeUsers.push(userId);
    }

    await recipe.save();

    // Fetch updated recipe information after save
    const { likeUsers } = await Recipe.findById(recipeId);

    res.status(200).json({
      success: true,
      message: "Like toggled successfully",
      likeNumber: likeUsers.length,
    });
  } catch (error) {
    next(error);
  }
};
