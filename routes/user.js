import express from "express";
import { getUser, updateUser, deleteUser, confirmPassword } from "../controllers/user.js";
import verifyCookie from "../middlewares/verifyCookie.js";
import passport from "passport";

const router = express.Router();

router.get("/api/myinfo", passport.authenticate("jwt", { session: false }), getUser);

router.patch("/api/myinfo", passport.authenticate("jwt", { session: false }), updateUser);

router.delete("/api/myinfo", passport.authenticate("jwt", { session: false }), deleteUser);

router.post("/api/confirm-password", passport.authenticate("jwt", { session: false }), confirmPassword);

export default router;
