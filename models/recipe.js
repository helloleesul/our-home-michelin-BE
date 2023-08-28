import mongoose from "mongoose";
import User from "./user.js";

const Schema = mongoose.Schema;

const ingredientObj = new Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
});

const recipeSchema = new Schema({
  title: { type: String, required: true },
  recipeServing: { type: Number, required: true, default: 1 },
  recipeType: { type: String, required: true },
  process: { type: Array, required: true },
  ingredients: { type: [ingredientObj], required: true },
  imageUrl: { type: String, required: false }, // 이미지 등록 안하고 저장하는 레시피는 '냉슐랭 레시피 기본 대표 이미지' 저장되도록 함.
  likeCount: { type: Number, required: true },
  writerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ObjectId, userId ... // '레시피 작성자' 넣어야 함. type: String (?) -- owner id
  createdDate: { type: Date, default: Date.now },
});

export default mongoose.model("Recipe", recipeSchema);
