import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Trophy, TrendingUp, BarChart3, 
  Award, Calendar, Clock, Target, TrendingDown, Activity,
  ChevronUp, ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTokens } from '../contexts/ThemeContext';

interface VolumeCompetitionCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onFetchData?: (date: Date, period: CompetitionPeriod) => void;
  competitionPeriod: CompetitionPeriod;
  setCompetitionPeriod: React.Dispatch<React.SetStateAction<CompetitionPeriod>>;
}

type CompetitionPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface CompetitionData {
  date: Date;
  volume: number;
  change: number;
  prizePool: number;
  isActive: boolean;
  isCurrent: boolean;
}

const VolumeCompetitionCalendar: React.FC<VolumeCompetitionCalendarProps> = ({
  selectedDate,
  onDateSelect,
  onFetchData,
  competitionPeriod,
  setCompetitionPeriod
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { tokens, selectedToken, setSelectedToken, loading } = useTokens();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTokenExpanded, setIsTokenExpanded] = useState(false);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const generateCompetitionData = (date: Date, period: CompetitionPeriod): Omit<CompetitionData, 'date'> => ({
    volume: Math.random() * 2000000 + 800000,
    change: (Math.random() - 0.5) * 35,
    prizePool: Math.floor(Math.random() * 40000) + 8000,
    isActive: date <= today,
    isCurrent: date.getTime() === today.getTime()
  });

  const isSelected = (date: Date) => date.getTime() === selectedDate.getTime();
  const isToday = (date: Date) => date.getTime() === today.getTime();

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(0)}K`;
    return volume.toFixed(0);
  };

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  // Year navigation
  const goToPreviousYear = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(prev.getFullYear() - 1);
      return newMonth;
    });
  };

  const goToNextYear = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(prev.getFullYear() + 1);
      return newMonth;
    });
  };

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Get weekly data
  const getWeeklyData = () => {
    const weeks = [];
    const currentDate = new Date(currentMonth);
    currentDate.setDate(1);
    
    // Go back to start of first week
    while (currentDate.getDay() !== 0) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    for (let i = 0; i < 6; i++) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() + (i * 7));
      weeks.push(weekStart);
    }
    
    return weeks;
  };

  // Get monthly data
  const getMonthlyData = () => {
    const months = [];
    const currentYear = currentMonth.getFullYear();
    
    // Get all 12 months of the current year
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      months.push(date);
    }
    
    return months;
  };

  // Get yearly data
  const getYearlyData = () => {
    const years = [];
    const currentYear = currentMonth.getFullYear();
    
    // Get 5 years (2 before, current, 2 after)
    for (let year = currentYear - 2; year <= currentYear + 2; year++) {
      const date = new Date(year, 0, 1);
      years.push(date);
    }
    
    return years;
  };

  const formatPrizePool = (prize: number) => {
    if (prize >= 1000000) return `$${(prize / 1000000).toFixed(1)}M`;
    if (prize >= 1000) return `$${(prize / 1000).toFixed(0)}K`;
    return `$${prize.toFixed(0)}`;
  };

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    setIsCollapsed(true);
    if (onFetchData) {
      onFetchData(date, competitionPeriod);
    }
  };

  // Render weekly card
  const renderWeeklyCard = (weekStart: Date, index: number) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const isSelectedWeek = selectedDate >= weekStart && selectedDate <= weekEnd;
    const isCurrentWeek = today >= weekStart && today <= weekEnd;
    const isPast = weekStart <= today;
    
    return (
      <button
        key={weekStart.toISOString()}
        className={`relative p-3 rounded-lg transition-all duration-200 border h-20 flex flex-col justify-between ${
          isSelectedWeek
            ? isDarkMode
              ? 'bg-blue-500/20 border-blue-400 text-white'
              : 'bg-blue-50 border-blue-400 text-blue-700'
            : isCurrentWeek
              ? isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-blue-300 text-blue-600'
              : isDarkMode
                ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => handleDateSelect(weekStart)}
      >
        <div className="text-center">
          <div className="text-sm font-bold">Week {index + 1}</div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {weekStart.getDate()}-{weekEnd.getDate()} {weekStart.toLocaleDateString('en', { month: 'short' })}
          </div>
        </div>
        {isPast && <div className="w-2 h-2 rounded-full bg-green-500 self-end" />}
      </button>
    );
  };

  // Render monthly card
  const renderMonthlyCard = (monthStart: Date, index: number) => {
    const isSelectedMonth = selectedDate.getMonth() === monthStart.getMonth() && selectedDate.getFullYear() === monthStart.getFullYear();
    const isCurrentMonth = today.getMonth() === monthStart.getMonth() && today.getFullYear() === monthStart.getFullYear();
    const isPast = monthStart <= today;
    
    return (
      <button
        key={monthStart.toISOString()}
        className={`relative p-3 rounded-lg transition-all duration-200 border h-20 flex flex-col justify-between ${
          isSelectedMonth
            ? isDarkMode
              ? 'bg-blue-500/20 border-blue-400 text-white'
              : 'bg-blue-50 border-blue-400 text-blue-700'
            : isCurrentMonth
              ? isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-blue-300 text-blue-600'
              : isDarkMode
                ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => handleDateSelect(monthStart)}
      >
        <div className="text-center">
          <div className="text-sm font-bold">{monthStart.toLocaleDateString('en', { month: 'long' })}</div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {monthStart.getFullYear()}
          </div>
        </div>
        {isPast && <div className="w-2 h-2 rounded-full bg-green-500 self-end" />}
      </button>
    );
  };

  // Render yearly card
  const renderYearlyCard = (yearStart: Date, index: number) => {
    const isSelectedYear = selectedDate.getFullYear() === yearStart.getFullYear();
    const isCurrentYear = today.getFullYear() === yearStart.getFullYear();
    const isPast = yearStart <= today;
    
    return (
      <button
        key={yearStart.toISOString()}
        className={`relative p-4 rounded-lg transition-all duration-200 border h-24 flex flex-col justify-between ${
          isSelectedYear
            ? isDarkMode
              ? 'bg-blue-500/20 border-blue-400 text-white'
              : 'bg-blue-50 border-blue-400 text-blue-700'
            : isCurrentYear
              ? isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-blue-300 text-blue-600'
              : isDarkMode
                ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => handleDateSelect(yearStart)}
      >
        <div className="text-center">
          <div className="text-lg font-bold">{yearStart.getFullYear()}</div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {isCurrentYear ? 'Current Year' : isPast ? 'Past Year' : 'Future Year'}
          </div>
        </div>
        {isPast && <div className="w-3 h-3 rounded-full bg-green-500 self-end" />}
      </button>
    );
  };

  // Render calendar day
  const renderCalendarDay = (date: Date, isCurrentMonth: boolean) => {
    const isSelectedDay = isSelected(date);
    const isTodayDate = isToday(date);
    const isPast = date <= today;
    
    return (
      <button
        key={date.toISOString()}
        className={`relative p-2 rounded-lg transition-all h-16 flex flex-col justify-between ${
          isSelectedDay
            ? isDarkMode 
              ? 'bg-blue-500/20 border-blue-400 text-white'
              : 'bg-blue-50 border-blue-400 text-blue-700'
            : isTodayDate
              ? isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-blue-300 text-blue-600'
              : isCurrentMonth
                ? isDarkMode
                  ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                : isDarkMode
                  ? 'bg-gray-900/50 border-gray-700 text-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
        } border`}
        onClick={() => handleDateSelect(date)}
        disabled={!isCurrentMonth}
      >
        <span className="text-sm font-medium">{date.getDate()}</span>
        {isPast && <div className="w-2 h-2 rounded-full bg-green-500 self-end" />}
      </button>
    );
  };

  // Render calendar view based on period
  const renderCalendarView = () => {
    switch (competitionPeriod) {
      case 'daily':
        return (
          <div className="space-y-2">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={`text-center py-2 text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {getCalendarDays().map(date => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                return renderCalendarDay(date, isCurrentMonth);
              })}
            </div>
          </div>
        );

      case 'weekly':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {getWeeklyData().map((weekStart, index) => renderWeeklyCard(weekStart, index))}
          </div>
        );

      case 'monthly':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {getMonthlyData().map((monthStart, index) => renderMonthlyCard(monthStart, index))}
          </div>
        );

      case 'yearly':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {getYearlyData().map((yearStart, index) => renderYearlyCard(yearStart, index))}
          </div>
        );

      default:
        return null;
    }
  };

  const selectedData = generateCompetitionData(selectedDate, competitionPeriod);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
              <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Volume Competition
              </h2>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="font-medium">
                  {competitionPeriod.charAt(0).toUpperCase() + competitionPeriod.slice(1)} • 
                </span>
                <span className="ml-1">
                  {competitionPeriod === 'daily' 
                    ? selectedDate.toLocaleDateString('en', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric'
                      })
                    : competitionPeriod === 'weekly'
                      ? `Week of ${selectedDate.toLocaleDateString('en', { 
                          month: 'short', 
                          day: 'numeric'
                        })}`
                      : competitionPeriod === 'monthly'
                        ? selectedDate.toLocaleDateString('en', { 
                            month: 'long',
                            year: 'numeric'
                          })
                        : selectedDate.getFullYear().toString()
                  }
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Token Selector */}
            <div className="relative">
              <button
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 min-w-[100px] ${
                  isTokenExpanded
                    ? isDarkMode
                      ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                      : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                    : isDarkMode
                      ? 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setIsTokenExpanded(!isTokenExpanded)}
                aria-haspopup="listbox"
                aria-expanded={isTokenExpanded}
              >
                {selectedToken ? (
                  <>
                    <div className="relative">
                      <img 
                        src={selectedToken.logoURI} 
                        alt={selectedToken.symbol} 
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-700" 
                        onError={e => (e.currentTarget.style.display = 'none')} 
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-800"></div>
                    </div>
                    <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {selectedToken.symbol}
                    </span>
                  </>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${isTokenExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Live Status */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-green-500/20 border-green-500/30' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                Live
              </span>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className={`p-2.5 rounded-xl border transition-colors duration-200 ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              {isDarkMode ? <Sun size={18} className="text-gray-300" /> : <Moon size={18} className="text-gray-600" />}
            </button>

            {/* Calendar Toggle */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                isCollapsed
                  ? isDarkMode
                    ? 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                  : isDarkMode
                    ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                    : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
              }`}
            >
              <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Calendar
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Token Selection Panel */}
      <AnimatePresence>
        {isTokenExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
          >
            <div className="max-w-4xl mx-auto">
              <div className={`mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <h3 className="text-lg font-semibold mb-1">Select Token</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Choose a token to view competition data and leaderboard
                </p>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className={`inline-flex items-center gap-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                    Loading available tokens...
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {tokens.map(token => (
                    <motion.button
                      key={token.address}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-lg transition-all duration-200 border h-24 flex flex-col justify-between ${
                        selectedToken?.address === token.address
                          ? isDarkMode
                            ? 'bg-blue-500/20 border-blue-400 text-white'
                            : 'bg-blue-50 border-blue-400 text-blue-700'
                          : isDarkMode
                            ? 'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedToken(token);
                        setIsTokenExpanded(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={token.logoURI} 
                            alt={token.symbol} 
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-700" 
                            onError={e => (e.currentTarget.style.display = 'none')} 
                          />
                          {selectedToken?.address === token.address && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border border-white dark:border-gray-800"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {token.symbol}
                          </div>
                          <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {token.name}
                          </div>
                        </div>
                      </div>
                      
                      {selectedToken?.address === token.address && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            {/* Period Selector */}
            <div className={`flex gap-1 mb-6 p-1 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              {(['daily', 'weekly', 'monthly', 'yearly'] as CompetitionPeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setCompetitionPeriod(period)}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    competitionPeriod === period
                      ? 'bg-blue-500 text-white shadow-lg'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={
                  competitionPeriod === 'yearly' ? goToPreviousYear : goToPreviousMonth
                }
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                } hover:scale-105`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {competitionPeriod === 'yearly' 
                  ? `${currentMonth.getFullYear()}`
                  : competitionPeriod === 'monthly'
                    ? `${currentMonth.getFullYear()}`
                    : currentMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' })
                }
              </h2>

              <button
                onClick={
                  competitionPeriod === 'yearly' ? goToNextYear : goToNextMonth
                }
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                } hover:scale-105`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar */}
            {renderCalendarView()}

            {/* Selected Period Info */}
            {selectedData && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Selected {competitionPeriod === 'daily' ? 'Date' : competitionPeriod === 'weekly' ? 'Week' : competitionPeriod === 'monthly' ? 'Month' : 'Year'}
                    </div>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {competitionPeriod === 'daily' 
                        ? selectedDate.toLocaleDateString('en', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric'
                          })
                        : competitionPeriod === 'weekly'
                          ? `Week of ${selectedDate.toLocaleDateString('en', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}`
                          : competitionPeriod === 'monthly'
                            ? selectedDate.toLocaleDateString('en', { 
                                month: 'long',
                                year: 'numeric'
                              })
                            : selectedDate.getFullYear().toString()
                      }
                    </div>
                  </div>
                  
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Volume
                    </div>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${formatVolume(selectedData.volume)}
                    </div>
                  </div>

                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Performance
                    </div>
                    <div className={`text-lg font-bold ${selectedData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedData.change >= 0 ? '+' : ''}{selectedData.change.toFixed(1)}%
                    </div>
                  </div>

                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Prize Pool
                    </div>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatPrizePool(selectedData.prizePool)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolumeCompetitionCalendar;