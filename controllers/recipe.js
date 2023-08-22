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
  try {
    const { title, recipeType, recipeServing, process, ingredients, imageUrl } =
      req.body;

    const recipe = await Recipe.create({
      title,
      recipeType,
      recipeServing,
      process,
      ingredients,
      imageUrl,
      likeCount: 0,
    });

    res.json(recipe);
  } catch (err) {
    res.status(500).send("레시피 등록 과정에서 오류가 발생되었습니다.");
  }
};

export const deleteRecipe = async (req, res) => {
  // try, catch 공통적으로..
  const recipeId = req.params.id;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "레시피를 찾을 수 없습니다 :(" });
    }
    return res.json({ message: "레시피 삭제가 완료되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};
