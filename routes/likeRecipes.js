import express from "express";
import { toggleLikeRecipes } from "../controllers/likeRecipes.js";
import passport from "passport";

const router = express.Router();

router.post(
  "/api/toggleLikeRecipes",
  passport.authenticate("jwt", { session: false }),
  toggleLikeRecipes
);

export default router;
