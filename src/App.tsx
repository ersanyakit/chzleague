import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, BarChart3, Search, Filter } from 'lucide-react';
import VolumeCompetitionCalendar from './components/VolumeCompetitionCalendar';
import MinimalStats from './components/MinimalStats';
import MinimalLeaderboardEntry from './components/MinimalLeaderboardEntry';
import CompactUserStats from './components/CompactUserStats';
import SimpleTokenList from './components/SimpleTokenList';
import { LeaderboardEntry as LeaderboardEntryType, LeaderboardStats, UserStats, Token } from './types/leaderboard';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const nativeToken: Token = {
    symbol: 'CHZ',
    name: 'Chiliz',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    price: 0.087,
    change24h: 12.5,
    volume24h: 2400000,
    marketCap: 580000000
  };

  const baseToken: Token = {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xa0b86a33e6441e0a7a5abcf5d45b37b1a11b7e9f',
    decimals: 6,
    price: 1.00,
    change24h: 0.1,
    volume24h: 1800000,
    marketCap: 95000000000
  };

  const mockTokens: Token[] = [
    baseToken,
    { 
      symbol: 'USDC', 
      name: 'USD Coin', 
      address: '0xa0b86a33e6441e0a7a5abcf5d45b37b1a11b7e9f', 
      decimals: 6,
      price: 1.00,
      change24h: -0.05,
      volume24h: 1200000,
      marketCap: 32000000000
    },
    { 
      symbol: 'WETH', 
      name: 'Wrapped Ethereum', 
      address: '0xa0b86a33e6441e0a7a5abcf5d45b37b1a11b7e9f', 
      decimals: 18,
      price: 2450.75,
      change24h: 8.3,
      volume24h: 890000,
      marketCap: 295000000000
    }
  ];

  const mockStats: LeaderboardStats = {
    totalVolume: { chz: 1250000, token: 850000, usd: 108750 },
    dailyVolume: { chz: 45000, token: 32000, usd: 3915 },
    weeklyVolume: { chz: 315000, token: 224000, usd: 27405 },
    totalTraders: 1247,
    activeTraders: 189,
    newTraders24h: 23,
    totalTransactions: 8942,
    avgTransactionSize: 1250,
    topGainer: { address: '0x1234...', gain: 45.2 },
    marketDominance: { chz: 65.4, token: 34.6 }
  };

  const mockEntries: LeaderboardEntryType[] = [
    {
      rank: 1,
      address: '0x1234567890123456789012345678901234567890',
      nickname: 'ChilizWhale',
      twitterHandle: 'chilizwhale',
      totalVolume: { chz: 125000, token: 85000, usd: 10875 },
      dailyVolume: { chz: 5000, token: 3500, usd: 435 },
      weeklyVolume: { chz: 35000, token: 24500, usd: 3045 },
      score: 9845,
      percentageOfTotal: { chz: 10.0, token: 10.0 },
      transactionCount: 342,
      avgTransactionSize: 318,
      lastTradeTime: new Date(),
      profitLoss: 23.5,
      winRate: 78.2,
      badges: ['Top Trader', 'Volume King'],
      tier: 'diamond',
      isVerified: true,
      joinDate: new Date('2024-01-01')
    },
    {
      rank: 2,
      address: '0x2345678901234567890123456789012345678901',
      nickname: 'CryptoTrader',
      totalVolume: { chz: 98000, token: 67000, usd: 8526 },
      dailyVolume: { chz: 3800, token: 2600, usd: 330.6 },
      weeklyVolume: { chz: 26600, token: 18200, usd: 2314.2 },
      score: 8234,
      percentageOfTotal: { chz: 7.8, token: 7.9 },
      transactionCount: 256,
      avgTransactionSize: 333,
      lastTradeTime: new Date(),
      profitLoss: 18.7,
      winRate: 72.1,
      badges: ['Consistent Trader'],
      tier: 'platinum',
      isVerified: true,
      joinDate: new Date('2024-01-15')
    },
    {
      rank: 3,
      address: '0x3456789012345678901234567890123456789012',
      nickname: 'DeFiMaster',
      totalVolume: { chz: 87000, token: 59000, usd: 7569 },
      dailyVolume: { chz: 3200, token: 2200, usd: 278.4 },
      weeklyVolume: { chz: 22400, token: 15400, usd: 1948.8 },
      score: 7456,
      percentageOfTotal: { chz: 6.9, token: 6.9 },
      transactionCount: 198,
      avgTransactionSize: 439,
      lastTradeTime: new Date(),
      profitLoss: 15.3,
      winRate: 69.7,
      badges: ['Strategy Expert'],
      tier: 'gold',
      isVerified: false,
      joinDate: new Date('2024-02-01')
    }
  ];

  const mockUserStats: UserStats = {
    address: '0x1234567890123456789012345678901234567890',
    rank: 1,
    score: 9845,
    totalVolume: { chz: 125000, token: 85000, usd: 10875 },
    dailyVolume: { chz: 5000, token: 3500, usd: 435 },
    weeklyVolume: { chz: 35000, token: 24500, usd: 3045 },
    transactionCount: 342,
    avgTransactionSize: 318,
    profitLoss: 23.5,
    winRate: 78.2,
    tier: 'diamond',
    badges: ['Top Trader', 'Volume King'],
    isVerified: true,
    joinDate: new Date('2024-01-01'),
    lastActiveDate: new Date(),
    favoriteTokens: ['CHZ', 'USDT'],
    tradingStreak: 15,
    bestRank: 1,
    totalRewards: 2450
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredEntries = mockEntries.filter(entry => 
    entry.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.twitterHandle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Minimal Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-red-500/20' : 'bg-red-50'}`}>
              <BarChart3 className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Chiliz Volume Competition
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Trading volume leaderboard
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg text-sm ${
              isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600'
            }`}>
              Live
            </div>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode 
                  ? 'bg-gray-800/50 text-yellow-400 hover:bg-gray-800' 
                  : 'bg-white/50 text-gray-600 hover:bg-white/70'
              } backdrop-blur-sm`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Token List - Left Sidebar */}
            <div className="lg:col-span-3">
              <SimpleTokenList
                tokens={mockTokens}
                selectedToken={baseToken}
                onTokenSelect={(token) => console.log('Selected:', token)}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Main Leaderboard */}
            <div className="lg:col-span-6 space-y-4">
              {/* Volume Competition Calendar */}
              <VolumeCompetitionCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                isDarkMode={isDarkMode}
              />

              {/* Stats */}
              <MinimalStats
                stats={mockStats}
                nativeToken={nativeToken}
                baseToken={baseToken}
                isDarkMode={isDarkMode}
              />

              {/* Search & Filters */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search traders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-400' 
                        : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-red-500/40 backdrop-blur-sm`}
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-xl border transition-all ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                      : 'bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50'
                  } backdrop-blur-sm`}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              {/* Leaderboard */}
              <div className={`${
                isDarkMode ? 'bg-gray-900/40' : 'bg-white/60'
              } backdrop-blur-xl p-4 rounded-xl border ${
                isDarkMode ? 'border-gray-700/30' : 'border-white/40'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Top Traders
                  </h3>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {filteredEntries.length} traders
                  </span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
                        isDarkMode ? 'border-red-400' : 'border-red-600'
                      }`} />
                    </div>
                  ) : (
                    filteredEntries.map((entry, index) => (
                      <MinimalLeaderboardEntry
                        key={entry.address}
                        entry={entry}
                        index={index}
                        nativeToken={nativeToken}
                        baseToken={baseToken}
                        isDarkMode={isDarkMode}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* User Stats - Right Sidebar */}
            <div className="lg:col-span-3">
              <CompactUserStats
                userStats={mockUserStats}
                nativeToken={nativeToken}
                baseToken={baseToken}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;