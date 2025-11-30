import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/deposit-address",
  authMiddleware,
  PaymentController.getDepositAddress
);

router.get("/balance", authMiddleware, PaymentController.getBalance);

export default router;
