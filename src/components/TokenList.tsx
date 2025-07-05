import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, TrendingUp, TrendingDown, Filter, BarChart3 } from 'lucide-react';
import { Token } from '../types/leaderboard';

interface TokenListProps {
  tokens: Token[];
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
  isDarkMode: boolean;
}

const TokenList: React.FC<TokenListProps> = ({
  tokens,
  selectedToken,
  onTokenSelect,
  isDarkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'volume' | 'price' | 'change'>('volume');

  const filteredTokens = tokens
    .filter(token => {
      const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return (b.volume24h || 0) - (a.volume24h || 0);
        case 'price':
          return (b.price || 0) - (a.price || 0);
        case 'change':
          return (b.change24h || 0) - (a.change24h || 0);
        default:
          return 0;
      }
    });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(2);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900/40' : 'bg-white/60'} backdrop-blur-xl p-6 rounded-2xl border ${isDarkMode ? 'border-gray-700/30' : 'border-white/40'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
            <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Trading Pairs
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Select trading pair
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFavoriteOnly(!favoriteOnly)}
            className={`p-2 rounded-xl transition-all ${
              favoriteOnly
                ? 'bg-yellow-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Star className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-400' 
              : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all backdrop-blur-sm`}
        />
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'volume', label: 'Volume' },
          { key: 'price', label: 'Price' },
          { key: 'change', label: 'Change' }
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setSortBy(option.key as any)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              sortBy === option.key
                ? 'bg-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Token List */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
        {filteredTokens.map((token, index) => (
          <motion.div
            key={token.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onTokenSelect(token)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedToken.address === token.address
                ? 'bg-blue-500/20 border border-blue-500/30'
                : isDarkMode
                  ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/30'
                  : 'bg-white/50 hover:bg-white/70 border border-gray-200/30'
            } backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  selectedToken.address === token.address ? 'bg-blue-500' : 'bg-gradient-to-br from-gray-400 to-gray-600'
                }`}>
                  {token.symbol.charAt(0)}
                </div>
                
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {token.symbol}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {token.name}
                  </div>
                </div>
              </div>

              <div className="text-right">
                {token.price && (
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${token.price.toFixed(4)}
                  </div>
                )}
                {token.change24h !== undefined && (
                  <div className="flex items-center gap-1">
                    {token.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {token.volume24h && (
              <div className="mt-3 pt-3 border-t border-gray-200/20">
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    24h Volume
                  </span>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ${formatNumber(token.volume24h)}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;