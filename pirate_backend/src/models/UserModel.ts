import { supabase } from "../config/supabase";

export const UserModel = {
  async findByUsername(username: string) {
    return supabase.from("users").select("*").eq("username", username).single();
  },

  async create(username: string) {
    return supabase.from("users").insert({ username }).select().single();
  },

  async findById(id: string) {
    return supabase.from("users").select("*").eq("id", id).single();
  },
};
