import Recipe from "../models/recipe.js";
import User from "../models/user.js";
import Editor from "../models/editor.js";

// (postman 체크 O) 전체 레시피 조회
// 실행 시, .slice 하면 에러 발생 Cannot read properties of undefined (reading 'slice')
// export const getAllRecipes = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 0; // 0 아니고 default값을 두는 게 좋지 않을지? // limit은 되는데, front slice했을 때 에러 발생
//     let allRecipes;

//     if (limit > 0) {
//       allRecipes = await Recipe.find().sort({ createdDate: -1 }).limit(limit);
//     } else {
//       allRecipes = await Recipe.find().sort({ createdDate: -1 });
//     }
//     res.status(200).json(allRecipes);
//   } catch (err) {
//     res.status(500).json({ message: "문제가 발생했습니다." });
//   }
// };
export const getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipe.find()
      .sort({ createdDate: -1 })
      .limit(limit);
    console.log("allRecipes");
    console.log(allRecipes);

    res.status(200).json(allRecipes);
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

// (postman 체크 O) 특정 레시피(recipeId) 조회
export const getRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
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

// (postman 체크 O) 5스타 레시피(=인기 레시피) 조회
export const getFiveStarRecipes = async (req, res) => {
  try {
    // 좋아요 20개 이상(스타가 1개라도 있는 레시피)인 레시피를 불러온다.
    // 1스타 ~ 5스타 인데
    // 제가 작성한 'id: 1234' 레시피에 좋아요 개수가 89개 -> 이 레시피는 4스타 -> 에디터 X (5스타)
    // 에디터가 되는 조건은 5스타를 받은 레시피가 있는 유저 + 경연님 작성 레시피가 10개 && 10개 다 5스타
    const limit = 5;
    const fiveStarRecipes = await Recipe.find({
      likeCount: { $gte: 100 },
    })
      .sort({ likeCount: -1 })
      .limit(limit);
    res
      .status(200)
      .json({ message: "5스타 레시피 목록 조회 성공", fiveStarRecipes });
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

// (아직 체크 X) 에디터 목록 & 에디터의 레시피 목록 조회
export const getEditorsRecipes = async (req, res) => {
  try {
    // 좋아요 100개 이상(= 에디터 자격) 받은 에디터 조회
    const editors = await Editor.find({ rank2023: { $gte: 100 } });

    const editorsWithRecipes = [];

    // 각 에디터의 레시피 목록 조회
    for (const editor of editors) {
      const editorId = editor.userId;
      const recipes = await Recipe.find({ editorId, likeCount: { $gte: 100 } });
      editorsWithRecipes.push({ editor, recipes });
    }

    res.status(200).json({
      message: "에디터, 에디터가 작성한 레시피 목록 조회 성공",
      editorsWithRecipes,
    });
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

// (백 & 프론트 체크 O) 레시피 작성
export const writeRecipe = async (req, res) => {
  try {
    const {
      title,
      recipeType,
      recipeServing,
      process,
      ingredients,
      imageUrl,
      createdDate,
    } = req.body;

    const recipe = await Recipe.create({
      title,
      recipeType,
      recipeServing,
      process,
      ingredients,
      imageUrl,
      likeCount: 0,
      createdDate,
    });

    res.json(recipe);
  } catch (err) {
    res.status(500).send("레시피 등록 과정에서 오류가 발생되었습니다.");
    console.log(err);
  }
};

// (postman 체크 중) - 404 에러 왜?
export const updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params._id; // 레시피 자체의 id
    // 존재하는 레시피인지 확인
    const existingRecipe = await Recipe.findById(recipeId);

    if (!existingRecipe) {
      return res.status(404).json({ message: "레시피를 찾을 수 없습니다." });
    }

    // 레시피 작성자 id인지 레시피 수정 권한 확인
    if (existingRecipe.writerId.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "해당 레시피에 대한 수정 권한이 없습니다." });
    }
    const {
      title,
      recipeType,
      recipeServing,
      process,
      ingredients,
      imageUrl,
      likeCount,
    } = req.body;

    const recipeUpdateData = {
      title,
      recipeType,
      recipeServing,
      process,
      ingredients,
      imageUrl,
      likeCount,
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      recipeUpdateData,
      { new: true }
    );

    res.json(updatedRecipe);
  } catch (err) {
    res.status(500).send("레시피 수정 과정에서 오류가 발생되었습니다.");
  }
};

// (postman 체크 O) 특정 레시피(:id) 삭제
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
