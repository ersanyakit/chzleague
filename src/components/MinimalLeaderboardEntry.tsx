import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Copy } from 'lucide-react';
import { LeaderboardEntry as LeaderboardEntryType, Token } from '../types/leaderboard';
import { useTheme } from '../contexts/ThemeContext';

interface MinimalLeaderboardEntryProps {
  entry: LeaderboardEntryType;
  index: number;
  nativeToken: Token;
  baseToken: Token;
}

const MinimalLeaderboardEntry: React.FC<MinimalLeaderboardEntryProps> = ({
  entry,
  index,
  nativeToken,
  baseToken
}) => {
  const { isDarkMode } = useTheme();

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500';
    if (rank === 2) return 'bg-gray-400';
    if (rank === 3) return 'bg-amber-600';
    return isDarkMode ? 'bg-gray-600' : 'bg-gray-400';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate combined percentage for unified progress bar
  const totalPercentage = entry.percentageOfTotal.chz + entry.percentageOfTotal.token;
  const chzRatio = entry.percentageOfTotal.chz / totalPercentage;
  const tokenRatio = entry.percentageOfTotal.token / totalPercentage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
        isDarkMode
          ? 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/30'
          : 'bg-white/80 hover:bg-white/90 border border-gray-200/50'
      } backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        {/* Left: Rank & User */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${getRankColor(entry.rank)} flex items-center justify-center text-white font-bold text-sm`}>
            {entry.rank}
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {entry.nickname || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
              </span>
              {entry.isVerified && <Shield className="w-3 h-3 text-red-500" />}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Score: {Math.round(entry.score).toLocaleString()}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(entry.address);
                }}
                className={`p-1 rounded hover:bg-gray-500/20 transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Volume Stats */}
        <div className="text-right">
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ${formatNumber(entry.totalVolume.usd)}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {formatNumber(entry.totalVolume.chz)} {nativeToken.symbol}
            </span>
            <span className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {formatNumber(entry.totalVolume.token)} {baseToken.symbol}
            </span>
          </div>
        </div>
      </div>

      {/* Combined Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {nativeToken.symbol}
              </span>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                {entry.percentageOfTotal.chz.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {baseToken.symbol}
              </span>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {entry.percentageOfTotal.token.toFixed(1)}%
              </span>
            </div>
          </div>
          <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {totalPercentage.toFixed(1)}%
          </span>
        </div>
        
        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className="h-full flex">
            <motion.div
              className="bg-red-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(entry.percentageOfTotal.chz / Math.max(totalPercentage, 1)) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
            <motion.div
              className="bg-purple-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(entry.percentageOfTotal.token / Math.max(totalPercentage, 1)) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MinimalLeaderboardEntry;