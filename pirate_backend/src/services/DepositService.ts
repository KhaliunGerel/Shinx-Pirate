import { ethers } from "ethers";
import { config } from "../config/env";

export function deriveDepositWallet(index: number) {
  const root = ethers.HDNodeWallet.fromPhrase(config.MASTER_MNEMONIC);
  const child = root.derivePath(`44'/60'/0'/0/${index}`);
  return child;
}
