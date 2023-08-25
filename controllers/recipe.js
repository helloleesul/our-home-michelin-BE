import Recipe from "../models/recipe.js";
import User from "../models/user.js";
import Editor from "../models/editor.js";

// 전체 레시피 조회
export const getAllRecipes = async (req, res) => {
    try {
        const defaultLimit = await Recipe.countDocuments(); // defaultLimit - 전체 레시피 수
        const limit = parseInt(req.query.limit) || defaultLimit;
        let allRecipes;

        if (limit !== defaultLimit) {
            if (limit > 0) {
                allRecipes = await Recipe.find().sort({ createdDate: -1 }).limit(limit);
            } else {
                // limit 값이 음의 정수인 경우 -> defaultLimit
                allRecipes = await Recipe.find().sort({ createdDate: -1 }).limit(defaultLimit);
            }
        } else {
            allRecipes = await Recipe.find().sort({ createdDate: -1 }).limit(defaultLimit);
        }
        res.status(200).json(allRecipes);
    } catch (err) {
        res.status(500).json({ message: "문제가 발생했습니다." });
    }
};

// 특정 레시피(recipeId) 조회
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
        res.status(200).json({ message: "5스타 레시피 목록 조회 성공", fiveStarRecipes });
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
        const { title, recipeType, recipeServing, process, ingredients, imageUrl, createdDate, writerId } = req.body;

        const recipe = await Recipe.create({
            title,
            recipeType,
            recipeServing,
            process,
            ingredients,
            imageUrl,
            likeCount: 0,
            createdDate,
            writerId,
        });

        res.json(recipe);
    } catch (err) {
        res.status(500).send("레시피 등록 과정에서 오류가 발생되었습니다.");
        console.log(err);
    }
};

// 레시피 수정 - (404 에러 - 원인 찾는 중)
export const updateRecipe = async (req, res) => {
    try {
        const { title, recipeType, recipeServing, process, ingredients, imageUrl, likeCount, writerId } = req.body;
        const recipeId = req.params._id; // 레시피 자체의 id
        // 존재하는 레시피인지 확인
        const existingRecipe = await Recipe.findById(recipeId);

        if (!existingRecipe) {
            return res.status(404).json({ message: "레시피를 찾을 수 없습니다." });
        }

        // 레시피 작성자 id인지 레시피 수정 권한 확인
        if (existingRecipe.writerId.toString() !== req.user._id) {
            return res.status(403).json({ message: "해당 레시피에 대한 수정 권한이 없습니다." });
        }

        const recipeUpdateData = {
            title,
            recipeType,
            recipeServing,
            process,
            ingredients,
            imageUrl,
            likeCount,
            writerId,
        };

        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, recipeUpdateData, { new: true });

        res.json(updatedRecipe);
    } catch (err) {
        res.status(500).send("레시피 수정 과정에서 오류가 발생되었습니다.");
    }
};

// 레시피 삭제
export const deleteRecipe = async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.user._id; // 로그인한 회원id (자신이 작성한 레시피만 삭제 가능해야해서)

    try {
        const recipeToDelete = await Recipe.findById(recipeId);

        if (!recipeToDelete) {
            return res.status(404).json({ message: "레시피를 찾을 수 없습니다 :(" });
        }

        if (!recipeToDelete.writerId.equals(userId)) {
            return res.status(403).json({ message: "자신이 작성한 레시피만 삭제할 수 있습니다." });
        }

        const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
        return res.json({ message: "레시피 삭제가 완료되었습니다." });
    } catch (err) {
        res.status(500).json({ message: "문제가 발생했습니다." });
    }
};
