import { ethers } from "ethers";
import { config } from "../config/env";
import { supabase } from "../config/supabase";

const provider = new ethers.JsonRpcProvider(config.ETH_RPC_URL);

function deriveWalletBySearchingForAddress(target: string) {
  const root = ethers.HDNodeWallet.fromPhrase(config.MASTER_MNEMONIC);

  for (let i = 0; i < 100_000; i++) {
    const wallet = root.derivePath(`44'/60'/0'/0/${i}`);
    if (wallet.address.toLowerCase() === target.toLowerCase()) {
      return wallet.connect(provider);
    }
  }

  throw new Error("Deposit wallet not found in derivation range");
}

export function startSweepWorker() {
  setInterval(async () => {
    try {
      const { data: pending } = await supabase
        .from("eth_deposits")
        .select("*")
        .eq("status", "confirmed")
        .eq("swept", false);

      if (!pending || pending.length === 0) return;

      console.log("confirms", pending.length);

      for (const tx of pending) {
        try {
          const userWallet = deriveWalletBySearchingForAddress(tx.to_address);

          const balance = await provider.getBalance(userWallet.address);
          if (balance === 0n) {
            console.warn("No balance to sweep for", userWallet.address);
            continue;
          }

          const feeData = await provider.getFeeData();

          // Fallback gasPrice if node returns null
          const gasPrice = feeData.gasPrice ?? ethers.parseUnits("20", "gwei");
          const gasLimit = 21_000n;
          const gasCost = gasLimit * gasPrice;

          if (balance <= gasCost) {
            console.warn(
              "Not enough balance for gas at",
              userWallet.address,
              "balance:",
              balance.toString(),
              "gasCost:",
              gasCost.toString()
            );
            continue;
          }

          const sweepValue = balance - gasCost;

          const txResponse = await userWallet.sendTransaction({
            to: config.TREASURY_WALLET,
            value: sweepValue,
            gasLimit,
            gasPrice,
          });

          await txResponse.wait();

          await supabase
            .from("eth_deposits")
            .update({
              swept: true,
              swept_tx_hash: txResponse.hash,
            })
            .eq("id", tx.id);

          console.log("✅ Swept to treasury:", ethers.formatEther(sweepValue));
        } catch (err) {
          console.error("❌ Sweep failed:", err);
        }
      }
    } catch (err) {
      console.error("❌ Sweep worker error:", err);
    }
  }, 60_000); // 60 seconds
}
