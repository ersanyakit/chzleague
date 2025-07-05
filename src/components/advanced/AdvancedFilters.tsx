import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, SlidersHorizontal, X, Star, Trophy, Shield } from 'lucide-react';

interface AdvancedFiltersProps {
  isDarkMode: boolean;
  onFilterChange: (filters: any) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ isDarkMode, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [minVolume, setMinVolume] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  const [sortBy, setSortBy] = useState('volume');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const tiers = [
    { value: 'all', label: 'All Tiers', color: 'gray' },
    { value: 'bronze', label: 'Bronze', color: 'amber' },
    { value: 'silver', label: 'Silver', color: 'gray' },
    { value: 'gold', label: 'Gold', color: 'yellow' },
    { value: 'platinum', label: 'Platinum', color: 'blue' },
    { value: 'diamond', label: 'Diamond', color: 'purple' }
  ];

  const sortOptions = [
    { value: 'volume', label: 'Volume' },
    { value: 'score', label: 'Score' },
    { value: 'transactions', label: 'Transactions' },
    { value: 'winRate', label: 'Win Rate' },
    { value: 'profitLoss', label: 'P&L' }
  ];

  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'all', label: 'All Time' }
  ];

  const handleApplyFilters = () => {
    onFilterChange({
      searchTerm,
      selectedTier,
      minVolume: minVolume ? parseFloat(minVolume) : 0,
      timeRange,
      sortBy,
      showVerifiedOnly
    });
    setIsOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTier('all');
    setMinVolume('');
    setTimeRange('24h');
    setSortBy('volume');
    setShowVerifiedOnly(false);
    onFilterChange({
      searchTerm: '',
      selectedTier: 'all',
      minVolume: 0,
      timeRange: '24h',
      sortBy: 'volume',
      showVerifiedOnly: false
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search by address, nickname, or Twitter handle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-400' 
                : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all backdrop-blur-sm`}
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 rounded-xl border transition-all ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
              : 'bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50'
          } backdrop-blur-sm`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-6 rounded-2xl border backdrop-blur-xl ${
              isDarkMode 
                ? 'bg-gray-900/40 border-gray-700/30' 
                : 'bg-white/60 border-white/40'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Advanced Filters
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tier Filter */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Trader Tier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {tiers.map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => setSelectedTier(tier.value)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTier === tier.value
                          ? 'bg-blue-500 text-white'
                          : isDarkMode
                            ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Time Range
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700/50 text-gray-300' 
                      : 'bg-white/80 border-gray-200 text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
                >
                  {timeRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700/50 text-gray-300' 
                      : 'bg-white/80 border-gray-200 text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Volume */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Minimum Volume (CHZ)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minVolume}
                  onChange={(e) => setMinVolume(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-400' 
                      : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
                />
              </div>

              {/* Verified Only */}
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Verified Only
                </label>
                <button
                  onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showVerifiedOnly ? 'bg-blue-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showVerifiedOnly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200/20">
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;