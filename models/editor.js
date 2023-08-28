import mongoose from "mongoose";
import User from "./user.js";

const Schema = mongoose.Schema;

const editorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  rank2022: { type: Number, required: true },
  rank2023: { type: Number, required: true },
});

editorSchema.pre("save", async function (next) {
  try {
    const user = await User.findById(this.userId);
    if (user && user.role !== 1) {
      throw new Error("에디터만 사용 가능합니다.");
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Editor", editorSchema);
