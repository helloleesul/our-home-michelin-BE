import Recipe from "../models/recipe.js";

let recipes = []; // 가상의 레시피 데이터

// 전체 레시피 조회
export const getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    res.status(200).json(allRecipes);
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

// 특정 레시피(recipeId) 조회
export const getRecipe = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      // 해당 레시피가 없는 경우
      return res.status(404).json({ message: "레시피를 찾을 수 없습니다 :(" });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

export const writeRecipe = async (req, res) => {
  const {
    title,
    description,
    recipeType,
    recipeServing,
    process,
    ingredient,
    imageUrl,
  } = req.body;
  // 레시피 id 질문하기!!
  // const recipeId = recipes.length + 1; // 임시 ID <-- mongoDB 고유 objectID 사용하기.

  try {
    const newRecipe = new Recipe({
      recipeId: recipes.length + 1,
      title,
      description,
      recipeType,
      recipeServing,
      process,
      ingredient,
      imageUrl,
      like: 0, // '좋아요' 수 기본값: 0
    });

    await newRecipe.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

export const deleteRecipe = (req, res) => {
  const recipeId = parseInt(req.params.recipeId);

  // 해당 ID를 가진 레시피 삭제
  recipes = recipes.filter((recipe) => recipe.recipeId !== recipeId);

  res.json({ success: true });
};
