import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import setUpPassport from "./middlewares/passport/index.js";
import cors from "cors";

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import recipeRouter from "./routes/recipe.js";
import fridgeRouter from "./routes/fridge.js";
import likeRecipesRouter from "./routes/likeRecipes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

setUpPassport();
app.use(cookieParser(process.env.JWT_SECRET));

const corsOptions = {
  credentials: true,
  origin: process.env.ORIGIN,
};
app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRoutes);
app.use(userRoutes);
app.use(recipeRouter);
app.use(fridgeRouter);
app.use(likeRecipesRouter);

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.status ?? 500;
  res.status(status).json({
    error: error.message,
    data: null,
  });
});

app.use("/uploads", express.static("uploads"));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB 접속 성공");

    app.listen(port, () => {
      console.log(`${port} 서버가 작동중`);
    });
  } catch (error) {
    console.error("DB 접속 실패", error);
  }
};

startServer();
