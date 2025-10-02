import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const RPC_URL =
  "https://devnet.helius-rpc.com/?api-key=0f803376-0189-4d72-95f6-a5f41cef157d";
export const connection = new Connection(RPC_URL, "confirmed");

export const validateSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const solToLamports = (sol: number): number => {
  return sol * LAMPORTS_PER_SOL;
};

export const lamportsToSol = (lamports: number): number => {
  return lamports / LAMPORTS_PER_SOL;
};
