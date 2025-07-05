import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Token } from '../types/leaderboard';
import { useTokens, useTheme } from '../contexts/ThemeContext';

interface SimpleTokenListProps {
  onFetchData?: (token: Token) => void;
}

const SimpleTokenList: React.FC<SimpleTokenListProps> = ({
  onFetchData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { tokens, selectedToken, loading, error, setSelectedToken } = useTokens();
  const { isDarkMode } = useTheme();

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toFixed(2);
  };

  const getTokenLogo = (token: Token) => {
    const isSelected = selectedToken?.address === token.address;
    
    if (token.logoURI) {
      return (
        <div className="relative">
          <img 
            src={token.logoURI} 
            alt={token.symbol}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              // Fallback to symbol if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          {/* Fallback symbol display */}
          <div className={`logo-fallback w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
            isSelected ? 'bg-red-500' : 'bg-gray-500'
          } hidden absolute top-0 left-0`}>
            {token.symbol.charAt(0)}
          </div>
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 flex items-center justify-center shadow-lg z-10">
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="relative">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
          isSelected ? 'bg-red-500' : 'bg-gray-500'
        }`}>
          {token.symbol.charAt(0)}
        </div>
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 flex items-center justify-center shadow-lg z-10">
            <div className="w-1 h-1 rounded-full bg-white"></div>
          </div>
        )}
      </div>
    );
  };

  // Handle token selection with fetch
  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    if (onFetchData) {
      onFetchData(token);
    }
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800/40' : 'bg-white/80'
    } backdrop-blur-sm p-4 rounded-xl border ${
      isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
    } h-[50vh] lg:h-[100dvh]`}>
      <h3 className={`font-semibold text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Chiliz Tokens
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
      <div className="space-y-2 max-h-[calc(50vh-120px)] lg:max-h-[85dvh] overflow-y-auto scrollbar-hide px-1">
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Loading...
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-4">
            <div className={`text-xs text-red-500`}>
              Error: {error}
            </div>
          </div>
        )}

        {!loading && !error && filteredTokens.length === 0 && (
          <div className="flex items-center justify-center py-4">
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No tokens found
            </div>
          </div>
        )}

        {!loading && !error && filteredTokens.map((token, index) => {
          const isSelected = selectedToken?.address === token.address;
          
          return (
            <motion.div
              key={token.address}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: isSelected ? 1.01 : 1
              }}
              transition={{ 
                delay: index * 0.05,
                scale: { duration: 0.2 }
              }}
              whileHover={{ 
                scale: isSelected ? 1.01 : 1.02
              }}
              whileTap={{ 
                scale: 0.98
              }}
              onClick={() => handleTokenSelect(token)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 transform ${
                isSelected
                  ? isDarkMode 
                    ? 'bg-red-500/30 border-2 border-red-500/60 shadow-lg shadow-red-500/20'
                    : 'bg-red-500/20 border-2 border-red-500/50 shadow-lg shadow-red-500/10'
                  : isDarkMode
                    ? 'bg-gray-700/30 hover:bg-gray-700/50 hover:shadow-md border border-transparent hover:border-gray-600/30'
                    : 'bg-gray-50/80 hover:bg-gray-100/90 hover:shadow-md border border-transparent hover:border-gray-300/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {getTokenLogo(token)}
                
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {token.symbol}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {token.name}
                  </div>
                </div>
                
                {/* Selection checkmark for better visibility */}
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleTokenList;