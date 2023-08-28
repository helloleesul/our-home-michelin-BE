import Recipe from "../models/recipe.js";
import User from "../models/user.js";

export const getEditorRecipes = async (req, res, next) => {
  try {
    const editorId = req.params.editorId;
    const user = await User.findById(editorId);

    if (!user || user.role !== 1) {
      return res
        .status(404)
        .json({ message: "해당 ID의 에디터를 찾을 수 없습니다." });
    }

    const recipes = await Recipe.find({ writer: editorId }).populate(
      "writer",
      "nickName"
    );

    if (!recipes.length) {
      return res
        .status(404)
        .json({ message: "해당 에디터의 레시피를 찾을 수 없습니다." });
    }
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};
