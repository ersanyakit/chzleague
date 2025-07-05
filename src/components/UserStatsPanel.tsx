import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Wallet, Copy, Trophy, Gift, Star, Shield, TrendingUp, Award, Settings, ExternalLink } from 'lucide-react';
import { UserStats, Token } from '../types/leaderboard';

interface UserStatsPanelProps {
  userStats: UserStats;
  nativeToken: Token;
  baseToken: Token;
  isDarkMode: boolean;
}

const UserStatsPanel: React.FC<UserStatsPanelProps> = ({
  userStats,
  nativeToken,
  baseToken,
  isDarkMode
}) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'rewards'>('overview');
  const [formData, setFormData] = useState({
    nickname: '',
    twitterHandle: '',
    telegramHandle: ''
  });

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration data:', formData);
    setShowRegistration(false);
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'rewards', label: 'Rewards', icon: Gift }
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-900/40' : 'bg-white/60'} backdrop-blur-xl p-6 rounded-2xl border ${isDarkMode ? 'border-gray-700/30' : 'border-white/40'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${getTierColor(userStats.tier)}`}>
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Profile
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {userStats.tier.charAt(0).toUpperCase() + userStats.tier.slice(1)} Tier
              </span>
              {userStats.isVerified && (
                <Shield className="w-4 h-4 text-blue-500" />
              )}
            </div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRegistration(!showRegistration)}
          className={`p-2 rounded-xl transition-all ${
            isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Registration Form */}
      <AnimatePresence>
        {showRegistration && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nickname
                </label>
                <input
                  type="text"
                  placeholder="Your nickname"
                  value={formData.nickname}
                  onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-400' 
                      : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all backdrop-blur-sm`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Twitter Handle
                </label>
                <input
                  type="text"
                  placeholder="@twitter"
                  value={formData.twitterHandle}
                  onChange={(e) => setFormData({...formData, twitterHandle: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-400' 
                      : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all backdrop-blur-sm`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Telegram Handle
                </label>
                <input
                  type="text"
                  placeholder="@telegram"
                  value={formData.telegramHandle}
                  onChange={(e) => setFormData({...formData, telegramHandle: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-400' 
                      : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all backdrop-blur-sm`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegistration(false)}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Address */}
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'} group`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wallet className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Wallet Address
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(userStats.address)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className={`font-mono text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {userStats.address}
                </div>
              </div>

              {/* Rank & Score */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Current Rank
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    #{userStats.rank}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Best: #{userStats.bestRank}
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Score
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round(userStats.score).toLocaleString()}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {userStats.tradingStreak} day streak
                  </div>
                </div>
              </div>

              {/* Volume Stats */}
              <div className="space-y-3">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                  <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Total {nativeToken.symbol} Volume
                  </div>
                  <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatNumber(userStats.totalVolume.chz)}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatCurrency(userStats.totalVolume.usd)}
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                  <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Total {baseToken.symbol} Volume
                  </div>
                  <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatNumber(userStats.totalVolume.token)}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatCurrency(userStats.totalVolume.usd * 0.6)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-4">
              {/* P&L and Win Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                  <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Profit & Loss
                  </div>
                  <div className={`text-2xl font-bold ${userStats.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {userStats.profitLoss >= 0 ? '+' : ''}{userStats.profitLoss.toFixed(1)}%
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                  <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Win Rate
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {userStats.winRate.toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Trading Stats */}
              <div className="space-y-3">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                  <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Total Transactions
                  </div>
                  <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatNumber(userStats.transactionCount)}
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                  <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Average Transaction Size
                  </div>
                  <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(userStats.avgTransactionSize)}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              {userStats.badges.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Achievements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userStats.badges.map((badge, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
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

          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total Rewards Earned
                </div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(userStats.totalRewards)}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium text-lg flex items-center justify-center gap-2 shadow-lg"
              >
                <Gift className="w-5 h-5" />
                Claim Available Rewards
              </motion.button>

              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                  Next reward tier in {formatNumber(50000 - userStats.totalVolume.usd)} USD volume
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserStatsPanel;