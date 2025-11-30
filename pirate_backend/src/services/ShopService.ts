import { ShopModel } from "../models/ShopModel";

export const ShopService = {
  async getItems() {
    return ShopModel.getAll();
  },

  async buyItem(userId: string, itemId: string) {
    const item = await ShopModel.findById(itemId);

    if (!item) {
      throw new Error("Item not found");
    }

    await ShopModel.buy(userId, itemId, item.price);

    return { success: true };
  },
};
