import { Request, Response } from "express";
import { deriveDepositWallet } from "../services/DepositService";
import { DepositModel } from "../models/DepositModel";

export const PaymentController = {
  async getDepositAddress(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const userDepositAddress = await DepositModel.getUserDepositAddress(
        userId
      );

      if (userDepositAddress) {
        return res.json({ address: userDepositAddress });
      }

      const addressCount = await DepositModel.getAddressNumber();
      const wallet = deriveDepositWallet(addressCount || 0);

      await DepositModel.createDepositAddress(userId, wallet.address);

      res.json({ address: wallet.address });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get deposit address" });
    }
  },

  async getBalance(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const user = await DepositModel.getUserCoin(userId);

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  },
};
