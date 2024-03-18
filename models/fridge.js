import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  imgUrl: { type: String, required: true },
  inputDate: { type: Date, required: true },
  bestBefore: { type: Date, required: true },
});
const fridgeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  ingredients: [ingredientSchema],
});

export default mongoose.model("Fridge", fridgeSchema);
