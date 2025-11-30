import { supabase } from "../config/supabase";

export const GameRunModel = {
  async create(userId: string, level: number) {
    const { data, error } = await supabase
      .from("game_runs")
      .insert({
        user_id: userId,
        level,
        game_coin_earned: 0,
        record: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from("game_runs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async finish(id: string, game_coin_earned: number, record: number) {
    const { error } = await supabase
      .from("game_runs")
      .update({
        game_coin_earned,
        record,
      })
      .eq("id", id);

    if (error) throw error;
  },
};
