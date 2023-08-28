import User from "../models/user.js";
import hashPassword from "../utils/hashpassword.js";
import bcrypt from "bcrypt";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) throw Error("존재하지 않는 회원입니다.");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { nickName, email, password } = req.body;

    const hashedPassword = await hashPassword(password);

    const userUpdateData = {
      nickName,
      email,
      password: hashedPassword,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      userUpdateData,
      { new: true }
    );

    if (!updatedUser) throw Error("존재하지 않는 회원입니다.");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) throw Error("존재하지 않는 회원입니다.");

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: "회원탈퇴가 완료되었습니다." });
  } catch (err) {
    next(err);
  }
};

export const confirmPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.status = 400;
      throw error;
    }
    res.json({ confrim: true, message: "비밀번호 확인 성공" });
  } catch (err) {
    next(err);
  }
};
