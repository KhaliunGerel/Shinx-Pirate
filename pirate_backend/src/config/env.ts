import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  TREASURY_WALLET: process.env.TREASURY_WALLET!,
  ETH_RPC_URL: process.env.ETH_RPC_URL!,
  ALCHEMY_WSS_URL: process.env.ALCHEMY_WSS_URL!,
  MASTER_MNEMONIC: process.env.MASTER_MNEMONIC!,
  ETH_TO_COIN_RATE: Number(process.env.ETH_TO_COIN_RATE || 10000),
};
