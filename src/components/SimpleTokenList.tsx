import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Token } from '../types/leaderboard';

interface SimpleTokenListProps {
  tokens: Token[];
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
  isDarkMode: boolean;
}

const SimpleTokenList: React.FC<SimpleTokenListProps> = ({
  tokens,
  selectedToken,
  onTokenSelect,
  isDarkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toFixed(2);
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800/40' : 'bg-white/80'
    } backdrop-blur-sm p-4 rounded-xl border ${
      isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
    }`}>
      <h3 className={`font-semibold text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Trading Pairs
      </h3>

      {/* Search */}
      <div className="relative mb-3">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm border ${
            isDarkMode 
              ? 'bg-gray-700/50 border-gray-600 text-gray-300 placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-red-500/40`}
        />
      </div>

      {/* Token List */}
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
        {filteredTokens.map((token, index) => (
          <motion.div
            key={token.address}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onTokenSelect(token)}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              selectedToken.address === token.address
                ? 'bg-red-500/20 border border-red-500/30'
                : isDarkMode
                  ? 'bg-gray-700/30 hover:bg-gray-700/50'
                  : 'bg-gray-50/80 hover:bg-gray-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                  selectedToken.address === token.address ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                  {token.symbol.charAt(0)}
                </div>
                
                <div>
                  <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {token.symbol}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {token.name}
                  </div>
                </div>
              </div>

              <div className="text-right">
                {token.price && (
                  <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
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
                    <span className={`text-xs font-medium ${
                      token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimpleTokenList;