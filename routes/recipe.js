import express from "express";
import * as recipeController from "../controllers/recipe.js";

const recipeRouter = express.Router();

recipeRouter.get("/api/recipes", recipeController.getAllRecipes);

recipeRouter.get("/api/recipes/:id", recipeController.getRecipe);

recipeRouter.post("/api/recipes", recipeController.writeRecipe);

recipeRouter.delete("/api/recipes/:id", recipeController.deleteRecipe);

export default recipeRouter;
