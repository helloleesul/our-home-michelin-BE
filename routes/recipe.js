import express from "express";
import { recipeController } from "../controllers/recipeController";

const recipeRouter = express.Router();

recipeRouter.get("/api/recipe", recipeController.getRecipes);

recipeRouter.post("/api/recipe", recipeController.createRecipe);

recipeRouter.delete("/api/recipe/:id", recipeController.deleteRecipe);

recipeRouter.post("/api/recipe/write", recipeController.writeRecipe);

export default { recipeRouter };
