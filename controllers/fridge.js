import Fridge from "../models/fridge.js";

export const getIngredients = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let userFridge = await Fridge.findOne({ userId: userId });

    if (!userFridge) {
      userFridge = new Fridge({ userId: userId, ingredients: [] });
    }

    res.json(userFridge.ingredients);
  } catch (error) {
    next(error);
  }
};

export const addIngredients = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let newIngredients = req.body.ingredients;

    newIngredients = newIngredients.map((ingredient) => ({
      ...ingredient,
      inputDate: new Date(),
    }));

    let userFridge = await Fridge.findOne({ userId: userId });

    if (!userFridge) {
      userFridge = new Fridge({ userId: userId, ingredients: newIngredients });
    } else {
      userFridge.ingredients.push(...newIngredients);
    }
    await userFridge.save();
    res.status(201).send({
      message: "재료가 추가되었습니다.",
      ingredients: userFridge.ingredients,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBestBefore = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const ingredientId = req.params.ingredientId;
    const { newBestBefore } = req.body;

    if (!newBestBefore) {
      return res.status(400).json({ message: "유통기한 정보가 필요합니다." });
    }

    const updatedFridge = await Fridge.findOneAndUpdate(
      { userId: userId, "ingredients._id": ingredientId },
      { "ingredients.$.bestBefore": new Date(newBestBefore) },
      { new: true }
    );

    if (!updatedFridge) {
      return res
        .status(404)
        .json({ message: "냉장고 또는 재료를 찾을 수 없습니다. " });
    }

    res.status(200).json({
      message: "유통기한이 수정되었습니다.",
      ingredients: updatedFridge.ingredients,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIngredient = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const ingredientId = req.params.ingredientId;

    const updatedFridge = await Fridge.findOneAndUpdate(
      { userId: userId },
      { $pull: { ingredients: { _id: ingredientId } } },
      { new: true }
    );

    if (!updatedFridge) {
      return res.status(404).json({ message: "냉장고를 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: "재료가 삭제되었습니다.",
      ingredients: updatedFridge.ingredients,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllIngredient = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const updatedFridge = await Fridge.findOneAndUpdate(
      { userId: userId },
      { $set: { ingredients: [] } },
      { new: true }
    );

    if (!updatedFridge) {
      return res.status(404).json({ message: "냉장고를 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: "모든 재료가 삭제되었습니다.",
      ingredients: updatedFridge.ingredients,
    });
  } catch (error) {
    next(error);
  }
};
