import { Strategy as LocalStrategy } from "passport-local";
import User from "../../models/user.js";
import bcrypt from "bcrypt";

const config = {
  usernameField: "email",
  passwordField: "password",
};

const local = new LocalStrategy(config, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("존재하지 않는 아이디 입니다.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    done(null, {
      _id: user._id,
      email: user.email,
      nickName: user.nickName,
      role: user.role,
      likeRecipes: user.likeRecipes,
    });
  } catch (err) {
    done(err, null);
  }
});

export default local;
