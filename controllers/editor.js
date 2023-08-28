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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const total = await Recipe.countDocuments({ writer: editorId });

    const recipes = await Recipe.find({ writer: editorId })
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("writer", "nickName");

    if (!recipes.length) {
      return res
        .status(404)
        .json({ message: "해당 에디터의 레시피를 찾을 수 없습니다." });
    }
    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEditors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const total = await User.countDocuments({ role: 1 });

    consteditors = await User.find({ role: 1 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!getEditorsRecipes.length) {
      return res.status(404).json({ message: "에디터를 찾을 수 없습니다. " });
    }

    res.json({
      editors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};
