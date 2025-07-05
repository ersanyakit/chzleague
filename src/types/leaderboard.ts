export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  price?: number;
  change24h?: number;
  volume24h?: number;
  marketCap?: number;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  nickname?: string;
  twitterHandle?: string;
  telegramHandle?: string;
  totalVolume: {
    chz: number;
    token: number;
    usd: number;
  };
  dailyVolume: {
    chz: number;
    token: number;
    usd: number;
  };
  weeklyVolume: {
    chz: number;
    token: number;
    usd: number;
  };
  score: number;
  percentageOfTotal: {
    chz: number;
    token: number;
  };
  transactionCount: number;
  avgTransactionSize: number;
  lastTradeTime: Date;
  profitLoss: number;
  winRate: number;
  badges: string[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  isVerified: boolean;
  joinDate: Date;
}

export interface LeaderboardStats {
  totalVolume: {
    chz: number;
    token: number;
    usd: number;
  };
  dailyVolume: {
    chz: number;
    token: number;
    usd: number;
  };
  weeklyVolume: {
    chz: number;
    token: number;
    usd: number;
  };
  totalTraders: number;
  activeTraders: number;
  newTraders24h: number;
  totalTransactions: number;
  avgTransactionSize: number;
  topGainer: {
    address: string;
    gain: number;
  };
  marketDominance: {
    chz: number;
    token: number;
  };
}

export interface UserStats {
  address: string;
  rank: number;
  score: number;
  totalVolume: {
    chz: number;
    token: number;
    usd: number;
  };
  dailyVolume: {
    chz: number;
    token: number;
    usd: number;
  };
  weeklyVolume: {
    chz: number;
    token: number;
    usd: number;
  };
  transactionCount: number;
  avgTransactionSize: number;
  profitLoss: number;
  winRate: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  badges: string[];
  isVerified: boolean;
  joinDate: Date;
  lastActiveDate: Date;
  favoriteTokens: string[];
  tradingStreak: number;
  bestRank: number;
  totalRewards: number;
}

export interface TimeFrame {
  label: string;
  value: '24h' | '7d' | '30d' | 'all';
  days: number;
}

export interface MarketData {
  chzPrice: number;
  chzChange24h: number;
  tokenPrice: number;
  tokenChange24h: number;
  totalLiquidity: number;
  volume24h: number;
  fees24h: number;
}