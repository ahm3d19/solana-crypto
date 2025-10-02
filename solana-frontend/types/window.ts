export interface SolanaWindow extends Window {
  solana?: {
    isPhantom?: boolean;
    isConnected?: boolean;
    publicKey?: {
      toBytes(): Uint8Array;
    };
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: any): Promise<any>;
    signAllTransactions(transactions: any[]): Promise<any[]>;
  };
}
