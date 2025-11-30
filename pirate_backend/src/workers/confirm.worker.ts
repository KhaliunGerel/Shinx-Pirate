import { ethers } from "ethers";
import { config } from "../config/env";
import { supabase } from "../config/supabase";

const provider = new ethers.JsonRpcProvider(config.ETH_RPC_URL);

export function startConfirmationWorker() {
  setInterval(async () => {
    try {
      const { data: pending } = await supabase
        .from("eth_deposits")
        .select("*")
        .eq("status", "pending");

      if (!pending?.length) return;

      for (const dep of pending) {
        try {
          const receipt = await provider.getTransactionReceipt(dep.tx_hash);
          if (!receipt || receipt.status !== 1) continue;

          const confirmations = receipt.confirmations ?? 0;
          if (Number(confirmations) < 6) continue;

          const coinAmount = dep.amount_eth * config.ETH_TO_COIN_RATE;

          await supabase
            .from("eth_deposits")
            .update({
              status: "confirmed",
              amount_coin: coinAmount,
              confirmed_at: new Date(),
            })
            .eq("id", dep.id);

          await supabase.rpc("add_game_coins", {
            uid: dep.user_id,
            amount: coinAmount,
          });

          console.log("✅ Deposit confirmed:", dep.tx_hash);
        } catch (err) {}
      }
    } catch (err) {
      console.error("Confirm worker error:", err);
    }
  }, 15_000);
}
