import mongoose from "mongoose";

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  recipeId: { type: String, required: true }, // 내가 임의로 작성한 레시피 아이디 -- mongoDB의 objectID를 사용하면 될 것 같다. -- 프론트 '레시피 작성 페이지'에서는 uuid라이브러리로 생성해서 작성해본 상태.
  title: { type: String, required: true },
  description: { type: String, required: true }, // (사용 여부 주말내로 결정하기)예) 김이 모락모락 나는 된장찌개
  // 레시피 인분수량 공공api에서 저장된 레시피에는 값이 비어있을 것으로 파악. 이 부분을 default값으로 할지, 어떻게 할지 고민+질문해야겠음.
  recipeServing: { type: Number, required: true },
  recipeType: { type: String, required: true }, // 레시피 종류(반찬, 국&찌개 ...)
  process: { type: Array, required: true }, // array 안에 각 스텝 'string'으로 저장. 스텝 뽑을 때는 array index로...?
  ingredient: { type: [[String, String]], required: true }, // array: [[재료명, 중량], ["간장", "3스푼"]]
  imageUrl: { type: String, required: true },
  like: { type: Number, required: true }, // 좋아요 수 저장
});

export default mongoose.model("Recipe", recipeSchema);
