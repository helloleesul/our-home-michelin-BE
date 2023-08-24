import Fridge from "../models/fridge.js";

export const getIngredients = async (req, res) => {
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

export const addIngredient = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const newIngredient = {
            ingredientName: req.body.ingredientName,
            bestBefore: req.body.bestBefore,
        };

        let userFridge = await Fridge.findOne({ userId: userId });

        if (!userFridge) {
            userFridge = new Fridge({ userId: userId, ingredients: [newIngredient] });
        } else {
            userFridge.ingredients.push(newIngredient);
        }
        await userFridge.save();
        res.status(201).send(newIngredient);
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

        res.status(200).json({ message: "재료가 삭제되었습니다." });
    } catch (error) {
        next(error);
    }
};
