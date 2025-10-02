"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import the wallet button to avoid SSR with loading state
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold animate-pulse">
        Loading Wallet...
      </div>
    ),
  }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-purple-200 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          {/* Main Heading with Gradient Text */}
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Solana
            <span className="block text-4xl md:text-5xl mt-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Token Explorer
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover the future of decentralized finance with real-time token
            insights and seamless SOL transfers
          </p>

          {/* Wallet Connection Button */}
          <div className="flex justify-center mb-16">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <WalletMultiButton />
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Cosmo Card */}
            <Link href="/cosmo">
              <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer overflow-hidden">
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon Container */}
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <span className="text-3xl">🌌</span>
                </div>

                {/* Content */}
                <h3 className="relative z-10 text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                  Cosmo
                </h3>
                <p className="relative z-10 text-purple-100 text-lg leading-relaxed">
                  Immerse yourself in a live stream of new Solana tokens being
                  born. Watch the ecosystem evolve in real-time with advanced
                  analytics.
                </p>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 text-purple-300 group-hover:text-purple-100 transform group-hover:translate-x-2 transition-transform duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Transfer Card */}
            <Link href="/transfer">
              <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer overflow-hidden">
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon Container */}
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <span className="text-3xl">💸</span>
                </div>

                {/* Content */}
                <h3 className="relative z-10 text-3xl font-bold bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-4">
                  Transfer
                </h3>
                <p className="relative z-10 text-cyan-100 text-lg leading-relaxed">
                  Experience lightning-fast SOL transfers with real-time USD
                  conversion. Secure, seamless, and built for the future of
                  finance.
                </p>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 text-cyan-300 group-hover:text-cyan-100 transform group-hover:translate-x-2 transition-transform duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom Stats/Info */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">100%</div>
              <div className="text-sm">Real-time Data</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">Secure</div>
              <div className="text-sm">Phantom Integrated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">Fast</div>
              <div className="text-sm">Solana Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
