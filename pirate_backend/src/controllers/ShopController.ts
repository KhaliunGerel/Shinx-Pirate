import { Request, Response } from "express";
import { ShopService } from "../services/ShopService";

export const ShopController = {
  async getItems(req: Request, res: Response) {
    const items = await ShopService.getItems();
    res.json(items);
  },

  async buyItem(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { itemId } = req.body;

    const result = await ShopService.buyItem(userId, itemId);

    res.json(result);
  },
};
