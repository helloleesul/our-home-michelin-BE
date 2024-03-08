import Recipe from "../models/recipe.js";

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

    // 인기순 레시피
    // const processedRecipes = await Recipe.aggregate([
    //   { $match: { _id: { $in: recipes.map((recipe) => recipe._id) } } },
    //   { $addFields: { likeUsersCount: { $size: "$likeUsers" } } },
    //   { $sort: { likeUsersCount: -1 } },
    // ]);
    // console.log("🚀 ~ getMyRecipes ~ myRecipes:", processedRecipes);

    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "문제가 발생했습니다. " });
  }
};

export const getRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
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

    if (req.file) {
      const imgFileData = {
        path: req.file.path,
        name: req.file.originalname,
        ext: req.file.mimetype.split("/")[1],
      };

      uploadRecipeImg = `/${imgFileData.path}`;
    }

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
      process: req.body.process,
      ingredients: req.body.ingredients,
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

export const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const myRecipes = await Recipe.find({ writer: userId }).sort({
      createdDate: -1,
    });

    res.status(200).json(myRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

export const getMyBookmarkRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const myRecipes = await Recipe.find({ likeUsers: userId }).sort({
      createdDate: -1,
    });

    res.status(200).json(myRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "문제가 발생했습니다." });
  }
};

export const getMyRecipesWithPagination = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentPage = parseInt(req.query.page);
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
