import express from "express";
import * as recipeController from "../controllers/recipe.js";
import upload from "../middlewares/image.js";
import passport from "passport";

const recipeRouter = express.Router();

recipeRouter.get("/api/recipes", recipeController.getAllRecipes);

recipeRouter.get("/api/recipes/:id", recipeController.getRecipe);

recipeRouter.post(
  "/api/search-ingredients-recipes",
  passport.authenticate("jwt", { session: false }),
  recipeController.searchIngredientsRecipes
);

recipeRouter.get("/api/fivestar-recipes", recipeController.getFiveStarRecipes);

recipeRouter.get("/api/editors-recipes", recipeController.getEditorsRecipes);

recipeRouter.post("/api/recipes", recipeController.writeRecipe);

recipeRouter.post(
  "/api/recipes/upload-image",
  upload.single("image"),
  recipeController.uploadRecipeImage
);

recipeRouter.put("/api/recipes/:id", recipeController.updateRecipe);

recipeRouter.delete("/api/recipes/:id", recipeController.deleteRecipe);

recipeRouter.delete("/api/:id/image", recipeController.deleteRecipeImage);

export default recipeRouter;
