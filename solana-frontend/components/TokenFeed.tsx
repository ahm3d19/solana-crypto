'use client';

import React, { useEffect, useState } from 'react';

interface TokenData {
  name: string;
  symbol: string;
  uri: string;
  mint: string;
}

interface TokenMetadata {
  name: string;
  symbol: string;
  image?: string;
  description?: string;
}

const TokenFeed: React.FC = () => {
  const [tokens, setTokens] = useState<(TokenData & { image?: string })[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      try {
        ws = new WebSocket('ws://localhost:8080/connect');

        ws.onopen = () => {
          console.log('✅ WebSocket connected to Go backend');
          setIsConnected(true);
          setError('');
        };

        ws.onmessage = async (event) => {
          try {
            const tokenData: TokenData = JSON.parse(event.data);
            console.log('📨 Received token:', tokenData);
            
            // Try to fetch metadata from the URI
            let imageUrl = '';
            try {
              const metadataResponse = await fetch(tokenData.uri);
              if (metadataResponse.ok) {
                const metadata: TokenMetadata = await metadataResponse.json();
                imageUrl = metadata.image || '';
              }
            } catch (metadataError) {
              console.log('Could not fetch metadata for token:', tokenData.name);
            }

            const tokenWithImage = {
              ...tokenData,
              image: imageUrl
            };

            setTokens(prev => [tokenWithImage, ...prev.slice(0, 49)]); // Keep last 50 tokens
          } catch (error) {
            console.error('❌ Error parsing token data:', error);
          }
        };

        ws.onclose = (event) => {
          console.log('🔌 WebSocket disconnected:', event.code, event.reason);
          setIsConnected(false);
          
          if (event.code !== 1000) {
            setError('Disconnected from server. Retrying in 3 seconds...');
            reconnectTimeout = setTimeout(connectWebSocket, 3000);
          }
        };

        ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          setIsConnected(false);
          setError('Failed to connect to WebSocket server.');
        };
      } catch (error) {
        console.error('❌ Error creating WebSocket:', error);
        setError('Failed to create WebSocket connection');
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close(1000, 'Component unmounting');
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [isClient]);

  const formatMintAddress = (mint: string) => {
    return `${mint.slice(0, 8)}...${mint.slice(-8)}`;
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Initializing token feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Live Token Universe
          </h1>
          <p className="text-purple-200 text-lg">
            Watch new Solana tokens being born in real-time
          </p>
        </div>
        
        <div className="flex items-center space-x-6 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-purple-200 font-medium">
              {isConnected ? 'Live Feed' : 'Disconnected'}
            </span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{tokens.length}</div>
            <div className="text-sm text-purple-300">Tokens Tracked</div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {error && (
        <div className="bg-red-500/10 backdrop-blur-lg border border-red-400/30 text-red-200 px-6 py-4 rounded-2xl mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            <div>
              <p className="font-semibold">Connection Issue</p>
              <p className="text-sm mt-1 opacity-90">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!error && isConnected && (
        <div className="bg-green-500/10 backdrop-blur-lg border border-green-400/30 text-green-200 px-6 py-4 rounded-2xl mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="font-semibold">✅ Connected to Solana Mainnet</p>
              <p className="text-sm mt-1 opacity-90">Receiving real-time token creation events</p>
            </div>
          </div>
        </div>
      )}

      {/* Token Grid */}
      <div className="grid gap-4">
        {tokens.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-purple-300">🌌</span>
            </div>
            <h3 className="text-2xl font-bold text-purple-200 mb-2">Waiting for Tokens</h3>
            <p className="text-purple-300 max-w-md mx-auto">
              New Solana tokens will appear here as they're created on the blockchain...
            </p>
            {!isConnected && (
              <p className="text-sm text-purple-400 mt-4">Establishing connection to Solana network...</p>
            )}
          </div>
        ) : (
          tokens.map((token, index) => (
            <div 
              key={`${token.mint}-${index}`} 
              className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-500 hover:transform hover:scale-[1.02]"
            >
              <div className="flex items-start space-x-4">
                {/* Token Image */}
                {token.image ? (
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-purple-400/50 transition-colors duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcikiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjMyIiB5MT0iMCIgeDI9IjMyIiB5Mj0iNjQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzhCNThGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2QjNGRkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj4/PC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white/10">
                    {token.symbol.slice(0, 3)}
                  </div>
                )}
                
                {/* Token Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300 truncate max-w-xs">
                        {token.name}
                      </h3>
                      <span className="text-sm text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30">
                        {token.symbol}
                      </span>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-400/20">
                        New
                      </span>
                      <span className="text-xs text-purple-400">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-purple-300 font-mono text-sm mb-2 truncate">
                    {formatMintAddress(token.mint)}
                  </p>
                  
                  {token.uri && (
                    <p className="text-xs text-purple-400 truncate">
                      📍 {token.uri.slice(0, 60)}...
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Live Indicator */}
      {isConnected && tokens.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-lg border border-green-400/30 text-green-200 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">LIVE</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenFeed;