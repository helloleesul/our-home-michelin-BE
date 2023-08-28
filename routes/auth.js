import { Router } from "express";
import passport from "passport";
import { login, join, checkLogin, logout } from "../controllers/auth.js";
import { sendVerificationCode, verifyCode } from "../controllers/mailer.js";

const router = Router();

router.post(
  "/api/login",
  passport.authenticate("local", { session: false }),
  login
);

router.post("/api/request", sendVerificationCode);
router.post("/api/verify", verifyCode);
router.post("/api/join", join);
router.get("/api/check-login", checkLogin);
router.post("/api/logout", logout);

export default router;
