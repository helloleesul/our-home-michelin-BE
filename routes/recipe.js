import express from "express";
import passport from "passport";
import * as recipeController from "../controllers/recipe.js";
import verifyCookie from "../middlewares/verifyCookie.js";
import upload from "../middlewares/image.js";

const recipeRouter = express.Router();
// 전체 레시피 조회
recipeRouter.get("/api/recipes", recipeController.getAllRecipes);
// 특정 레시피 조회
recipeRouter.get("/api/recipes/:id", recipeController.getRecipe);
// 나의 레시피 조회
recipeRouter.get(
  "/api/myrecipes",
  passport.authenticate("jwt", { session: false }),
  verifyCookie,
  recipeController.getMyRecipes
);
// 북마크한 레시피
recipeRouter.get(
  "/api/my-bookmark-recipes",
  passport.authenticate("jwt", { session: false }),
  verifyCookie,
  recipeController.getMyBookmarkRecipes
);
// 마스터셰프
recipeRouter.get("/api/master-chief", recipeController.getMasterchief);

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

// 새 레시피 작성
recipeRouter.post(
  "/api/recipes",
  upload.single("uploadRecipeImg"),
  passport.authenticate("jwt", { session: false }),
  verifyCookie,
  recipeController.writeRecipe
);
// 레시피 수정
recipeRouter.patch(
  "/api/recipes/:id",
  upload.single("uploadRecipeImg"),
  passport.authenticate("jwt", { session: false }),
  verifyCookie,
  recipeController.updateRecipe
);
// 레시피 삭제
recipeRouter.delete("/api/recipes/:id", recipeController.deleteRecipe);

export default recipeRouter;
