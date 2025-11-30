import { Router } from "express";
import { ShopController } from "../controllers/ShopController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/items", authMiddleware, ShopController.getItems);
router.post("/buy", authMiddleware, ShopController.buyItem);

export default router;
