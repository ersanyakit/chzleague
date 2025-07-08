import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Clock, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  Copy,
  Check,
  Calendar,
  DollarSign,
  BarChart3,
  Activity
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SwapTransaction {
  ID: string;
  TxHash: string;
  TxFromAddress: string;
  Timestamp: string;
  FromTokenAmount: number;
  ToTokenAmount: number;
  PriceFrom: number;
  PriceTo: number;
  PriceFromInUSD: number;
  PriceToInUSD: number;
  FromTokenTotalInUSD: number;
  ToTokenTotalInUSD: number;
  FromTokenSymbol: string;
  ToTokenSymbol: string;
  FromTokenAddress: string;
  ToTokenAddress: string;
  FromTokenImage: string;
  ToTokenImage: string;
}

interface SwapDetailsProps {
  ticker: string;
  address: string;
}

const SwapDetails: React.FC<SwapDetailsProps> = ({ ticker, address }) => {
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState<SwapTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [ticker, address]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.kewl.exchange/usertransactions?ticker=${ticker}&address=${address}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(type);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionType = (transaction: SwapTransaction) => {
    return transaction.FromTokenSymbol === ticker ? 'Sell' : 'Buy';
  };

  const getPriceChange = (transaction: SwapTransaction) => {
    const priceDiff = transaction.PriceToInUSD - transaction.PriceFromInUSD;
    const percentageChange = (priceDiff / transaction.PriceFromInUSD) * 100;
    return {
      value: priceDiff,
      percentage: percentageChange,
      isPositive: priceDiff > 0
    };
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading swap transactions...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className={`text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              Error: {error}
            </div>
            <button
              onClick={fetchTransactions}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors duration-200`}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalVolume = transactions.reduce((sum, tx) => sum + tx.FromTokenTotalInUSD, 0);
  const totalTransactions = transactions.length;
  const avgTransactionSize = totalVolume / totalTransactions;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className={`mb-8 p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Swap Details
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Token:
                  </span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {ticker}
                  </span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Address:
                  </span>
                  <span className="font-mono text-sm">{formatAddress(address)}</span>
                  <button
                    onClick={() => copyToClipboard(address, 'address')}
                    className={`p-1 rounded transition-colors duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-gray-600' 
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {copiedHash === 'address' ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="text-sm">Full Address</div>
              <div className="font-mono text-xs max-w-xs break-all">{address}</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Volume
                </span>
              </div>
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${formatNumber(totalVolume)}
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Transactions
                </span>
              </div>
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {totalTransactions}
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Avg Transaction
                </span>
              </div>
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${formatNumber(avgTransactionSize)}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.map((transaction, index) => {
            const transactionType = getTransactionType(transaction);
            const priceChange = getPriceChange(transaction);
            
            return (
              <motion.div
                key={transaction.ID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transactionType === 'Buy' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {transactionType}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(transaction.Timestamp)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(transaction.TxHash, 'hash')}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {copiedHash === 'hash' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={`https://explorer.chiliz.com/tx/${transaction.TxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Token Swap Details */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={transaction.FromTokenImage} 
                        alt={transaction.FromTokenSymbol}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatNumber(transaction.FromTokenAmount, 4)} {transaction.FromTokenSymbol}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ${formatNumber(transaction.FromTokenTotalInUSD)}
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-400" />

                    <div className="flex items-center gap-2">
                      <img 
                        src={transaction.ToTokenImage} 
                        alt={transaction.ToTokenSymbol}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatNumber(transaction.ToTokenAmount, 4)} {transaction.ToTokenSymbol}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ${formatNumber(transaction.ToTokenTotalInUSD)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`flex items-center gap-1 text-sm ${
                      priceChange.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {priceChange.isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {priceChange.percentage.toFixed(2)}%
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Price change
                    </div>
                  </div>
                </div>

                {/* Transaction Hash */}
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Transaction Hash:
                      </span>
                      <span className="font-mono text-sm">{formatAddress(transaction.TxHash)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {transactions.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <div className="text-lg">No transactions found</div>
            <div className="text-sm">No swap transactions for this token and address</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapDetails; 