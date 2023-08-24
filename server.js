import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import setUpPassport from "./middlewares/passport/index.js";

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import { sendVerificationCode, verifyCode } from "./controllers/mailer.js";
import recipeRouter from "./routes/recipe.js";
import fridgeRouter from "./routes/fridge.js";

dotenv.config();
console.log(process.env.JWT_SECRET);

const app = express();
setUpPassport();
app.use(cookieParser(process.env.JWT_SECRET));

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/signup", sendVerificationCode);
app.post("/verify", verifyCode);

const mongoDB_URI =
  "mongodb+srv://argandd34:elice123123%21@cluster0.ivnuzfd.mongodb.net/";

const startServer = async () => {
  try {
    await mongoose.connect(mongoDB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB 접속 성공");

    app.listen(3001, () => {
      console.log("3001포트에서 서버가 작동중");
    });
  } catch (error) {
    console.error("DB 접속 실패", error);
  }
};

startServer();

app.use(authRoutes);
app.use(userRoutes);
app.use(recipeRouter);
app.use(fridgeRouter);

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.status ?? 500;
  res.status(status).json({
    error: error.message,
    data: null,
  });
});
