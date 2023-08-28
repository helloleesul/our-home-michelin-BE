import express from "express";
import { getUser, updateUser, deleteUser, confirmPassword } from "../controllers/user.js";
import verifyCookie from "../middlewares/verifyCookie.js";
import passport from "passport";

const router = express.Router();

router.get("/api/myinfo", passport.authenticate("jwt", { session: false }), verifyCookie, getUser);

router.put("/api/myinfo", passport.authenticate("jwt", { session: false }), verifyCookie, updateUser);

router.delete("/api/myinfo", passport.authenticate("jwt", { session: false }), verifyCookie, deleteUser);

router.post("/api/confirm-password", passport.authenticate("jwt", { session: false }), verifyCookie, confirmPassword);

export default router;
