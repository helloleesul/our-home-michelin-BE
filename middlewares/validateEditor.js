import User from "../models/user.js";

const validateEditor = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user && user.role !== 1) {
      throw new Error("에디터만 사용 가능합니다.");
    }
    next();
  } catch (err) {
    next(err);
  }
};

export default validateEditor;
