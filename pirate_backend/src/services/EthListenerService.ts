import { ethers } from "ethers";
import { config } from "../config/env";
import { supabase } from "../config/supabase";

const provider = new ethers.WebSocketProvider(config.ALCHEMY_WSS_URL);

export function startDepositDetector() {
  console.log("✅ Deposit detector started");

  provider.on("pending", async (txHash) => {
    try {
      const tx = await provider.getTransaction(txHash);
      if (!tx || !tx.to || !tx.value) return;

      const to = tx.to.toLowerCase();

      const { data: user } = await supabase
        .from("user_stats")
        .select("user_id")
        .eq("deposit_address", to)
        .maybeSingle();

      if (!user) return;

      const ethAmount = Number(ethers.formatEther(tx.value));

      // ✅ Insert PENDING once only
      const { data: exists } = await supabase
        .from("eth_deposits")
        .select("id")
        .eq("tx_hash", tx.hash)
        .maybeSingle();

      if (exists) return;

      await supabase.from("eth_deposits").insert({
        user_id: user.user_id,
        tx_hash: tx.hash,
        from_address: tx.from,
        to_address: tx.to,
        amount_eth: ethAmount,
        status: "pending",
        swept: false,
      });

      console.log("🕒 Deposit detected (pending):", tx.hash);
    } catch (err) {}
  });
}
