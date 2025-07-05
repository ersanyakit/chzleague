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

interface VolumeCompetitionCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onFetchData?: (date: Date, period: CompetitionPeriod) => void;
}

type CompetitionPeriod = 'daily' | 'weekly' | 'monthly';

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
  onFetchData
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [competitionPeriod, setCompetitionPeriod] = useState<CompetitionPeriod>('daily');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate competition data
  const generateCompetitionData = (date: Date, period: CompetitionPeriod): Omit<CompetitionData, 'date'> => {
    const baseVolume = Math.random() * 2000000 + 800000;
    const multiplier = period === 'daily' ? 1 : 
                      period === 'weekly' ? 7 : 30;
    
    return {
      volume: baseVolume * multiplier,
      change: (Math.random() - 0.5) * 35,
      prizePool: Math.floor(Math.random() * 40000) + 8000,
      isActive: date <= today,
      isCurrent: date.getTime() === today.getTime()
    };
  };

  const isSelected = (date: Date) => {
    return date.getTime() === selectedDate.getTime();
  };

  const isToday = (date: Date) => {
    return date.getTime() === today.getTime();
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

  // Utility functions
  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`;
    return volume.toFixed(0);
  };

  const formatPrizePool = (prize: number) => {
    if (prize >= 1000000) return `$${(prize / 1000000).toFixed(1)}M`;
    if (prize >= 1000) return `$${(prize / 1000).toFixed(0)}K`;
    return `$${prize.toFixed(0)}`;
  };

  const getPeriodInfo = () => {
    switch (competitionPeriod) {
      case 'daily': return { label: 'Daily', description: 'Monthly Calendar View' };
      case 'weekly': return { label: 'Weekly', description: 'Weekly Overview' };
      case 'monthly': return { label: 'Monthly', description: 'Monthly Overview' };
    }
  };

  // Render calendar day
  const renderCalendarDay = (date: Date, isCurrentMonth: boolean) => {
    const isSelectedDay = isSelected(date);
    const isTodayDate = isToday(date);
    const isPast = date <= today;
    
    // Generate competition data for this day
    const competitionData = generateCompetitionData(date, 'daily');
    
    return (
      <motion.button
        key={date.toISOString()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative p-1 lg:p-2 rounded-lg transition-all duration-200 border ${
          isSelectedDay
            ? isDarkMode
              ? 'bg-red-500/20 text-white shadow-md border-red-400'
              : 'bg-red-500/20 text-red-700 shadow-md border-red-400'
            : isTodayDate
              ? isDarkMode
                ? 'bg-red-500/15 text-red-300 border-red-500/25'
                : 'bg-red-50 text-red-600 border-red-300'
              : isCurrentMonth
                ? isDarkMode
                  ? 'bg-gray-800/30 text-gray-200 hover:bg-gray-700/40 border-gray-600/20'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                : isDarkMode
                  ? 'bg-gray-900/20 text-gray-500 border-gray-700/20'
                  : 'bg-gray-50 text-gray-400 border-gray-200'
        } shadow-sm hover:shadow-sm h-16 lg:h-20 flex flex-col justify-between`}
        onClick={() => handleDateSelect(date)}
        disabled={!isCurrentMonth}
      >
        {/* Day Number and Active Indicator */}
        <div className="flex items-center justify-between">
          <span className={`text-xs lg:text-sm font-bold ${
            isSelectedDay ? (isDarkMode ? 'text-white' : 'text-red-700') : 
            isTodayDate ? (isDarkMode ? 'text-red-300' : 'text-red-600') : 
            isCurrentMonth ? (isDarkMode ? 'text-gray-200' : 'text-gray-700') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
          }`}>
            {date.getDate()}
          </span>
          {isPast && (
            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-green-500"></div>
          )}
        </div>

        {/* Selection Indicator */}
        {isSelectedDay && (
          <div className="absolute -top-0.5 -right-0.5 lg:-top-1 lg:-right-1 w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-red-500 flex items-center justify-center">
            <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-white"></div>
          </div>
        )}
      </motion.button>
    );
  };

  // Render weekly card
  const renderWeeklyCard = (weekStart: Date, index: number) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const isSelectedWeek = selectedDate >= weekStart && selectedDate <= weekEnd;
    const isCurrentWeek = today >= weekStart && today <= weekEnd;
    const isPast = weekStart <= today;
    
    const competitionData = generateCompetitionData(weekStart, 'weekly');
    
    return (
      <motion.button
        key={weekStart.toISOString()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative p-3 rounded-lg transition-all duration-200 border ${
          isSelectedWeek
            ? isDarkMode
              ? 'bg-red-500/20 text-white shadow-md border-red-400'
              : 'bg-red-500/20 text-red-700 shadow-md border-red-400'
            : isCurrentWeek
              ? isDarkMode
                ? 'bg-red-500/15 text-red-300 border-red-500/25'
                : 'bg-red-50 text-red-600 border-red-300'
              : isDarkMode
                ? 'bg-gray-800/30 text-gray-200 hover:bg-gray-700/40 border-gray-600/20'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
        } shadow-sm hover:shadow-sm h-24 flex flex-col justify-between`}
        onClick={() => handleDateSelect(weekStart)}
      >
        {/* Week Header */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className={`text-sm lg:text-base font-bold ${
              isSelectedWeek ? (isDarkMode ? 'text-white' : 'text-red-700') : 
              isCurrentWeek ? (isDarkMode ? 'text-red-300' : 'text-red-600') : 
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Week {index + 1}
            </div>
            <div className={`text-xs ${
              isSelectedWeek ? 'text-white/70' : 
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {weekStart.getDate()}-{weekEnd.getDate()} {weekStart.toLocaleDateString('en', { month: 'short' })}
            </div>
          </div>
          {isPast && (
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          )}
        </div>

        {/* Selection Indicator */}
        {isSelectedWeek && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        )}
      </motion.button>
    );
  };

  // Render monthly card
  const renderMonthlyCard = (monthStart: Date, index: number) => {
    const isSelectedMonth = selectedDate.getMonth() === monthStart.getMonth() && selectedDate.getFullYear() === monthStart.getFullYear();
    const isCurrentMonth = today.getMonth() === monthStart.getMonth() && today.getFullYear() === monthStart.getFullYear();
    const isPast = monthStart <= today;
    
    const competitionData = generateCompetitionData(monthStart, 'monthly');
    
    return (
      <motion.button
        key={monthStart.toISOString()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative p-3 rounded-lg transition-all duration-200 border ${
          isSelectedMonth
            ? isDarkMode
              ? 'bg-red-500/20 text-white shadow-md border-red-400'
              : 'bg-red-500/20 text-red-700 shadow-md border-red-400'
            : isCurrentMonth
              ? isDarkMode
                ? 'bg-red-500/15 text-red-300 border-red-500/25'
                : 'bg-red-50 text-red-600 border-red-300'
              : isDarkMode
                ? 'bg-gray-800/30 text-gray-200 hover:bg-gray-700/40 border-gray-600/20'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
        } shadow-sm hover:shadow-sm h-24 flex flex-col justify-between`}
        onClick={() => handleDateSelect(monthStart)}
      >
        {/* Month Header */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className={`text-sm lg:text-base font-bold ${
              isSelectedMonth ? (isDarkMode ? 'text-white' : 'text-red-700') : 
              isCurrentMonth ? (isDarkMode ? 'text-red-300' : 'text-red-600') : 
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {monthStart.toLocaleDateString('en', { month: 'long' })}
            </div>
            <div className={`text-xs ${
              isSelectedMonth ? 'text-white/70' : 
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {monthStart.getFullYear()}
            </div>
          </div>
          {isPast && (
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          )}
        </div>

        {/* Selection Indicator */}
        {isSelectedMonth && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        )}
      </motion.button>
    );
  };

  // Render calendar view
  const renderCalendarView = () => {
    if (competitionPeriod === 'daily') {
      const days = getCalendarDays();
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      return (
        <div className="space-y-2 lg:space-y-4">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 lg:gap-3">
            {weekDays.map(day => (
              <div key={day} className={`text-center py-2 lg:py-3 text-xs lg:text-sm font-bold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5 lg:gap-1">
            {days.map(date => {
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              return renderCalendarDay(date, isCurrentMonth);
            })}
          </div>
        </div>
      );
    }

    if (competitionPeriod === 'weekly') {
      const weeks = getWeeklyData();
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
          {weeks.map((weekStart, index) => renderWeeklyCard(weekStart, index))}
        </div>
      );
    }

    if (competitionPeriod === 'monthly') {
      const months = getMonthlyData();
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 lg:gap-3">
          {months.map((monthStart, index) => renderMonthlyCard(monthStart, index))}
        </div>
      );
    }
  };

  const selectedData = generateCompetitionData(selectedDate, competitionPeriod);
  const periodInfo = getPeriodInfo();

  // Handle date selection with collapse and data fetch
  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    setIsCollapsed(true);
    if (onFetchData) {
      onFetchData(date, competitionPeriod);
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ height: isCollapsed ? 'auto' : 'auto' }}
      className={`mb-6 shadow-sm overflow-hidden  border-b border-white/10`}
    >
      {/* Collapsible Header */}
      <div className={`p-4 lg:p-6 ${isCollapsed ? 'pb-2 lg:pb-4' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 lg:gap-4">
            <div className={`p-2 lg:p-3 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-50'}`}>
              <Calendar className={`w-5 h-5 lg:w-6 lg:h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg lg:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Volume Competition Calendar
              </h3>
              <p className={`text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Advanced trading competition tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 lg:gap-3">
            {/* Status Display - Always Visible */}
            <div className={`px-2 lg:px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-1 lg:gap-3">
                <div className={`px-1 lg:px-2 py-1 rounded text-xs font-medium ${
                  competitionPeriod === 'daily' ? 'bg-red-500/20 text-red-600' :
                  competitionPeriod === 'weekly' ? 'bg-red-500/20 text-red-600' :
                  'bg-red-500/20 text-red-600'
                }`}>
                  {competitionPeriod.charAt(0).toUpperCase() + competitionPeriod.slice(1)}
                </div>
                <span className={`text-xs lg:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {competitionPeriod === 'daily' && selectedDate.toLocaleDateString('en', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  {competitionPeriod === 'weekly' && `Week ${Math.ceil(selectedDate.getDate() / 7)} ${selectedDate.toLocaleDateString('en', { 
                    month: 'short',
                    year: 'numeric'
                  })}`}
                  {competitionPeriod === 'monthly' && selectedDate.toLocaleDateString('en', { 
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Compact Stats - Always Visible */}
            <div className={`hidden md:block px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Volume</div>
                  <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${formatVolume(selectedData.volume)}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Performance</div>
                  <div className={`text-sm font-bold ${selectedData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedData.change >= 0 ? '+' : ''}{selectedData.change.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Prize Pool</div>
                  <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatPrizePool(selectedData.prizePool)}
                  </div>
                </div>
              </div>
            </div>

            <div className={`hidden lg:block px-4 py-2 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">Live Competition</span>
              </div>
            </div>

            {/* Collapse Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
              } hover:scale-105`}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                toggleTheme();
              }}
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

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Period Selector */}
              <div className={`flex gap-1 mb-6 p-1 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {(['daily', 'weekly', 'monthly'] as CompetitionPeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setCompetitionPeriod(period)}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      competitionPeriod === period
                        ? 'bg-red-500 text-white'
                        : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>

              {/* Month Navigation (for daily view) */}
              {competitionPeriod === 'daily' && (
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={goToPreviousMonth}
                    className={`p-2 rounded-lg transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                    } hover:scale-105`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                  </h2>

                  <button
                    onClick={goToNextMonth}
                    className={`p-2 rounded-lg transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                    } hover:scale-105`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Period Info */}
              <div className={`flex items-center justify-between mb-6 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {periodInfo?.label} Competition
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {periodInfo?.description}
                  </span>
                </div>
              </div>

              {/* Calendar */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={competitionPeriod === 'daily' ? `${currentMonth.getFullYear()}-${currentMonth.getMonth()}` : competitionPeriod}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCalendarView()}
                </motion.div>
              </AnimatePresence>

              {/* Selected Period Info */}
              {selectedData && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                  } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Selected {competitionPeriod === 'daily' ? 'Date' : competitionPeriod === 'weekly' ? 'Week' : 'Month'}
                      </div>
                      <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedDate.toLocaleDateString('en', { 
                          weekday: competitionPeriod === 'daily' ? 'long' : undefined,
                          year: 'numeric', 
                          month: 'long', 
                          day: competitionPeriod === 'daily' ? 'numeric' : undefined
                        })}
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

              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>1st Place</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top 3</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top 5</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top 10</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Others</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VolumeCompetitionCalendar;