import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Wallet, Copy, Settings, Trophy, Gift } from 'lucide-react';
import { UserStats, Token } from '../types/leaderboard';
import { useTheme } from '../contexts/ThemeContext';

interface CompactUserStatsProps {
  userStats: UserStats;
  nativeToken: Token;
  baseToken: Token;
}

const CompactUserStats: React.FC<CompactUserStatsProps> = ({
  userStats,
  nativeToken,
  baseToken
}) => {
  const { isDarkMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'from-amber-600 to-amber-800',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-red-400 to-red-600',
      diamond: 'from-red-500 to-red-700'
    };
    return colors[tier as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800/40' : 'bg-white/80'
    } backdrop-blur-sm p-4 rounded-xl border ${
      isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getTierColor(userStats.tier)} flex items-center justify-center`}>
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Profile
            </h3>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {userStats.tier.charAt(0).toUpperCase() + userStats.tier.slice(1)} Tier
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-gray-700/50 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-3 h-3 text-red-500" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Rank
            </span>
          </div>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            #{userStats.rank}
          </div>
        </div>

        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-3 h-3 text-red-500" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Score
            </span>
          </div>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatNumber(userStats.score)}
          </div>
        </div>
      </div>

      {/* Volume Stats */}
      <div className="space-y-3">
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
            Total Volume
          </div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ${formatNumber(userStats.totalVolume.usd)}
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className={`${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {formatNumber(userStats.totalVolume.chz)} {nativeToken.symbol}
            </span>
            <span className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {formatNumber(userStats.totalVolume.token)} {baseToken.symbol}
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                P&L
              </div>
              <div className={`text-sm font-bold ${userStats.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {userStats.profitLoss >= 0 ? '+' : ''}{userStats.profitLoss.toFixed(1)}%
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Win Rate
              </div>
              <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {userStats.winRate.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className={`p-3 rounded-lg mt-3 ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {userStats.address.slice(0, 8)}...{userStats.address.slice(-6)}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(userStats.address)}
            className={`p-1 rounded hover:bg-gray-500/20 transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            <input
              type="text"
              placeholder="Nickname"
              className={`w-full px-3 py-2 rounded-lg text-sm border ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-gray-300 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-red-500/40`}
            />
            <input
              type="text"
              placeholder="@twitter"
              className={`w-full px-3 py-2 rounded-lg text-sm border ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-gray-300 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-red-500/40`}
            />
            <button className="w-full py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
              Update Profile
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompactUserStats;