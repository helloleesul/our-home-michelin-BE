import express from "express";
import * as recipeController from "../controllers/recipe.js";
import upload from "../middlewares/image.js";
import passport from "passport";
import verifyCookie from "../middlewares/verifyCookie.js";
import recipe from "../models/recipe.js";

const recipeRouter = express.Router();

recipeRouter.get("/api/recipes", recipeController.getAllRecipes);

recipeRouter.get("/api/recipes/:id", recipeController.getRecipe);

recipeRouter.get(
  "/api/myrecipes",
  passport.authenticate("jwt", { session: false }),
  verifyCookie,
  recipeController.getMyRecipes
);

recipeRouter.get(
  "/api/myrecipes/pagination",
  passport.authenticate("jwt", { session: false }),
  verifyCookie,
  recipeController.getMyRecipesWithPagination
);

recipeRouter.post(
  "/api/search-ingredients-recipes",
  passport.authenticate("jwt", { session: false }),
  verifyCookie,
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
