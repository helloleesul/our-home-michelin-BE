import express from "express";
import { recipeController } from "../controllers/recipeController";

const recipeRouter = express.Router();

recipeRouter.get("/api/recipe", recipeController.getAllRecipes);

recipeRouter.get("/api/recipe/:id", recipeController.getRecipe);

recipeRouter.post("/api/recipe/write", recipeController.writeRecipe);

recipeRouter.delete("/api/recipe/:id", recipeController.deleteRecipe);

export default recipeRouter;
