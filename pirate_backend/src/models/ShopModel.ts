import { supabase } from "../config/supabase";

export const ShopModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("shop_items")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  },

  async findById(itemId: string) {
    const { data, error } = await supabase
      .from("shop_items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (error) return null;
    return data;
  },

  async buy(userId: string, itemId: string, price: number) {
    const { error } = await supabase.rpc("buy_item", {
      uid: userId,
      itemid: itemId,
      price,
    });
    console.log(error);

    if (error) throw error;
  },
};
