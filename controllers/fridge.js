import Fridge from "../models/fridge.js";

export const getIngredients = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userFridge = await Fridge.findOne({ userId: userId });

        if (!userFridge) {
            return res.status(404).json({ message: "냉장고를 찾을 수 없습니다." });
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
        res.status(201).send(newIngredients);
    } catch (error) {
        next(error);
    }
};

export const deleteIngredients = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const ingredientIds = req.body.ingredientIds;

        const updatedFridge = await Fridge.findOneAndUpdate(
            { userId: userId },
            { $pull: { ingredients: { _id: { $in: ingredientIds } } } },
            { new: true }
        );

        if (!updatedFridge) {
            return res.status(404).json({ message: "냉장고를 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "재료가 삭제되었습니다." });
    } catch (error) {
        next(error);
    }
};
