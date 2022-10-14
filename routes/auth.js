import { Router } from "express";
const router = Router();

export default router;

import { login, logout } from "../database/index.js"

// Login
router.post("/", login);

// Logout
router.delete("/", logout);