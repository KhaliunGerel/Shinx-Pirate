import { supabase } from "../config/supabase";

export const InventoryModel = {
  async findByName(userId: string, itemName: string) {
    const { data, error } = await supabase
      .from("inventories")
      .select("item_id, shop_items(name)")
      .eq("user_id", userId)
      .eq("shop_items.name", itemName)
      .single();

    if (error) return null;
    return data;
  },
};
