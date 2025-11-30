import { ethers } from "ethers";
import { supabase } from "../config/supabase";

export const DepositModel = {
  async getUserDepositAddress(userId: string) {
    const { data: user, error } = await supabase
      .from("user_stats")
      .select("deposit_address")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return user.deposit_address;
  },

  async getAddressNumber() {
    const { count, error } = await supabase
      .from("user_stats")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count;
  },

  async createDepositAddress(userId: string, address: string) {
    const { error } = await supabase
      .from("user_stats")
      .update({ deposit_address: address.toLowerCase() })
      .eq("user_id", userId);
    if (error) throw error;
  },

  async getUserByAddress(txTo: string) {
    const { data: user, error } = await supabase
      .from("user_stats")
      .select("user_id")
      .eq("deposit_address", txTo.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    return user;
  },

  async getUserCoin(userId: string) {
    const { data: user, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return user;
  },

  async checkDeposit(txHash: string) {
    const { data: exists, error } = await supabase
      .from("eth_deposits")
      .select("id")
      .eq("tx_hash", txHash)
      .maybeSingle();

    if (error) throw error;
    return exists;
  },

  async createDeposit(
    userId: string,
    tx: ethers.TransactionResponse,
    ethAmount: number,
    coinAmount: number
  ) {
    const { data, error } = await supabase.from("eth_deposits").insert({
      user_id: userId,
      tx_hash: tx.hash,
      from_address: tx.from,
      to_address: tx.to,
      amount_eth: ethAmount,
      amount_coin: coinAmount,
      status: "confirmed",
      confirmed_at: new Date(),
    });
    if (error) throw error;
    return data;
  },
};
