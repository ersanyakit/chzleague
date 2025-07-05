import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Activity } from 'lucide-react';
import { LeaderboardStats, Token } from '../types/leaderboard';
import { useTheme } from '../contexts/ThemeContext';

interface MinimalStatsProps {
  stats: LeaderboardStats;
  nativeToken: Token;
  baseToken: Token;
}

const MinimalStats: React.FC<MinimalStatsProps> = ({
  stats,
  nativeToken,
  baseToken
}) => {
  const { isDarkMode } = useTheme();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-3 rounded-xl ${
          isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
        } backdrop-blur-sm border ${
          isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-3 h-3 text-red-500" />
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Volume 24h
          </span>
        </div>
        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          ${formatNumber(stats.dailyVolume.usd)}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-3 rounded-xl ${
          isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
        } backdrop-blur-sm border ${
          isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-3 h-3 text-green-500" />
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Active
          </span>
        </div>
        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {formatNumber(stats.activeTraders)}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-3 rounded-xl ${
          isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
        } backdrop-blur-sm border ${
          isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3 h-3 text-red-500" />
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Trades
          </span>
        </div>
        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {formatNumber(stats.totalTransactions)}
        </div>
      </motion.div>
    </div>
  );
};

export default MinimalStats;