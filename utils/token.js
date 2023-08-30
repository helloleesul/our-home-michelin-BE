import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    nickName: user.name,
    role: user.role,
    likeRecipes: user.likeRecipes,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token;
};

export default generateToken;
