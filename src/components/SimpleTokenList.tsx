import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Token } from '../types/leaderboard';

interface SimpleTokenListProps {
  tokens: Token[];
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
  isDarkMode: boolean;
}

interface TokenListResponse {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tags: Record<string, any>;
  logoURI: string;
  keywords: string[];
  tokens: Token[];
}

const SimpleTokenList: React.FC<SimpleTokenListProps> = ({
  tokens,
  selectedToken,
  onTokenSelect,
  isDarkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchedTokens, setFetchedTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tokens from GitHub repository
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/index.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: TokenListResponse = await response.json();
        
        // Add mock price data for demonstration (since the API doesn't include price data)
        const tokensWithMockData = data.tokens.map(token => ({
          ...token,
          price: Math.random() * 0.1 + 0.01, // Random price between 0.01 and 0.11
          change24h: (Math.random() - 0.5) * 20, // Random change between -10% and +10%
          volume24h: Math.random() * 2000000 + 100000, // Random volume between 100K and 2.1M
          marketCap: Math.random() * 100000000 + 1000000 // Random market cap between 1M and 101M
        }));
        
        setFetchedTokens(tokensWithMockData);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const filteredTokens = (fetchedTokens.length > 0 ? fetchedTokens : tokens).filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toFixed(2);
  };

  const getTokenLogo = (token: Token) => {
    if (token.logoURI) {
      return (
        <img 
          src={token.logoURI} 
          alt={token.symbol}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            // Fallback to symbol if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
        selectedToken.address === token.address ? 'bg-red-500' : 'bg-gray-500'
      }`}>
        {token.symbol.charAt(0)}
      </div>
    );
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800/40' : 'bg-white/80'
    } backdrop-blur-sm p-4 rounded-xl border ${
      isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
    } h-[100dvh]`}>
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
      <div className="space-y-2 max-h-[85dvh] overflow-y-auto scrollbar-hide">
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

        {!loading && !error && filteredTokens.map((token, index) => (
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
            <div className="flex items-center gap-3">
              <div className="relative">
                {getTokenLogo(token)}
                {/* Fallback symbol display */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                  selectedToken.address === token.address ? 'bg-red-500' : 'bg-gray-500'
                } hidden`}>
                  {token.symbol.charAt(0)}
                </div>
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimpleTokenList;