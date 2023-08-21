import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ingredientObj = new Schema({
  name: { type: String, required: true }, // name -> id (ingredient 컬렉션 참조 1-recipe 데이터를 가져온다. ingredient 컬렉션 향해서 참조 // 2-mongoose에 populate라는 기능이 있다. 해당 아이디가 참조하고 있는 값까지 합쳐서 데이터를 달라. 는 내용 -- 방법1이 구현하기는 쉬움 __ 방법2는 시간이 조금 걸림+mongoDB에서 작업할 내용이 늘어남)
  amount: { type: String, required: true },
});

const recipeSchema = new Schema({
  title: { type: String, required: true },
  // 레시피 인분수량 공공api에서 저장된 레시피에는 값이 비어있을 것으로 파악. 이 부분을 위해 default값 설정하자!!!
  recipeServing: { type: Number, required: true }, //-- 1,2,3으로 저장되도록 하고, 3이상이면 'n인분' value로 프론트에서 보여지도록 하는 것이 좋겠음.
  recipeType: { type: String, required: true },
  process: { type: Array, required: true },
  ingredients: { type: [ingredientObj], required: true }, // ingredient collection이 있어야할 것 같다.
  imageUrl: { type: String, required: true }, // imgURL이 유효한 값이 아니게 되었을 때 placeholder 격으로 보여줄 수 있게끔 프론트에서 생각하기 __ 방법1) s3 쓰기, *방법2) multer (파일 업로드 미들웨어_파일 업로드를 받고, node.js가 특정 경로에 저장을 하는데, multer가 그 경로를 주고 이미지url이됨-nginX가 주도록.)
  likeCount: { type: Number, required: true },
  // '레시피 작성자' 넣어야 함. type: String (?) -- owner id
});

export default mongoose.model("Recipe", recipeSchema);
