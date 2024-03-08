import User from "../models/user.js";
import hashPassword from "../utils/hashpassword.js";
import generateToken from "../utils/token.js";
import passport from "passport";
import VerificationCode from "../models/verificationCode.js";
import Fridge from "../models/fridge.js";

export const login = async (req, res, next) => {
  try {
    const token = generateToken(req.user);
    let userFridge = await Fridge.findOne({ userId: req.user._id });
    const { email, nickName, profileImageURL } = await User.findOne({
      _id: req.user._id,
    });

    if (!userFridge) {
      userFridge = { ingredients: [] };
    }

    res
      .cookie("t", token, {
        httpOnly: true,
        signed: true,
      })
      .send({
        message: "로그인 성공",
        user: {
          userId: req.user._id,
          email,
          nickName,
          profileImageURL,
        },
        fridge: userFridge.ingredients,
      });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export const join = async (req, res, next) => {
  try {
    const { email, nickName, password } = req.body;

    const storedData = await VerificationCode.findOne({ email });

    if (!storedData) {
      const error = new Error("이메일 인증이 필요합니다.");
      error.status = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("이미 존재하는 email입니다.");
      error.status = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      nickName,
      password: hashedPassword,
    });

    res.json({ message: "회원가입이 성공적으로 완료되었습니다." });
  } catch (error) {
    next(error);
  }
};

export const checkLogin = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return res.status(500).json(err);
    if (!user) return res.json({ isAuthenticated: false });
    return res.json({ isAuthenticated: true, user });
  })(req, res);
};

export const logout = (req, res) => {
  res.clearCookie("t");
  res.status(200).send("로그아웃 되었습니다.");
};
