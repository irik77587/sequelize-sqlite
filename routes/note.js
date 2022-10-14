import { Router } from "express";
const router = Router();

export default router;

import { note_create, note_retrieve, note_update, note_delete } from "../database/index.js"

router.get("/", note_retrieve);

router.post("/", note_create);
router.delete("/", note_delete);

router.patch("/", note_update);