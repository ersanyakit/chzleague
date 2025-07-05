import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Activity, DollarSign, Zap } from 'lucide-react';
import { LeaderboardStats, Token } from '../types/leaderboard';

interface StatsGridProps {
  stats: LeaderboardStats;
  nativeToken: Token;
  baseToken: Token;
  isDarkMode: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  nativeToken,
  baseToken,
  isDarkMode
}) => {
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

  const statItems = [
    {
      label: `Total ${nativeToken.symbol} Volume`,
      value: formatNumber(stats.totalVolume.chz),
      subValue: formatCurrency(stats.totalVolume.usd),
      change: 12.5,
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: `Total ${baseToken.symbol} Volume`,
      value: formatNumber(stats.totalVolume.token),
      subValue: formatCurrency(stats.totalVolume.usd * 0.6),
      change: 8.3,
      icon: Activity,
      color: 'purple'
    },
    {
      label: 'Active Traders',
      value: formatNumber(stats.activeTraders),
      subValue: `${stats.newTraders24h} new today`,
      change: 15.2,
      icon: Users,
      color: 'green'
    },
    {
      label: 'Total Transactions',
      value: formatNumber(stats.totalTransactions),
      subValue: `Avg: ${formatCurrency(stats.avgTransactionSize)}`,
      change: 22.1,
      icon: Zap,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600',
      purple: isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600',
      green: isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600',
      orange: isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 group cursor-pointer ${
            isDarkMode 
              ? 'bg-gray-900/40 border-gray-700/30 hover:bg-gray-900/60' 
              : 'bg-white/60 border-white/40 hover:bg-white/80'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl transition-all group-hover:scale-110 ${getColorClasses(item.color)}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1">
              {item.change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                item.change > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {item.change > 0 ? '+' : ''}{item.change}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors`}>
              {item.value}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.subValue}
            </div>
            <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {item.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;