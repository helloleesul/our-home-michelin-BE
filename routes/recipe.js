import express from "express";
import * as recipeController from "../controllers/recipe.js";

const recipeRouter = express.Router();

recipeRouter.get("/api/recipes", recipeController.getAllRecipes);

// 특정 레시피(레시피id) 조회
recipeRouter.get("/api/recipes/:id", recipeController.getRecipe);

// 5스타 레시피(인기 레시피) 조회
recipeRouter.get("/api/fivestar-recipes", recipeController.getFiveStarRecipes);

// 에디터 레시피 조회
recipeRouter.get("/api/editors-recipes", recipeController.getEditorsRecipes);

recipeRouter.post("/api/recipes", recipeController.writeRecipe);

// 특정 레시피(레시피id) 수정
recipeRouter.put("/api/recipes/:id", recipeController.updateRecipe);

recipeRouter.delete("/api/recipes/:id", recipeController.deleteRecipe);

export default recipeRouter;
