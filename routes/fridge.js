import express from "express";
import {
  getIngredients,
  addIngredients,
  updateBestBefore,
  deleteIngredient,
} from "../controllers/fridge.js";
import verifyCookie from "../middlewares/verifyCookie.js";
import passport from "passport";

const router = express.Router();

router.get(
  "/api/myfridge",
  passport.authenticate("jwt", { session: false }),
  getIngredients
);

router.post(
  "/api/myfridge",
  passport.authenticate("jwt", { session: false }),
  addIngredients
);

router.put(
  "/api/myfridge/:ingredientId",
  passport.authenticate("jwt", { session: false }),
  updateBestBefore
);

router.delete(
  "/api/myfridge/:ingredientId",
  passport.authenticate("jwt", { session: false }),
  deleteIngredient
);

export default router;
