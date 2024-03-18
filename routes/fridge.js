import express from "express";
import {
  getIngredients,
  addIngredients,
  updateBestBefore,
  deleteIngredient,
  deleteAllIngredient,
} from "../controllers/fridge.js";
import passport from "passport";

const router = express.Router();
// 냉장고 조회
router.get(
  "/api/myfridge",
  passport.authenticate("jwt", { session: false }),
  getIngredients
);
// 재료 추가
router.post(
  "/api/myfridge",
  passport.authenticate("jwt", { session: false }),
  addIngredients
);
// 재료 유통기한 수정
router.put(
  "/api/myfridge/:ingredientId",
  passport.authenticate("jwt", { session: false }),
  updateBestBefore
);
// 재료 삭제
router.delete(
  "/api/myfridge/:ingredientId",
  passport.authenticate("jwt", { session: false }),
  deleteIngredient
);
// 재료 전체 삭제
router.delete(
  "/api/myfridge",
  passport.authenticate("jwt", { session: false }),
  deleteAllIngredient
);

export default router;
