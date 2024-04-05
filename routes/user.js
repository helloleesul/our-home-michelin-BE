import express from "express";
import passport from "passport";
import {
  getUser,
  updateUser,
  deleteUser,
  confirmPassword,
} from "../controllers/user.js";
// import upload from "../middlewares/image.js";

const router = express.Router();

// 정보 조회
router.get(
  "/api/myinfo",
  passport.authenticate("jwt", { session: false }),
  getUser
);
// 정보 수정
router.patch(
  "/api/myinfo",
  passport.authenticate("jwt", { session: false }),
  // upload.single("profileImageURL"),
  updateUser
);
// 회원 탈퇴
router.delete(
  "/api/myinfo",
  passport.authenticate("jwt", { session: false }),
  deleteUser
);
// 본인 인증
router.post(
  "/api/confirm-password",
  passport.authenticate("jwt", { session: false }),
  confirmPassword
);

export default router;
