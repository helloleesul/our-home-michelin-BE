import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, required: true, default: 0 },
  profileImageURL: { type: String, required: false, default: "" },
});

export default mongoose.model("User", userSchema);
