export interface TokenData {
  mint: string;
  name: string;
  symbol: string;
  logo: string;
  decimals: number;
  supply: number;
}

export interface TransferFormData {
  amount: string;
  toAddress: string;
  showUSD: boolean;
}
