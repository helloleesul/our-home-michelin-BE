import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    nickName: user.nickName,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token;
};

export default generateToken;
