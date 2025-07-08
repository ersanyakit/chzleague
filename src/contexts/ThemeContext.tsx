import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Token } from '../types/leaderboard';

interface TokenListResponse {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tags: Record<string, any>;
  logoURI: string;
  keywords: string[];
  tokens: Token[];
}

interface TokenContextType {
  tokens: Token[];
  selectedToken: Token | null;
  loading: boolean;
  error: string | null;
  setSelectedToken: (token: Token) => void;
  fetchTokens: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};

interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/index.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TokenListResponse = await response.json();
      
      // Add mock price data for demonstration (since the API doesn't include price data)
      const tokensWithMockData = data.tokens.map(token => ({
        ...token,
        price: Math.random() * 0.1 + 0.01, // Random price between 0.01 and 0.11
        change24h: (Math.random() - 0.5) * 20, // Random change between -10% and +10%
        volume24h: Math.random() * 2000000 + 100000, // Random volume between 100K and 2.1M
        marketCap: Math.random() * 100000000 + 1000000 // Random market cap between 1M and 101M
      }));
      
      setTokens(tokensWithMockData);
      
      // Set first token as selected if no token is selected
      if (tokensWithMockData.length > 0) {
        setSelectedToken(tokensWithMockData[0]);
      }
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  };

  const refreshTokens = async () => {
    await fetchTokens();
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const value = {
    tokens,
    selectedToken,
    loading,
    error,
    setSelectedToken,
    fetchTokens,
    refreshTokens
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Default to dark mode
    return true;
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update body background color based on theme
    if (isDarkMode) {
      document.body.style.backgroundColor = '#111827'; // gray-900
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#f9fafb'; // gray-50
      document.body.style.color = '#111827';
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 