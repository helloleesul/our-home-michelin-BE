import Recipe from "../models/recipe.js";
import User from "../models/user.js";
import Editor from "../models/editor.js";

// 전체 레시피 조회
export const getAllRecipes = async (req, res) => {
  try {
    const defaultLimit = await Recipe.countDocuments();

    let offset = 0;
    let limit = defaultLimit;

    const tmpOffset = parseInt(req.query.offset);
    if (tmpOffset >= 0) {
      offset = tmpOffset;
    }

    const tmpLimit = parseInt(req.query.limit);
    if (limit > 0) {
      limit = tmpLimit;
    }

    const recipes = await Recipe.find()
      .sort({ createdDate: -1 })
      .skip(offset)
      .limit(limit);

    console.log(">> getAllRecipes");
    console.log(recipes);
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다. " });
  }
};

// 특정 레시피(recipeId) 조회
export const getRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    // const recipe = await Recipe.findById(recipeId);
    const recipe = await Recipe.findById(recipeId).populate(
      "writer",
      "nickName role profileImageURL"
    );
    if (!recipe) {
      return res.status(404).json({ message: "레시피를 찾을 수 없습니다 :(" });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

// '마이 페이지'에서 내가 작성한 레시피 조회
export const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(">> userId");
    console.log(userId);
    const myRecipes = await Recipe.find({ writer: userId });
    // const defaultLimit = await Recipe.countDocuments({ writer: userId });
    console.log(">> myRecipes");
    console.log(myRecipes);

    res.status(200).json(myRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

// 마이페이지 - 나의 레시피 페이지네이션
export const getMyRecipesWithPagination = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentPage = parseInt(req.query.page); // 요청한 페이지 번호 -- 버튼 인덱스
    console.log(">> currentPage");
    console.log(currentPage);
    const perPage = parseInt(req.query.perPage);

    const totalRecipes = await Recipe.countDocuments({ writer: userId });
    const totalPages = Math.ceil(totalRecipes / perPage);

    const offset = (currentPage - 1) * perPage;

    const myRecipes = await Recipe.find({ writer: userId })
      .sort({ createdDate: -1 })
      .skip(offset)
      .limit(perPage);

    res.status(200).json({
      myRecipes,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

// '나의 냉장고'에서 나의 식재료를 포함하는 레시피 조회
export const searchIngredientsRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { ingredients } = req.body;
    const recipes = await Recipe.find({
      "ingredients.name": { $in: ingredients },
    });

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

// 5스타 레시피(=인기 레시피) 조회
export const getFiveStarRecipes = async (req, res) => {
  try {
    const defaultLimit = await Recipe.countDocuments({
      likeCount: { $gte: 20 },
    }); // defaultLimit - '좋아요' 20개 이상의 글의 '수'
    const limit = parseInt(req.query.limit) || defaultLimit;
    let fiveStarRecipes;

    if (limit !== defaultLimit) {
      if (limit > 0) {
        fiveStarRecipes = await Recipe.find({
          likeCount: { $gte: 20 },
        })
          .sort({ likeCount: -1 })
          .limit(limit);
      } else {
        // limit 값이 음의 정수인 경우 -> defaultLimit
        fiveStarRecipes = await Recipe.find({
          likeCount: { $gte: 20 },
        })
          .sort({ likeCount: -1 })
          .limit(defaultLimit);
      }
    } else {
      fiveStarRecipes = await Recipe.find({
        likeCount: { $gte: 20 },
      })
        .sort({ likeCount: -1 })
        .limit(defaultLimit);
    }
    res
      .status(200)
      .json({ message: "5스타 레시피 목록 조회 성공", fiveStarRecipes });
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
    console.log(err);
  }
};

// 에디터 목록 & 에디터의 레시피 목록 조회
export const getEditorsRecipes = async (req, res) => {
  try {
    // 좋아요 100개 이상(= 에디터 자격) 받은 레시피가 있는 에디터 조회
    const editors2022 = await Editor.find({
      rank2022: { $gte: 1, $lte: 10 },
    })
      .sort({ rank2022: 1 })
      .limit(10);
    const editors2023 = await Editor.find({
      rank2023: { $gte: 1, $lte: 10 },
    })
      .sort({ rank2022: 1 })
      .limit(10);

    const editorsWithRecipes = [];

    // 각 에디터의 레시피 목록 조회
    for (const editor of [...editors2022, ...editors2023]) {
      const editorId = editor.userId;
      const recipes = await Recipe.find({ writerId: editorId });
      editorsWithRecipes.push({ editor, recipes });
    }

    res.status(200).json({
      message: "에디터, 에디터가 작성한 레시피 목록 조회 성공",
      editorsWithRecipes,
    });
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
    console.log(err);
  }
};

// 레시피 작성
export const writeRecipe = async (req, res) => {
  try {
    let reqImageUrl;
    const {
      title,
      recipeType,
      recipeServing,
      process,
      ingredients,
      imageUrl,
      writer,
    } = req.body;
    const newIngredients = JSON.parse(ingredients);
    const newProcess = JSON.parse(process);

    if (req.file) {
      const imgFileData = {
        path: req.file.path,
        name: req.file.originalname,
        ext: req.file.mimetype.split("/")[1],
      };

      reqImageUrl = `/${imgFileData.path}`;
    } else {
      reqImageUrl = "";
    }

    // imageUrl외 필드는 프론트 서버에서 작성되어 넘어와야한다.
    const newRecipe = await Recipe.create({
      title,
      recipeType,
      recipeServing,
      process: newProcess,
      ingredients: newIngredients,
      imageUrl: reqImageUrl,
      createdDate: new Date(),
      likeCount: 0,
      writer,
    });

    res.json(newRecipe);
  } catch (err) {
    res.status(500).send("레시피 등록 과정에서 오류가 발생되었습니다.");
    console.log(err);
  }
};

// 레시피 수정
export const updateRecipe = async (req, res) => {
  try {
    const { title, recipeType, recipeServing, process, ingredients, imageUrl } =
      req.body;
    const recipeId = req.params.id;

    const existingRecipe = await Recipe.findById(recipeId);

    if (!existingRecipe) {
      return res.status(404).json({ message: "레시피를 찾을 수 없습니다." });
    }

    let reqImageUrl = "";
    if (req.file) {
      const imgFileData = {
        path: req.file.path,
        name: req.file.originalname,
        ext: req.file.mimetype.split("/")[1],
      };
      reqImageUrl = `/${imgFileData.path}`;
    }

    const recipeUpdateData = {
      title: req.body.title,
      recipeType: req.body.recipeType,
      recipeServing: req.body.recipeServing,
      process: JSON.parse(req.body.process),
      ingredients: JSON.parse(req.body.ingredients),
      imageUrl: reqImageUrl,
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      recipeUpdateData,
      { new: true }
    );

    res.status(200).json(updatedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send("레시피 수정 과정에서 오류가 발생되었습니다.");
  }
};

// 레시피 삭제
export const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;

  try {
    const recipeToDelete = await Recipe.findById(recipeId);

    if (!recipeToDelete) {
      return res.status(404).json({ message: "레시피를 찾을 수 없습니다 :(" });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    return res.json({ message: "레시피 삭제가 완료되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};
