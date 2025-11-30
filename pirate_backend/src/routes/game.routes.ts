import { Router } from "express";
import { DungeonController } from "../controllers/GameController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/start", authMiddleware, DungeonController.startGame);
router.post("/finish", authMiddleware, DungeonController.finishGame);

export default router;
