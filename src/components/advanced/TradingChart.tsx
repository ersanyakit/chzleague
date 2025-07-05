import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

interface TradingChartProps {
  isDarkMode: boolean;
  timeframe: '24h' | '7d' | '30d';
  data: Array<{ time: string; volume: number; price: number }>;
}

const TradingChart: React.FC<TradingChartProps> = ({ isDarkMode, timeframe, data }) => {
  const [activeMetric, setActiveMetric] = useState<'volume' | 'price'>('volume');
  
  const maxValue = Math.max(...data.map(d => activeMetric === 'volume' ? d.volume : d.price));
  const minValue = Math.min(...data.map(d => activeMetric === 'volume' ? d.volume : d.price));
  
  const generatePath = () => {
    const width = 300;
    const height = 120;
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const value = activeMetric === 'volume' ? point.volume : point.price;
      const y = height - ((value - minValue) / (maxValue - minValue)) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const generateGradientPath = () => {
    const width = 300;
    const height = 120;
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const value = activeMetric === 'volume' ? point.volume : point.price;
      const y = height - ((value - minValue) / (maxValue - minValue)) * height;
      return `${x},${y}`;
    });
    return `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;
  };

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl ${
      isDarkMode 
        ? 'bg-gray-900/40 border-gray-700/30' 
        : 'bg-white/60 border-white/40'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
            <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Trading Analytics
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {timeframe} overview
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveMetric('volume')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeMetric === 'volume'
                ? 'bg-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Volume
          </button>
          <button
            onClick={() => setActiveMetric('price')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeMetric === 'price'
                ? 'bg-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Price
          </button>
        </div>
      </div>

      <div className="relative h-32 mb-4">
        <svg width="100%" height="120" className="overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          <motion.path
            d={generateGradientPath()}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          
          <motion.path
            d={generatePath()}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 300;
            const value = activeMetric === 'volume' ? point.volume : point.price;
            const y = 120 - ((value - minValue) / (maxValue - minValue)) * 120;
            
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#3B82F6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="cursor-pointer hover:r-4 transition-all"
              />
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {activeMetric === 'volume' ? '2.4M' : '$0.087'}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Current {activeMetric}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-lg font-bold text-green-500">+12.5%</span>
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            24h Change
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {activeMetric === 'volume' ? '3.1M' : '$0.095'}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            24h High
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;