import express from "express";
import { toggleLikeRecipes } from "../controllers/likeRecipes.js";
import verifyCookie from "../middlewares/verifyCookie.js";
import passport from "passport";

const router = express.Router();

router.post("/toggleLikeRecipes", passport.authenticate("jwt", { session: false }), toggleLikeRecipes);

export default router;
