import { Router } from "express";
const router = Router();

export default router;

import { user_admin, user_details, create_user, delete_user } from "../database/index.js"

router.get("/admin", user_admin);

// Query account info
router.get("/", user_details);

// Create account
router.put("/", create_user);

// Change username or password

// Delete account
router.delete("/", delete_user);