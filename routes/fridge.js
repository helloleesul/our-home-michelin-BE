import express from "express";
import { getIngredients, addIngredient, deleteIngredient } from "../controllers/fridge.js";
import verifyCookie from "../middlewares/verifyCookie.js";
import passport from "passport";

const router = express.Router();

router.get("/api/myfridge", passport.authenticate("jwt", { session: false }), verifyCookie, getIngredients);

router.post("/api/myfridge", passport.authenticate("jwt", { session: false }), verifyCookie, addIngredient);

router.delete(
    "/api/myfridge/:ingredientId",
    passport.authenticate("jwt", { session: false }),
    verifyCookie,
    deleteIngredient
);

export default router;
