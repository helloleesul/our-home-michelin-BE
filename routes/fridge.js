import express from "express";
import { getIngredients, addIngredient, deleteIngredient } from "../controllers/fridge.js";
import verifyCookie from "../middlewares/verifyCookie.js";

const router = express.Router();

router.get("/user/:userId/fridge", verifyCookie, getIngredients);

router.post("/user/:userId/fridge", verifyCookie, addIngredient);

router.delete("/user/:userId/fridge/:ingredientId", verifyCookie, deleteIngredient);

export default router;
