import mongoose from "mongoose";
import User from "./user.js";

const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
});

const processSchema = new Schema({
  text: { type: String, required: true },
});

const recipeSchema = new Schema({
  title: { type: String, required: true },
  recipeServing: { type: Number, required: true, default: 1 },
  recipeType: { type: String, required: true },
  process: { type: [processSchema], required: true },
  ingredients: { type: [ingredientSchema], required: true },
  imageUrl: { type: String, default: "" },
  likeCount: { type: Number, required: true },
  writer: { type: Schema.Types.ObjectId, ref: "User" },
  createdDate: { type: Date },
});

export default mongoose.model("Recipe", recipeSchema);
