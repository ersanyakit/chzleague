import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Zap } from 'lucide-react';
import { MarketData } from '../../types/leaderboard';

interface MarketOverviewProps {
  marketData: MarketData;
  isDarkMode: boolean;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ marketData, isDarkMode }) => {
  const metrics = [
    {
      label: 'CHZ Price',
      value: `$${marketData.chzPrice.toFixed(4)}`,
      change: marketData.chzChange24h,
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Total Liquidity',
      value: `$${(marketData.totalLiquidity / 1000000).toFixed(2)}M`,
      change: 5.2,
      icon: Activity,
      color: 'green'
    },
    {
      label: '24h Volume',
      value: `$${(marketData.volume24h / 1000000).toFixed(2)}M`,
      change: 18.7,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      label: '24h Fees',
      value: `$${(marketData.fees24h / 1000).toFixed(1)}K`,
      change: 12.3,
      icon: Zap,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600',
      green: isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600',
      purple: isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600',
      orange: isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 rounded-2xl border backdrop-blur-xl ${
            isDarkMode 
              ? 'bg-gray-900/40 border-gray-700/30' 
              : 'bg-white/60 border-white/40'
          } hover:scale-105 transition-all duration-300 group cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${getColorClasses(metric.color)}`}>
              <metric.icon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1">
              {metric.change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                metric.change > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors`}>
              {metric.value}
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {metric.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MarketOverview;