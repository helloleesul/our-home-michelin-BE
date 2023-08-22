import Fridge from "../models/fridge.js";

export const getIngredients = async (req, res) => {
    try {
        const userId = req.params.userId;
        const ingredients = await Fridge.find({ userId: userId });
        res.json(ingredients);
    } catch (error) {
        next(error);
    }
};

export const addIngredient = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const ingredient = new Fridge({
            ...req.body,
            userId: userId,
        });
        await ingredient.save();
        res.status(201).send(ingredient);
    } catch (error) {
        next(error);
    }
};

export const deleteIngredient = async (req, res, next) => {
    try {
        const ingredientId = req.params.ingredientId;
        const deletedIngredient = await Fridge.findByIdAndDelete(ingredientId);

        if (!deletedIngredient) {
            const error = new Error("해당 재료를 찾을 수 없습니다.");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: "재료가 삭제되었습니다." });
    } catch (error) {
        next(error);
    }
};
