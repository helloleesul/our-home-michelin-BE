import express from "express";
import { getEditorRecipes } from "../controllers/editor.js";

const router = express.Router();

router.get("/api/editorRecipes/:editorId", getEditorRecipes);

export default router;
