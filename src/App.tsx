import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, BarChart3, Search, Filter } from 'lucide-react';
import VolumeCompetitionCalendar from './components/VolumeCompetitionCalendar';
import MinimalStats from './components/MinimalStats';
import MinimalLeaderboardEntry from './components/MinimalLeaderboardEntry';
import CompactUserStats from './components/CompactUserStats';
import SwapDetails from './components/SwapDetails';
import { LeaderboardEntry as LeaderboardEntryType, LeaderboardStats, UserStats, Token } from './types/leaderboard';
import { useTheme, useTokens } from './contexts/ThemeContext';
import GetRecentSwaps from './components/GetRecentSwaps';

function App() {
  const { selectedToken } = useTokens();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [competitionPeriod, setCompetitionPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tradersLoading, setTradersLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntryType[]>([]);
  
  // Routing states
  const [currentView, setCurrentView] = useState<'main' | 'swapDetails'>('main');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedTicker, setSelectedTicker] = useState<string>('');

  const handleAddressClick = (address: string, ticker?: string) => {
    // Eğer ticker verilmezse, seçilen token'ın symbol'ünü kullan
    const tickerToUse = ticker || selectedToken?.symbol || 'CHZ';
    
    setSelectedAddress(address);
    setSelectedTicker(tickerToUse);
    setCurrentView('swapDetails');
    
    // URL'yi güncelle
    const newUrl = `${window.location.origin}${window.location.pathname}?view=swapDetails&ticker=${tickerToUse}&address=${address}`;
    window.history.pushState({ view: 'swapDetails', ticker: tickerToUse, address }, '', newUrl);
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedAddress('');
    setSelectedTicker('');
    
    // URL'yi ana sayfaya geri döndür
    const newUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.pushState({ view: 'main' }, '', newUrl);
  };

  // Mock data
  const nativeToken: Token = {
    chainId: 88888,
    symbol: 'CHZ',
    name: 'Chiliz',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    logoURI: '',
    price: 0.087,
    change24h: 12.5,
    volume24h: 2400000,
    marketCap: 580000000
  };

  const baseToken: Token = {
    chainId: 88888,
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xa0b86a33e6441e0a7a5abcf5d45b37b1a11b7e9f',
    decimals: 6,
    logoURI: '',
    price: 1.00,
    change24h: 0.1,
    volume24h: 1800000,
    marketCap: 95000000000
  };

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

  // URL'den parametreleri oku ve browser navigation'ı destekle
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const view = urlParams.get('view');
      const ticker = urlParams.get('ticker');
      const address = urlParams.get('address');
      
      if (view === 'swapDetails' && ticker && address) {
        setCurrentView('swapDetails');
        setSelectedTicker(ticker);
        setSelectedAddress(address);
      } else {
        setCurrentView('main');
        setSelectedTicker('');
        setSelectedAddress('');
      }
    };

    // İlk yükleme
    handlePopState();
    
    // Browser navigation events
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData(selectedDate, competitionPeriod, selectedToken);
  }, []);

  const filteredEntries = leaderboardData.filter(entry => 
    entry.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.twitterHandle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch data function for calendar selection
  const fetchData = async (date: Date, period: 'daily' | 'weekly' | 'monthly' | 'yearly', token: Token | null) => {
    if (!token) return;
    console.log(`Fetching data for ${period} period on ${date.toLocaleDateString()} and token ${token.symbol}`);
    setTradersLoading(true);
    try {
      // API çağrısında token.symbol kullan
      const dateParam = date.toISOString();
      const url = `https://api.kewl.exchange/leaderboard?date=${dateParam}&period=${period}&token=${token.symbol}`;
      console.log('API URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response:', data);
      
      // Check if we got valid data, if not use fallback
      if (!data || data.length === 0) {
        console.log('No data received from API, using fallback data');
        // You could set some fallback data here or keep existing data
        return;
      }
      
      // API'den gelen veriyi doğrudan kullan
      const transformedData: LeaderboardEntryType[] = data.map((entry: any) => ({
        rank: entry.rank,
        address: entry.wallet,
        nickname: entry.wallet,
        twitterHandle: undefined,
        totalVolume: {
          chz: entry.total_buy_amount + entry.total_sell_amount || 0,
          token: entry.total_to_amount || 0,
          usd: entry.total_usd_volume || 0
        },
        dailyVolume: {
          chz: entry.total_buy_amount + entry.total_sell_amount || 0,
          token: entry.total_to_amount || 0,
          usd: entry.total_usd_volume || 0
        },
        weeklyVolume: {
          chz: entry.total_buy_amount + entry.total_sell_amount || 0,
          token: entry.total_to_amount || 0,
          usd: entry.total_usd_volume || 0
        },
        score: Math.floor(entry.total_usd_volume / 100),
        percentageOfTotal: {
          chz: 0,
          token: 0
        },
        transactionCount: Math.floor(entry.total_usd_volume / 1000) + 10,
        avgTransactionSize: Math.floor(entry.total_usd_volume / (Math.floor(entry.total_usd_volume / 1000) + 10)),
        lastTradeTime: new Date(),
        profitLoss: entry.total_buy_usd > 0 && entry.total_sell_usd > 0 ?
          ((entry.total_sell_usd - entry.total_buy_usd) / entry.total_buy_usd) * 100 : 0,
        winRate: entry.total_buy_usd > 0 && entry.total_sell_usd > 0 ?
          (entry.total_sell_usd > entry.total_buy_usd ? 75 : 45) : 50,
        badges: entry.rank <= 3 ? ['Top Trader'] : entry.rank <= 10 ? ['Volume King'] : [],
        tier: entry.rank <= 5 ? 'diamond' : entry.rank <= 15 ? 'platinum' : entry.rank <= 30 ? 'gold' : 'silver',
        isVerified: entry.rank <= 20,
        joinDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      }));
      
      // Calculate percentages
      const totalChz = transformedData.reduce((sum, entry) => sum + entry.totalVolume.chz, 0);
      const totalToken = transformedData.reduce((sum, entry) => sum + entry.totalVolume.token, 0);
      
      transformedData.forEach(entry => {
        entry.percentageOfTotal.chz = totalChz > 0 ? (entry.totalVolume.chz / totalChz) * 100 : 0;
        entry.percentageOfTotal.token = totalToken > 0 ? (entry.totalVolume.token / totalToken) * 100 : 0;
      });
      
      setLeaderboardData(transformedData);
      console.log(`Data fetched successfully for ${period} period on ${date.toLocaleDateString()} and token ${token.symbol}`);
    } catch (error) {
      console.error('Error fetching competition data:', error);
    } finally {
      setTradersLoading(false);
    }
  };

  // Fetch token data function (for SimpleTokenList)
  const fetchTokenData = async (token: Token) => {
    console.log(`Fetching data for token: ${token.symbol} (${token.name})`);
    setTradersLoading(true);
    try {
      // Calendar'dan gelen period ve tarih bilgisini kullan
      const dateParam = selectedDate.toISOString();
      const url = `https://api.kewl.exchange/leaderboard?date=${dateParam}&period=${competitionPeriod}&token=${token.symbol}`;
      console.log('API URL for token:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response for token:', data);
      
      // Check if we got valid data, if not use fallback
      if (!data || data.length === 0) {
        console.log('No data received from API for token, using fallback data');
        // You could set some fallback data here or keep existing data
        return;
      }
      
      // API'den gelen veriyi doğrudan kullan
      const transformedData: LeaderboardEntryType[] = data.map((entry: any) => ({
        rank: entry.rank,
        address: entry.wallet,
        nickname: entry.wallet,
        twitterHandle: undefined,
        totalVolume: {
          chz: entry.total_buy_amount + entry.total_sell_amount || 0,
          token: entry.total_to_amount || 0,
          usd: entry.total_usd_volume || 0
        },
        dailyVolume: {
          chz: entry.total_buy_amount + entry.total_sell_amount || 0,
          token: entry.total_to_amount || 0,
          usd: entry.total_usd_volume || 0
        },
        weeklyVolume: {
          chz: entry.total_buy_amount + entry.total_sell_amount || 0,
          token: entry.total_to_amount || 0,
          usd: entry.total_usd_volume || 0
        },
        score: Math.floor(entry.total_usd_volume / 100),
        percentageOfTotal: {
          chz: 0,
          token: 0
        },
        transactionCount: Math.floor(entry.total_usd_volume / 1000) + 10,
        avgTransactionSize: Math.floor(entry.total_usd_volume / (Math.floor(entry.total_usd_volume / 1000) + 10)),
        lastTradeTime: new Date(),
        profitLoss: entry.total_buy_usd > 0 && entry.total_sell_usd > 0 ?
          ((entry.total_sell_usd - entry.total_buy_usd) / entry.total_buy_usd) * 100 : 0,
        winRate: entry.total_buy_usd > 0 && entry.total_sell_usd > 0 ?
          (entry.total_sell_usd > entry.total_buy_usd ? 75 : 45) : 50,
        badges: entry.rank <= 3 ? ['Top Trader'] : entry.rank <= 10 ? ['Volume King'] : [],
        tier: entry.rank <= 5 ? 'diamond' : entry.rank <= 15 ? 'platinum' : entry.rank <= 30 ? 'gold' : 'silver',
        isVerified: entry.rank <= 20,
        joinDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      }));
      
      // Calculate percentages
      const totalChz = transformedData.reduce((sum, entry) => sum + entry.totalVolume.chz, 0);
      const totalToken = transformedData.reduce((sum, entry) => sum + entry.totalVolume.token, 0);
      
      transformedData.forEach(entry => {
        entry.percentageOfTotal.chz = totalChz > 0 ? (entry.totalVolume.chz / totalChz) * 100 : 0;
        entry.percentageOfTotal.token = totalToken > 0 ? (entry.totalVolume.token / totalToken) * 100 : 0;
      });
      
      setLeaderboardData(transformedData);
      console.log(`Data fetched successfully for token: ${token.symbol}`);
    } catch (error) {
      console.error('Error fetching token data:', error);
    } finally {
      setTradersLoading(false);
    }
  };

  // Fetch data when selectedDate, competitionPeriod, or selectedToken changes
  useEffect(() => {
    fetchData(selectedDate, competitionPeriod, selectedToken);
  }, [selectedDate, competitionPeriod, selectedToken]);

  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'swapDetails' ? (
        // SwapDetails View
        <div>
          {/* Back Button Header */}
          <div className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b shadow-sm`}>
            <div className="max-w-6xl mx-auto px-6 py-4">
              <button
                onClick={handleBackToMain}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Leaderboard
              </button>
            </div>
          </div>
          
          <SwapDetails ticker={selectedTicker} address={selectedAddress} />
        </div>
      ) : (
        // Main View
        <>
          {/* Modern Header */}
          <div className="sticky top-0 z-50  border-b border-gray-200 shadow-sm">
            <div className='w-full'>
              <VolumeCompetitionCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onFetchData={(date, period) => fetchData(date, period, selectedToken)}
                competitionPeriod={competitionPeriod}
                setCompetitionPeriod={setCompetitionPeriod}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              
              {/* Mobile Layout */}
              <div className="block lg:hidden space-y-6">
                {/* Stats */}
                <MinimalStats
                  stats={mockStats}
                  nativeToken={nativeToken}
                  baseToken={baseToken}
                />

                {/* Search & Filters */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search traders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-3 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Top Traders</h2>
                    <span className="text-sm text-gray-500 font-medium">
                      {filteredEntries.length} traders
                    </span>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {loading || tradersLoading ? (
                      <div className="flex flex-col items-center justify-center h-32 gap-3">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                        <div className="text-sm text-gray-500">
                          {loading ? 'Loading traders...' : 'Fetching new data...'}
                        </div>
                      </div>
                    ) : (
                      filteredEntries.map((entry, index) => (
                        <MinimalLeaderboardEntry
                          key={entry.address}
                          entry={entry}
                          index={index}
                          nativeToken={nativeToken}
                          baseToken={baseToken}
                          onAddressClick={handleAddressClick}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* User Stats */}
                <div className="w-full">
                  <CompactUserStats
                    userStats={mockUserStats}
                    nativeToken={nativeToken}
                    baseToken={baseToken}
                  />
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-6">
                
                {/* Main Leaderboard */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Stats */}
                  <MinimalStats
                    stats={mockStats}
                    nativeToken={nativeToken}
                    baseToken={baseToken}
                  />

                  {/* Search & Filters */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search traders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="p-3 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Leaderboard */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Top Traders</h2>
                      <span className="text-sm text-gray-500 font-medium">
                        {filteredEntries.length} traders
                      </span>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {loading || tradersLoading ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-3">
                          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                          <div className="text-sm text-gray-500">
                            {loading ? 'Loading traders...' : 'Fetching new data...'}
                          </div>
                        </div>
                      ) : (
                        filteredEntries.map((entry, index) => (
                          <MinimalLeaderboardEntry
                            key={entry.address}
                            entry={entry}
                            index={index}
                            nativeToken={nativeToken}
                            baseToken={baseToken}
                            onAddressClick={handleAddressClick}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4">
                  <GetRecentSwaps onAddressClick={handleAddressClick} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;