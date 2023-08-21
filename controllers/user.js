import User from "../models/user.js";

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
    const { nickName, email } = req.body;

    const userUpdateData = {
      nickName,
      email,
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, userUpdateData, { new: true });

    if (!updateUser) throw Error("존재하지 않는 회원입니다.");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) throw Error("존재하지 않는 회원입니다.");
    res.json({ message: "회원탈퇴가 완료되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};
