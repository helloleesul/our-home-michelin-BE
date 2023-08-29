import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import setUpPassport from "./middlewares/passport/index.js";
import multer from "multer";
import upload from "./middlewares/image.js";

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import { sendVerificationCode, verifyCode } from "./controllers/mailer.js";
import recipeRouter from "./routes/recipe.js";
import fridgeRouter from "./routes/fridge.js";
import editorRouter from "./routes/editor.js";

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
app.post("/recipes/upload-image", upload.single("image"), (req, res) => {
  const imageUrl = `http://localhost:3000/uploads/${req.file.originalname}`;
  res.json({ imageUrl });
});

app.use(authRoutes);
app.use(userRoutes);
app.use(recipeRouter);
app.use(fridgeRouter);
app.use(editorRouter);

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.status ?? 500;
  res.status(status).json({
    error: error.message,
    data: null,
  });
});

//
app.post("/upload", upload.single("uploadRecipeImg"), function (req, res) {
  res.send("이미지 multer 서버 업로드 완료");
});
//

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGODB_DB_NAME } =
  process.env;

const mongoDB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}/`;

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
