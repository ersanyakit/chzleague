import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface LeaderboardCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isDarkMode: boolean;
}

const LeaderboardCalendar: React.FC<LeaderboardCalendarProps> = ({
  selectedDate,
  onDateSelect,
  isDarkMode
}) => {
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scrollToEnd = () => {
    if (calendarScrollRef.current) {
      calendarScrollRef.current.scrollTo({ 
        left: calendarScrollRef.current.scrollWidth, 
        behavior: 'smooth' 
      });
    }
  };

  useEffect(() => {
    scrollToEnd();
  }, []);

  const getDaysArray = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  };

  const isSelected = (date: Date) => {
    return date.getTime() === selectedDate.getTime();
  };

  const isToday = (date: Date) => {
    return date.getTime() === today.getTime();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl mb-6 ${
      isDarkMode 
        ? 'bg-gray-900/40 border-gray-700/30' 
        : 'bg-white/60 border-white/40'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
          <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <div>
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Trading Calendar
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Select date to view trading activity
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-xl border transition-all ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50' 
              : 'bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50'
          } backdrop-blur-sm`}
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() - 30);
            onDateSelect(newDate);
          }}
          aria-label="Previous 30 days"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <div 
          ref={calendarScrollRef} 
          className="flex gap-3 overflow-x-auto scrollbar-hide flex-1 py-2"
        >
          {getDaysArray().map((date, index) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const weekDay = weekDays[date.getDay()];
            
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  isSelected(date)
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/25'
                    : isToday(date)
                      ? isDarkMode
                        ? 'border-blue-400/50 bg-blue-500/10 text-blue-400'
                        : 'border-blue-400/50 bg-blue-50 text-blue-600'
                      : isDarkMode
                        ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600/50'
                        : 'bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                } backdrop-blur-sm`}
                onClick={() => onDateSelect(date)}
              >
                <span className={`text-xs font-medium mb-1 ${
                  isSelected(date) 
                    ? 'text-white/80' 
                    : isToday(date) 
                      ? isDarkMode ? 'text-blue-400/80' : 'text-blue-600/80'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {weekDay}
                </span>
                <span className={`text-xl font-bold leading-none ${
                  isSelected(date) || isToday(date) ? '' : ''
                }`}>
                  {day}
                </span>
                <span className={`text-xs font-medium mt-1 ${
                  isSelected(date) 
                    ? 'text-white/60' 
                    : isToday(date) 
                      ? isDarkMode ? 'text-blue-400/60' : 'text-blue-600/60'
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {month}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-xl border transition-all ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50' 
              : 'bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50'
          } backdrop-blur-sm`}
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 30);
            if (newDate <= today) {
              onDateSelect(newDate);
            }
          }}
          disabled={selectedDate >= today}
          aria-label="Next 30 days"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default LeaderboardCalendar;