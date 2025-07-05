import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Trophy, TrendingUp, BarChart3 } from 'lucide-react';

interface VolumeCompetitionCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isDarkMode: boolean;
}

type CompetitionPeriod = 'daily' | 'weekly' | 'monthly';

const VolumeCompetitionCalendar: React.FC<VolumeCompetitionCalendarProps> = ({
  selectedDate,
  onDateSelect,
  isDarkMode
}) => {
  const [competitionPeriod, setCompetitionPeriod] = useState<CompetitionPeriod>('daily');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Mock volume data for demonstration
  const getVolumeData = (date: Date) => {
    const baseVolume = Math.random() * 1000000;
    return {
      volume: baseVolume,
      change: (Math.random() - 0.5) * 40,
      rank: Math.floor(Math.random() * 10) + 1
    };
  };

  // Auto-scroll to end on mount
  useEffect(() => {
    if (scrollRef.current && competitionPeriod === 'daily') {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ 
            left: scrollRef.current.scrollWidth, 
            behavior: 'smooth' 
          });
        }
      }, 100);
    }
  }, [competitionPeriod]);

  const isSelected = (date: Date) => {
    return date.getTime() === selectedDate.getTime();
  };

  const isToday = (date: Date) => {
    return date.getTime() === today.getTime();
  };

  // Scroll functions for daily view
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Daily Competition - Last 30 days
  const getDailyCompetition = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push({
        date,
        ...getVolumeData(date)
      });
    }
    return days;
  };

  // Weekly Competition - Last 12 weeks
  const getWeeklyCompetition = () => {
    const weeks = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      weeks.push({
        date: startOfWeek,
        ...getVolumeData(startOfWeek)
      });
    }
    return weeks;
  };

  // Monthly Competition - Last 6 months
  const getMonthlyCompetition = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      months.push({
        date,
        ...getVolumeData(date)
      });
    }
    return months;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`;
    return volume.toFixed(0);
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank <= 3) return 'text-orange-500';
    if (rank <= 5) return isDarkMode ? 'text-red-400' : 'text-red-600';
    return isDarkMode ? 'text-gray-400' : 'text-gray-500';
  };

  const renderDailyCompetition = () => {
    const days = getDailyCompetition();
    return (
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all ${
            isDarkMode
              ? 'bg-gray-800/90 text-gray-300 hover:bg-gray-700/90 border border-gray-600/50'
              : 'bg-white/90 text-gray-600 hover:bg-white border border-gray-300/60'
          } backdrop-blur-sm hover:scale-110`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all ${
            isDarkMode
              ? 'bg-gray-800/90 text-gray-300 hover:bg-gray-700/90 border border-gray-600/50'
              : 'bg-white/90 text-gray-600 hover:bg-white border border-gray-300/60'
          } backdrop-blur-sm hover:scale-110`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div 
          ref={scrollRef} 
          className="flex gap-2 overflow-x-auto py-2 px-8 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {days.map((day, index) => {
            const dayNum = day.date.getDate().toString();
            const weekDay = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][day.date.getDay()];
            
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center min-w-[70px] h-20 rounded-xl transition-all duration-200 border-2 ${
                  isSelected(day.date)
                    ? 'bg-red-500 text-white shadow-lg border-red-400'
                    : isToday(day.date)
                      ? isDarkMode
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-red-50 text-red-600 border-red-300'
                      : isDarkMode
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border-gray-700/50'
                        : 'bg-white/90 text-gray-700 hover:bg-gray-50 border-gray-300/60'
                } backdrop-blur-sm relative`}
                onClick={() => onDateSelect(day.date)}
              >
                {/* Rank Badge */}
                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  day.rank === 1 ? 'bg-yellow-500 text-white' :
                  day.rank <= 3 ? 'bg-orange-500 text-white' :
                  day.rank <= 5 ? 'bg-red-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {day.rank}
                </div>

                <span className={`text-xs font-medium ${
                  isSelected(day.date) ? 'text-white/80' : isToday(day.date) ? '' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {weekDay}
                </span>
                <span className="text-lg font-bold">{dayNum}</span>
                <span className={`text-xs font-medium ${getRankColor(day.rank)}`}>
                  ${formatVolume(day.volume)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeeklyCompetition = () => {
    const weeks = getWeeklyCompetition();
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {weeks.map((week, index) => {
          const weekEnd = new Date(week.date);
          weekEnd.setDate(week.date.getDate() + 6);
          const isSelectedWeek = selectedDate >= week.date && selectedDate <= weekEnd;
          const isCurrentWeek = today >= week.date && today <= weekEnd;
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl transition-all relative border ${
                isSelectedWeek
                  ? 'bg-red-500 text-white shadow-lg border-red-400'
                  : isCurrentWeek
                    ? isDarkMode
                      ? 'bg-red-500/20 text-red-400 border-red-500/50'
                      : 'bg-red-50 text-red-600 border-red-300'
                    : isDarkMode
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border-gray-700/30'
                      : 'bg-white/90 text-gray-700 hover:bg-gray-50 border-gray-300/60'
              } backdrop-blur-sm`}
              onClick={() => onDateSelect(week.date)}
            >
              {/* Rank Badge */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                week.rank === 1 ? 'bg-yellow-500 text-white' :
                week.rank <= 3 ? 'bg-orange-500 text-white' :
                week.rank <= 5 ? 'bg-red-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {week.rank}
              </div>

              <div className="text-xs font-medium mb-1">Week</div>
              <div className="text-sm font-bold mb-1">
                {week.date.getDate()}-{weekEnd.getDate()}
              </div>
              <div className="text-xs mb-2">
                {week.date.toLocaleDateString('en', { month: 'short' })}
              </div>
              <div className={`text-xs font-bold ${getRankColor(week.rank)}`}>
                ${formatVolume(week.volume)}
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  };

  const renderMonthlyCompetition = () => {
    const months = getMonthlyCompetition();
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {months.map((month, index) => {
          const isSelectedMonth = selectedDate.getMonth() === month.date.getMonth() && 
                                 selectedDate.getFullYear() === month.date.getFullYear();
          const isCurrentMonth = today.getMonth() === month.date.getMonth() && 
                                today.getFullYear() === month.date.getFullYear();
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl transition-all relative border ${
                isSelectedMonth
                  ? 'bg-red-500 text-white shadow-lg border-red-400'
                  : isCurrentMonth
                    ? isDarkMode
                      ? 'bg-red-500/20 text-red-400 border-red-500/50'
                      : 'bg-red-50 text-red-600 border-red-300'
                    : isDarkMode
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border-gray-700/30'
                      : 'bg-white/90 text-gray-700 hover:bg-gray-50 border-gray-300/60'
              } backdrop-blur-sm`}
              onClick={() => onDateSelect(month.date)}
            >
              {/* Rank Badge */}
              <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                month.rank === 1 ? 'bg-yellow-500 text-white' :
                month.rank <= 3 ? 'bg-orange-500 text-white' :
                month.rank <= 5 ? 'bg-red-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {month.rank}
              </div>

              <div className="text-xl font-bold mb-2">
                {month.date.toLocaleDateString('en', { month: 'short' })}
              </div>
              <div className="text-sm mb-3">
                {month.date.getFullYear()}
              </div>
              <div className={`text-sm font-bold ${getRankColor(month.rank)}`}>
                ${formatVolume(month.volume)}
              </div>
              <div className={`text-xs mt-1 flex items-center justify-center gap-1 ${
                month.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                <TrendingUp className={`w-3 h-3 ${month.change < 0 ? 'rotate-180' : ''}`} />
                {month.change >= 0 ? '+' : ''}{month.change.toFixed(1)}%
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  };

  const getCompetitionTitle = () => {
    switch (competitionPeriod) {
      case 'daily':
        return 'Daily Volume Competition';
      case 'weekly':
        return 'Weekly Volume Competition';
      case 'monthly':
        return 'Monthly Volume Competition';
    }
  };

  const getCompetitionSubtitle = () => {
    switch (competitionPeriod) {
      case 'daily':
        return 'Last 30 days • Rank by daily volume';
      case 'weekly':
        return 'Last 12 weeks • Rank by weekly volume';
      case 'monthly':
        return 'Last 6 months • Rank by monthly volume';
    }
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-900/40' : 'bg-white/60'
    } backdrop-blur-xl p-6 rounded-xl border ${
      isDarkMode ? 'border-gray-700/30' : 'border-white/40'
    } mb-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-red-500/20' : 'bg-red-50'}`}>
            <Trophy className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {getCompetitionTitle()}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {getCompetitionSubtitle()}
            </p>
          </div>
        </div>

        <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600'}`}>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Live Rankings</span>
          </div>
        </div>
      </div>

      {/* Competition Period Selector */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-gray-500/10">
        {(['daily', 'weekly', 'monthly'] as CompetitionPeriod[]).map((period) => (
          <button
            key={period}
            onClick={() => setCompetitionPeriod(period)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              competitionPeriod === period
                ? 'bg-red-500 text-white shadow-lg'
                : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700/50'
                  : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)} Competition
          </button>
        ))}
      </div>

      {/* Competition Calendar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={competitionPeriod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {competitionPeriod === 'daily' && renderDailyCompetition()}
          {competitionPeriod === 'weekly' && renderWeeklyCompetition()}
          {competitionPeriod === 'monthly' && renderMonthlyCompetition()}
        </motion.div>
      </AnimatePresence>

      {/* Competition Info */}
      <div className={`mt-6 p-4 rounded-xl ${
        isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/80'
      } border ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200/50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Selected Period
            </div>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedDate.toLocaleDateString('en', { 
                weekday: 'short',
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Your Rank
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">1</span>
              </div>
              <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                #1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
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
          <div className="w-4 h-4 rounded-full bg-gray-500"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Others</span>
        </div>
      </div>
    </div>
  );
};

export default VolumeCompetitionCalendar;