import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  confirmPassword,
} from "../controllers/user.js";
import passport from "passport";
import upload from "../middlewares/image.js";

const router = express.Router();

router.get(
  "/api/myinfo",
  passport.authenticate("jwt", { session: false }),
  getUser
);

router.patch(
  "/api/myinfo",
  passport.authenticate("jwt", { session: false }),
  upload.single("profileImageURL"),
  updateUser
);

router.delete(
  "/api/myinfo",
  passport.authenticate("jwt", { session: false }),
  deleteUser
);

router.post(
  "/api/confirm-password",
  passport.authenticate("jwt", { session: false }),
  confirmPassword
);

export default router;
