import mongoose from "mongoose";
import User from "./user.js";

const Schema = mongoose.Schema;

const ingredientObj = new Schema({
  name: { type: String, required: true }, // name -> id (ingredient 컬렉션 참조 1-recipe 데이터를 가져온다. ingredient 컬렉션 향해서 참조 // 2-mongoose에 populate라는 기능이 있다. 해당 아이디가 참조하고 있는 값까지 합쳐서 데이터를 달라. 는 내용
  amount: { type: String, required: true },
});

const recipeSchema = new Schema({
  title: { type: String, required: true },
  recipeServing: { type: Number, required: true, default: 1 },
  recipeType: { type: String, required: true },
  process: { type: Array, required: true },
  ingredients: { type: [ingredientObj], required: true }, // ingredient collection이 있어야할 것 같다.
  imageUrl: { type: String, required: true }, // multer
  likeCount: { type: Number, required: true },
  writerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ObjectId, userId ... // '레시피 작성자' 넣어야 함. type: String (?) -- owner id
  createdDate: { type: Date, default: Date.now }, // '최신순' 정렬을 위하여 레시피 작성 날짜 필요
});

export default mongoose.model("Recipe", recipeSchema);
