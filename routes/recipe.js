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
  "/api/my-bookmark-recipes",
  passport.authenticate("jwt", { session: false }),
  verifyCookie,
  recipeController.getMyBookmarkRecipes
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

recipeRouter.post(
  "/api/recipes",
  upload.single("uploadRecipeImg"),
  passport.authenticate("jwt", { session: false }),
  verifyCookie,
  recipeController.writeRecipe
);

recipeRouter.patch(
  "/api/recipes/:id",
  upload.single("uploadRecipeImg"),
  passport.authenticate("jwt", { session: false }),
  verifyCookie,
  recipeController.updateRecipe
);

recipeRouter.delete("/api/recipes/:id", recipeController.deleteRecipe);

export default recipeRouter;
