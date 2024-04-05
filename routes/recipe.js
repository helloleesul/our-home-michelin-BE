import express from "express";
import passport from "passport";
import * as recipeController from "../controllers/recipe.js";
// import upload from "../middlewares/image.js";

const recipeRouter = express.Router();
// 전체 레시피 조회
recipeRouter.get("/api/recipes", recipeController.getAllRecipes);
// 인기 레시피 조회
recipeRouter.get("/api/popular-recipes", recipeController.getPopularRecipes);
// 특정 레시피 조회
recipeRouter.get("/api/recipes/:id", recipeController.getRecipe);
// 새 레시피 작성
recipeRouter.post(
  "/api/recipes",
  // upload.single("uploadRecipeImg"),
  passport.authenticate("jwt", { session: false }),
  recipeController.writeRecipe
);
// 레시피 수정
recipeRouter.patch(
  "/api/recipes/:id",
  // upload.single("uploadRecipeImg"),
  passport.authenticate("jwt", { session: false }),
  recipeController.updateRecipe
);
// 레시피 삭제
recipeRouter.delete("/api/recipes/:id", recipeController.deleteRecipe);
// 나의 레시피 조회
recipeRouter.get(
  "/api/myrecipes",
  passport.authenticate("jwt", { session: false }),
  recipeController.getMyRecipes
);
// 북마크한 레시피 조회
recipeRouter.get(
  "/api/my-bookmark-recipes",
  passport.authenticate("jwt", { session: false }),
  recipeController.getMyBookmarkRecipes
);
// 마스터셰프 조회
recipeRouter.get("/api/master-chief", recipeController.getMasterchief);
// 냉장고 재료 기반 레시피 조회
recipeRouter.post(
  "/api/search-ingredients-recipes",
  passport.authenticate("jwt", { session: false }),
  recipeController.searchIngredientsRecipes
);

export default recipeRouter;
