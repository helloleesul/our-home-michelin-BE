import express from "express";
import { getEditorRecipes, getAllEditors } from "../controllers/editor.js";

const router = express.Router();

router.get("/api/editorRecipes/:editorId", getEditorRecipes);

router.get("/api/editors", getAllEditors);

export default router;
