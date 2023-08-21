import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user.js";
import verifyCookie from "../middlewares/verifyCookie.js";

const router = express.Router();

router.get("/api/myinfo", verifyCookie, getUser);

router.post("/api/myinfo", verifyCookie, updateUser);

router.delete("/api/myinfo", verifyCookie, deleteUser);

export default router;
