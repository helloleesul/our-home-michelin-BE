import { Router } from "express";
import passport from "passport";
import { login, join, logout } from "../controllers/auth.js";
import { sendVerificationCode, verifyCode } from "../controllers/mailer.js";

const router = Router();
// 로그인
router.post(
  "/api/login",
  passport.authenticate("local", { session: false }),
  login
);
// 이메일 인증코드 요청
router.post("/api/request", sendVerificationCode);
// 이메일 인증
router.post("/api/verify", verifyCode);
// 회원가입
router.post("/api/join", join);
// 로그아웃
router.post("/api/logout", logout);

export default router;
