import mongoose from "mongoose";

const Schema = mongoose.Schema;

const fridgeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    ingredientName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    bestBefore: { type: Date, required: true },
});

export default mongoose.model("Fridge", fridgeSchema);
