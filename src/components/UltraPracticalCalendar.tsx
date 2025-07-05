import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

interface UltraPracticalCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isDarkMode: boolean;
}

const UltraPracticalCalendar: React.FC<UltraPracticalCalendarProps> = ({
  selectedDate,
  onDateSelect,
  isDarkMode
}) => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Auto-scroll to end on mount
  useEffect(() => {
    if (scrollRef.current && viewMode === 'week') {
      scrollRef.current.scrollTo({ 
        left: scrollRef.current.scrollWidth, 
        behavior: 'smooth' 
      });
    }
  }, [viewMode]);

  const isSelected = (date: Date) => {
    return date.getTime() === selectedDate.getTime();
  };

  const isToday = (date: Date) => {
    return date.getTime() === today.getTime();
  };

  // Weekly View - Last 4 weeks (28 days)
  const getWeeklyView = () => {
    const days = [];
    for (let i = 27; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  };

  // Monthly View - Last 6 months
  const getMonthlyView = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      months.push(date);
    }
    return months;
  };

  const navigatePrevious = () => {
    if (viewMode === 'week') {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 7);
      onDateSelect(newDate);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() - 1);
      onDateSelect(newDate);
    }
  };

  const navigateNext = () => {
    if (viewMode === 'week') {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 7);
      if (newDate <= today) {
        onDateSelect(newDate);
      }
    } else {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + 1);
      if (newDate <= today) {
        onDateSelect(newDate);
      }
    }
  };

  const renderWeeklyView = () => {
    const days = getWeeklyView();
    return (
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
        {days.map((date, index) => {
          const day = date.getDate().toString();
          const weekDay = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center min-w-[50px] h-16 rounded-xl transition-all duration-200 ${
                isSelected(date)
                  ? 'bg-blue-500 text-white shadow-lg'
                  : isToday(date)
                    ? isDarkMode
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                    : isDarkMode
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                      : 'bg-white/80 text-gray-700 hover:bg-gray-50'
              } backdrop-blur-sm border ${
                isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
              }`}
              onClick={() => onDateSelect(date)}
            >
              <span className={`text-xs font-medium ${
                isSelected(date) ? 'text-white/80' : isToday(date) ? '' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {weekDay}
              </span>
              <span className="text-lg font-bold">{day}</span>
            </motion.button>
          );
        })}
      </div>
    );
  };

  const renderMonthlyView = () => {
    const months = getMonthlyView();
    return (
      <div className="grid grid-cols-3 gap-3">
        {months.map((month, index) => {
          const isSelectedMonth = selectedDate.getMonth() === month.getMonth() && 
                                 selectedDate.getFullYear() === month.getFullYear();
          const isCurrentMonth = today.getMonth() === month.getMonth() && 
                                today.getFullYear() === month.getFullYear();
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl transition-all ${
                isSelectedMonth
                  ? 'bg-blue-500 text-white shadow-lg'
                  : isCurrentMonth
                    ? isDarkMode
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                    : isDarkMode
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                      : 'bg-white/80 text-gray-700 hover:bg-gray-50'
              } backdrop-blur-sm border ${
                isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'
              }`}
              onClick={() => onDateSelect(month)}
            >
              <div className="text-lg font-bold">
                {month.toLocaleDateString('en', { month: 'short' })}
              </div>
              <div className="text-sm">
                {month.getFullYear()}
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  };

  const canNavigateNext = () => {
    if (viewMode === 'week') {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek <= today;
    } else {
      const nextMonth = new Date(selectedDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth <= today;
    }
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-900/40' : 'bg-white/60'
    } backdrop-blur-xl p-4 rounded-xl border ${
      isDarkMode ? 'border-gray-700/30' : 'border-white/40'
    } mb-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
            <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Trading Calendar
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {viewMode === 'week' ? 'Last 4 weeks' : 'Last 6 months'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={navigatePrevious}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode
                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                : 'bg-white/80 text-gray-600 hover:bg-gray-50'
            } backdrop-blur-sm`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={navigateNext}
            disabled={!canNavigateNext()}
            className={`p-2 rounded-lg transition-all ${
              canNavigateNext()
                ? isDarkMode
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  : 'bg-white/80 text-gray-600 hover:bg-gray-50'
                : 'opacity-50 cursor-not-allowed bg-gray-500/20'
            } backdrop-blur-sm`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simple View Toggle */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg bg-gray-500/10">
        <button
          onClick={() => setViewMode('week')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'week'
              ? 'bg-blue-500 text-white shadow-sm'
              : isDarkMode
                ? 'text-gray-300 hover:bg-gray-700/50'
                : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setViewMode('month')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'month'
              ? 'bg-blue-500 text-white shadow-sm'
              : isDarkMode
                ? 'text-gray-300 hover:bg-gray-700/50'
                : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Calendar Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'week' && renderWeeklyView()}
          {viewMode === 'month' && renderMonthlyView()}
        </motion.div>
      </AnimatePresence>

      {/* Selected Date Info */}
      <div className={`mt-4 p-3 rounded-lg ${
        isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/80'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Selected Date
            </span>
          </div>
          <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {selectedDate.toLocaleDateString('en', { 
              weekday: 'short',
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltraPracticalCalendar;