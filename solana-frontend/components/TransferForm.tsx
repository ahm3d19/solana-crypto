"use client";

import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { toast } from "react-toastify";

// Check if Phantom is installed
const isPhantomInstalled = () => {
  if (typeof window === "undefined") return false;
  return !!window?.solana?.isPhantom;
};

const TransferForm: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected, connecting } = useWallet();
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [showUSD, setShowUSD] = useState(false);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validateSolanaAddress = (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const solToLamports = (sol: number): number => {
    return sol * LAMPORTS_PER_SOL;
  };

  // Fetch balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connected) {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [publicKey, connected, connection]);

  useEffect(() => {
    if (!isClient) return;

    const fetchSolPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await response.json();
        setSolPrice(data.solana.usd);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };

    fetchSolPrice();
  }, [isClient]);

  const handleTransfer = async () => {
    if (!publicKey || !connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!amount || !toAddress) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!validateSolanaAddress(toAddress)) {
      toast.error("Invalid Solana address");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (balance && amountNum > balance) {
      toast.error("Insufficient balance for this transfer");
      return;
    }

    try {
      setIsLoading(true);

      const toPublicKey = new PublicKey(toAddress);
      const lamports = solToLamports(amountNum);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      // Set recent blockhash and fee payer
      transaction.feePayer = publicKey;
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      const signature = await sendTransaction(transaction, connection);

      toast.success(
        <div className="text-white">
          <p className="font-semibold">🚀 Transfer Successful!</p>
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 hover:text-cyan-200 underline text-sm mt-1 inline-block"
          >
            View on Explorer
          </a>
        </div>,
        {
          className: "bg-gradient-to-r from-green-500 to-emerald-600",
        }
      );

      // Clear form and refresh balance
      setAmount("");
      setToAddress("");
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);
    } catch (error: any) {
      console.error("Transfer failed:", error);

      if (error.message.includes("User rejected the request")) {
        toast.error(
          "❌ Transfer cancelled - You rejected the request in Phantom"
        );
      } else if (error.message.includes("insufficient funds")) {
        toast.error("💸 Insufficient balance for transfer + gas fees");
      } else {
        toast.error(`❌ Transfer failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const usdValue =
    solPrice && amount ? (parseFloat(amount) * solPrice).toFixed(2) : null;

  if (!isClient) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
        <div className="animate-pulse">
          <div className="h-8 bg-cyan-500/20 rounded-2xl mb-6"></div>
          <div className="space-y-6">
            <div className="h-4 bg-cyan-500/20 rounded-2xl"></div>
            <div className="h-12 bg-cyan-500/20 rounded-2xl"></div>
            <div className="h-4 bg-cyan-500/20 rounded-2xl"></div>
            <div className="h-12 bg-cyan-500/20 rounded-2xl"></div>
            <div className="h-12 bg-cyan-500/20 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
          Transfer SOL
        </h2>
        <p className="text-cyan-200 text-lg">
          Send SOL securely with real-time conversion
        </p>
      </div>

      {/* Wallet Status */}
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
        <h3 className="font-semibold text-cyan-200 mb-3 text-lg">
          Wallet Status
        </h3>
        {!isPhantomInstalled() ? (
          <div className="text-red-300">
            <p className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
              <span>❌ Phantom wallet not detected</span>
            </p>
            <p className="text-sm mt-2 text-red-200">
              Install{" "}
              <a
                href="https://phantom.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-cyan-300 hover:text-cyan-200"
              >
                Phantom Wallet
              </a>
            </p>
          </div>
        ) : connecting ? (
          <div className="text-cyan-300">
            <p className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span>🔄 Connecting to wallet...</span>
            </p>
          </div>
        ) : connected ? (
          <div className="text-green-300">
            <p className="flex items-center space-x-2 mb-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>✅ Connected to Phantom</span>
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm mt-3">
              <div>
                <span className="text-cyan-200">Address:</span>
                <p className="text-white font-mono truncate">
                  {publicKey?.toString().slice(0, 8)}...
                  {publicKey?.toString().slice(-8)}
                </p>
              </div>
              <div>
                <span className="text-cyan-200">Balance:</span>
                <p className="text-white font-semibold">
                  {balance !== null
                    ? `${balance.toFixed(4)} SOL`
                    : "Loading..."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-yellow-300">
            <p className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span>⚠️ Click "Select Wallet" to connect</span>
            </p>
          </div>
        )}
      </div>

      {/* Transfer Form */}
      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-cyan-200 font-semibold mb-3 text-lg">
            Amount (SOL)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.000000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-4 bg-white/5 border border-cyan-400/30 rounded-2xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 text-lg"
              placeholder="0.00"
              disabled={!connected || isLoading}
            />
            {showUSD && usdValue && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full text-sm border border-cyan-400/30">
                  ${usdValue} USD
                </span>
              </div>
            )}
          </div>
        </div>

        {/* To Address Input */}
        <div>
          <label className="block text-cyan-200 font-semibold mb-3 text-lg">
            To Wallet Address
          </label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="w-full px-4 py-4 bg-white/5 border border-cyan-400/30 rounded-2xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 font-mono text-lg"
            placeholder="Enter Solana address"
            disabled={!connected || isLoading}
          />
        </div>

        {/* USD Toggle */}
        <div className="flex items-center space-x-3 p-4 bg-cyan-500/10 rounded-2xl border border-cyan-400/20">
          <input
            type="checkbox"
            id="showUSD"
            checked={showUSD}
            onChange={(e) => setShowUSD(e.target.checked)}
            className="w-5 h-5 text-cyan-400 bg-white/10 border-cyan-400/50 rounded focus:ring-cyan-400 focus:ring-2"
            disabled={!connected || isLoading}
          />
          <label
            htmlFor="showUSD"
            className="text-cyan-200 font-medium cursor-pointer"
          >
            Show USD conversion
          </label>
        </div>

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={isLoading || !connected}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing Transfer...</span>
            </div>
          ) : connected ? (
            "🚀 Transfer SOL"
          ) : (
            "Connect Wallet to Transfer"
          )}
        </button>

        {/* Install Phantom CTA */}
        {!isPhantomInstalled() && (
          <div className="text-center pt-4">
            <a
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition-transform duration-300 shadow-2xl shadow-purple-500/25"
            >
              <span>✨ Install Phantom Wallet</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferForm;
