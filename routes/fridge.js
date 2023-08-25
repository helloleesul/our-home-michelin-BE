import express from "express";
import { getIngredients, addIngredients, deleteIngredients } from "../controllers/fridge.js";
import verifyCookie from "../middlewares/verifyCookie.js";
import passport from "passport";

const router = express.Router();

router.get("/api/myfridge", passport.authenticate("jwt", { session: false }), verifyCookie, getIngredients);

router.post("/api/myfridge", passport.authenticate("jwt", { session: false }), verifyCookie, addIngredients);

router.delete("/api/myfridge", passport.authenticate("jwt", { session: false }), verifyCookie, deleteIngredients);

export default router;
