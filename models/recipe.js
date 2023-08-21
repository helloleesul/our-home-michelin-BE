import mongoose from "mongoose";

const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    type: { type: String, required: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    process: { type: Array, required: true},
    ingredient: { type: String, required: true },
    imageUrl: { type: String, required: true },
    likeCount: { type: Number, required: true}
  }
);

export default mongoose.model("Recipe", recipeSchema);
