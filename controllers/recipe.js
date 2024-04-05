import Recipe from "../models/recipe.js";
import User from "../models/user.js";

// 페이지네이션 (공통)
const pagination = async (req, defaultLimit) => {
  const currentPage = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 12;
  const totalPages = Math.ceil(defaultLimit / perPage);
  const offset = (currentPage - 1) * perPage;

  return { offset, totalPages, perPage };
};

// 전체 레시피 조회
export const getAllRecipes = async (req, res) => {
  try {
    const defaultLimit = await Recipe.countDocuments(
      req.query.type && { recipeType: req.query.type }
    );

    const { offset, totalPages, perPage } = await pagination(req, defaultLimit);

    let recipes;
    recipes = await Recipe.find(
      req.query.type && { recipeType: req.query.type }
    )
      .sort({ createdDate: -1 })
      .skip(offset)
      .limit(perPage);
    res.status(200).json({ recipes, totalPages });
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

// 인기 레시피 조회
export const getPopularRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.aggregate([
      {
        $addFields: { likeUsersCount: { $size: "$likeUsers" } },
      },
      { $sort: { likeUsersCount: -1 } },
      { $limit: 10 },
    ]);
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

// 특정 레시피 조회
export const getRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId).populate(
      "writer",
      "nickName role profileImageURL"
    );
    if (!recipe) {
      return res.status(404).json({ message: "레시피를 찾을 수 없습니다." });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};
// 새 레시피 작성
export const writeRecipe = async (req, res) => {
  try {
    let {
      title,
      recipeType,
      recipeServing,
      process,
      ingredients,
      writer,
      uploadRecipeImg,
    } = req.body;

    // if (req.file) {
    //   const imgFileData = {
    //     path: req.file.path,
    //     name: req.file.originalname,
    //     ext: req.file.mimetype.split("/")[1],
    //   };

    //   uploadRecipeImg = `/${imgFileData.path}`;
    // }

    const newRecipe = await Recipe.create({
      title,
      recipeType,
      recipeServing,
      process: JSON.parse(process),
      ingredients: JSON.parse(ingredients),
      imageUrl: uploadRecipeImg,
      createdDate: new Date(),
      likeUsers: [],
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
    let {
      title,
      recipeType,
      recipeServing,
      process,
      ingredients,
      uploadRecipeImg,
    } = req.body;
    const recipeId = req.params.id;

    const existingRecipe = await Recipe.findById(recipeId);

    if (!existingRecipe) {
      return res.status(404).json({ message: "레시피를 찾을 수 없습니다." });
    }

    // if (req.file) {
    //   const imgFileData = {
    //     path: req.file.path,
    //     name: req.file.originalname,
    //     ext: req.file.mimetype.split("/")[1],
    //   };
    //   uploadRecipeImg = `/${imgFileData.path}`;
    // }

    const recipeUpdateData = {
      title,
      recipeType,
      recipeServing,
      process: JSON.parse(process),
      ingredients: JSON.parse(ingredients),
      imageUrl: uploadRecipeImg,
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
// 나의 레시피 조회
export const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const myRecipes = await Recipe.find({ writer: userId });

    const { offset, totalPages, perPage } = await pagination(
      req,
      myRecipes.length
    );

    let recipes = await Recipe.find({ writer: userId })
      .sort({
        createdDate: -1,
      })
      .skip(offset)
      .limit(perPage);
    res.status(200).json({ recipes, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};
// 북마크한 레시피 조회
export const getMyBookmarkRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const myRecipes = await Recipe.find({ likeUsers: userId });

    const { offset, totalPages, perPage } = await pagination(
      req,
      myRecipes.length
    );

    let recipes = await Recipe.find({ likeUsers: userId })
      .sort({
        createdDate: -1,
      })
      .skip(offset)
      .limit(perPage);
    res.status(200).json({ recipes, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};
// 마스터셰프 조회
export const getMasterchief = async (req, res) => {
  try {
    const recipes = await Recipe.find();

    // 각 작성자가 작성한 레시피의 likeUsers 배열의 길이를 계산
    const writerLikesCount = {};
    recipes.forEach((recipe) => {
      if (!writerLikesCount[recipe.writer]) {
        writerLikesCount[recipe.writer] = 0;
      }
      writerLikesCount[recipe.writer] += recipe.likeUsers.length;
    });

    // 가장 많은 likeUsers를 가진 상위 5명의 작성자
    const topWriters = Object.keys(writerLikesCount)
      .sort((a, b) => writerLikesCount[b] - writerLikesCount[a])
      .slice(0, 5);

    const writerInfoAndRecipes = [];
    // 각 작성자에 대해 반복
    for (const writerId of topWriters) {
      // 작성자의 정보 가져오기
      const writerInfo = await User.findById(writerId);
      const { nickName, profileImageURL, _id } = writerInfo;

      // 작성자가 작성한 4개의 인기 레시피 가져오기
      let writerRecipes = await Recipe.find({ writer: writerId }).sort({
        createdDate: -1,
      });

      writerRecipes = await Recipe.aggregate([
        {
          $match: { _id: { $in: writerRecipes.map((recipe) => recipe._id) } },
        },
        { $addFields: { likeUsersCount: { $size: "$likeUsers" } } },
        { $sort: { likeUsersCount: -1 } },
        { $limit: 4 },
      ]);

      // 작성자 정보와 레시피 정보를 객체에 추가
      writerInfoAndRecipes.push({
        _id,
        nickName,
        profileImageURL,
        recipes: writerRecipes,
      });
    }
    res.status(200).json(writerInfoAndRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};
// 냉장고 재료 기반 레시피 조회
export const searchIngredientsRecipes = async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients.length) {
      return res.json({ message: "냉장고에 재료가 없습니다." });
    }

    const query = {
      "ingredients.name": { $regex: ingredients.join("|") },
    };
    if (req.query.type) {
      query.recipeType = req.query.type;
    }

    const defaultRecipes = (await Recipe.find(query)).length;
    const { offset, totalPages, perPage } = await pagination(
      req,
      defaultRecipes
    );

    let recipes = await Recipe.find(query).skip(offset).limit(perPage);
    res.json({ recipes, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};
