import { supabase } from "../config/supabase";

export const UserStatModel = {
  async addCoins(userId: string, amount: number) {
    const { error } = await supabase.rpc("add_game_coins", {
      uid: userId,
      amount,
    });
    if (error) throw error;
  },

  async updateStats(userId: string, coin: number, record: number) {
    const { error } = await supabase.rpc("increment_game_stats", {
      p_user_id: userId,
      p_game_coin_earned: coin,
      p_record: record,
    });

    if (error) throw error;
  },
};
