import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useTheme, useTokens } from '../contexts/ThemeContext';

interface Swap {
  ID: string;
  TxHash: string;
  TxFromAddress: string;
  Timestamp: string;
  FromTokenAmount: number;
  ToTokenAmount: number;
  PriceFrom: number;
  PriceTo: number;
  PriceFromInUSD: number;
  PriceToInUSD: number;
  FromTokenTotalInUSD: number;
  ToTokenTotalInUSD: number;
  FromTokenSymbol: string;
  ToTokenSymbol: string;
  FromTokenAddress: string;
  ToTokenAddress: string;
  FromTokenImage: string;
  ToTokenImage: string;
}

const GetRecentSwaps: React.FC<{ onAddressClick?: (address: string, ticker?: string) => void }> = ({ onAddressClick }) => {
  const { isDarkMode } = useTheme();
  const { selectedToken } = useTokens();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSwaps = async () => {
    if (!selectedToken) {
      setSwaps([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://api.kewl.exchange/swaps?ticker=${selectedToken.symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSwaps(data);
    } catch (err) {
      console.error('Error fetching swaps:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch swaps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, [selectedToken]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  const formatUSD = (num: number) => {
    return `$${num.toFixed(2)}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className={`${
        isDarkMode ? 'bg-gray-800/40' : 'bg-white/80'
      } backdrop-blur-sm p-4 rounded-xl border ${
        isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Swaps {selectedToken && `(${selectedToken.symbol})`}
          </h3>
          <RefreshCw className={`w-4 h-4 animate-spin ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`animate-pulse p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                <div className="flex-1">
                  <div className={`h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} mb-2`} />
                  <div className={`h-3 rounded w-2/3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${
        isDarkMode ? 'bg-gray-800/40' : 'bg-white/80'
      } backdrop-blur-sm p-4 rounded-xl border ${
        isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Swaps {selectedToken && `(${selectedToken.symbol})`}
          </h3>
          <button
            onClick={fetchSwaps}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className={`text-center py-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
          <p className="text-sm">Error: {error}</p>
          <button
            onClick={fetchSwaps}
            className={`mt-2 px-4 py-2 rounded-lg text-sm ${
              isDarkMode
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800/40' : 'bg-white/80'
    } backdrop-blur-sm p-4 rounded-xl border ${
      isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Swaps {selectedToken && `(${selectedToken.symbol})`}
        </h3>
        <button
          onClick={fetchSwaps}
          className={`p-2 rounded-lg transition-all ${
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
        {swaps.length === 0 ? (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-sm">
              {selectedToken 
                ? `No recent swaps for ${selectedToken.symbol}` 
                : 'Select a token to view recent swaps'
              }
            </p>
          </div>
        ) : (
          swaps.map((swap, index) => (
            <motion.div
              key={swap.ID}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                isDarkMode
                  ? 'bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/20'
                  : 'bg-gray-50/80 hover:bg-gray-100/90 border border-gray-200/30'
              }`}
            >
              {/* Header: Time and Address */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatTime(swap.Timestamp)}
                  </span>
                </div>
                <button
                  onClick={() => onAddressClick?.(swap.TxFromAddress)}
                  className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} transition-colors duration-200`}
                >
                  {shortenAddress(swap.TxFromAddress)}
                </button>
              </div>

              {/* Swap Details */}
              <div className="flex items-center justify-between">
                {/* From Token */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={swap.FromTokenImage}
                      alt={swap.FromTokenSymbol}
                      className="w-8 h-8 min-w-8 min-h-8 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold hidden">
                      {swap.FromTokenSymbol.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatNumber(swap.FromTokenAmount)}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {swap.FromTokenSymbol}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center">
                  <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatUSD(swap.FromTokenTotalInUSD)}
                  </div>
                </div>

                {/* To Token */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatNumber(swap.ToTokenAmount)}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {swap.ToTokenSymbol}
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={swap.ToTokenImage}
                      alt={swap.ToTokenSymbol}
                      className="w-8 h-8 min-w-8 min-h-8 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold hidden">
                      {swap.ToTokenSymbol.charAt(0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="mt-2 pt-2 border-t border-gray-200/20">
                <div className="flex justify-between items-center text-xs">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Price: ${swap.PriceFromInUSD.toFixed(12)} → ${swap.PriceToInUSD.toFixed(12)}
                  </span>
                  <div className="flex items-center gap-1">
                    {swap.PriceToInUSD > swap.PriceFromInUSD ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`font-medium ${
                      swap.PriceToInUSD > swap.PriceFromInUSD ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {((swap.PriceToInUSD / swap.PriceFromInUSD - 1) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default GetRecentSwaps; 