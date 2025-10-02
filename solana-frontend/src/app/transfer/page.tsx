"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import TransferForm from "../../../components/TransferForm";
import { useState, useEffect } from "react";

// Dynamically import the wallet button to avoid SSR with loading state
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold animate-pulse">
        Loading Wallet...
      </div>
    ),
  }
);

export default function TransferPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-cyan-200 text-lg">
            Loading Transfer Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Back Button */}
            <Link
              href="/"
              className="group flex items-center space-x-2 text-cyan-200 hover:text-white transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-semibold">Back to Home</span>
            </Link>

            {/* Page Title */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                SOL Transfer
              </h1>
            </div>

            {/* Wallet Button */}
            <div className="transform hover:scale-105 transition-transform duration-300">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Transfer Stats Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  Lightning
                </div>
                <div className="text-sm text-cyan-200 mt-1">Fast Transfers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">Secure</div>
                <div className="text-sm text-blue-200 mt-1">
                  Phantom Protected
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-400">
                  Real-time
                </div>
                <div className="text-sm text-indigo-200 mt-1">
                  USD Conversion
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Form */}
          <TransferForm />
        </div>
      </main>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${7 + Math.random() * 7}s`,
            }}
          />
        ))}
      </div>

      {/* Network Status */}
      <div className="fixed bottom-6 left-6">
        <div className="flex items-center space-x-2 bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 text-blue-200 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Devnet</span>
        </div>
      </div>
    </div>
  );
}
