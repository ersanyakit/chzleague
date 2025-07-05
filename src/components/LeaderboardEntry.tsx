import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, ExternalLink, Copy, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { LeaderboardEntry as LeaderboardEntryType, Token } from '../types/leaderboard';

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
  index: number;
  nativeToken: Token;
  baseToken: Token;
  totalStats: { chz: number; token: number; usd: number };
  isDarkMode: boolean;
}

const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({
  entry,
  index,
  nativeToken,
  baseToken,
  totalStats,
  isDarkMode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-amber-400 to-amber-600';
    return isDarkMode ? 'from-gray-600 to-gray-700' : 'from-gray-200 to-gray-400';
  };

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'from-amber-600 to-amber-800',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-blue-400 to-blue-600',
      diamond: 'from-purple-400 to-purple-600'
    };
    return colors[tier as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const getProgressWidth = (value: number, total: number) => {
    return Math.min(100, (value / (total || 1)) * 100);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 group cursor-pointer ${
        isDarkMode
          ? 'bg-gray-900/40 border-gray-700/30 hover:bg-gray-900/60 hover:border-gray-600/50'
          : 'bg-white/60 border-white/40 hover:bg-white/80 hover:border-gray-200'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Rank Badge */}
      <div className="absolute -top-3 -left-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center shadow-lg`}>
          <span className="text-white font-bold text-lg">#{entry.rank}</span>
        </div>
      </div>

      {/* Tier Badge */}
      <div className="absolute -top-2 -right-2">
        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getTierColor(entry.tier)} text-white text-xs font-bold uppercase shadow-lg`}>
          {entry.tier}
        </div>
      </div>

      <div className="ml-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors`}>
                  {entry.nickname || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                </span>
                {entry.isVerified && (
                  <Shield className="w-4 h-4 text-blue-500" />
                )}
                {entry.badges.length > 0 && (
                  <Award className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {entry.twitterHandle && (
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    @{entry.twitterHandle}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(entry.address);
                  }}
                  className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} transition-colors`}
                >
                  <span className="font-mono text-xs">{entry.address.slice(0, 8)}...</span>
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(entry.score).toLocaleString()}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Score
            </div>
          </div>
        </div>

        {/* Volume Bars */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {nativeToken.symbol} Volume
              </span>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {entry.percentageOfTotal.chz.toFixed(1)}%
              </span>
            </div>
            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} overflow-hidden`}>
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressWidth(entry.totalVolume.chz, totalStats.chz)}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatNumber(entry.totalVolume.chz)} {nativeToken.symbol}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {baseToken.symbol} Volume
              </span>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {entry.percentageOfTotal.token.toFixed(1)}%
              </span>
            </div>
            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} overflow-hidden`}>
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressWidth(entry.totalVolume.token, totalStats.token)}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatNumber(entry.totalVolume.token)} {baseToken.symbol}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatCurrency(entry.totalVolume.usd)}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total USD
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold ${entry.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {entry.profitLoss >= 0 ? '+' : ''}{entry.profitLoss.toFixed(1)}%
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              P&L
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {entry.winRate.toFixed(0)}%
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Win Rate
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatNumber(entry.transactionCount)}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Trades
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {isExpanded && (
            <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} space-y-4`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Weekly Performance
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {nativeToken.symbol} Volume:
                      </span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(entry.weeklyVolume.chz)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {baseToken.symbol} Volume:
                      </span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(entry.weeklyVolume.token)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Trading Stats
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Avg Trade Size:
                      </span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(entry.avgTransactionSize)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Last Trade:
                      </span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {entry.lastTradeTime.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {entry.badges.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Achievements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.badges.map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeaderboardEntry;