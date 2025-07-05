import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CompactCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isDarkMode: boolean;
}

const CompactCalendar: React.FC<CompactCalendarProps> = ({
  selectedDate,
  onDateSelect,
  isDarkMode
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysArray = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
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

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex gap-1 flex-1 overflow-x-auto scrollbar-hide" ref={scrollRef}>
        {getDaysArray().map((date, index) => {
          const day = date.getDate().toString();
          const weekDay = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center min-w-[40px] h-12 rounded-lg transition-all border ${
                isSelected(date)
                  ? 'bg-blue-500 text-white shadow-lg border-blue-500'
                  : isToday(date)
                    ? isDarkMode
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      : 'bg-blue-50 text-blue-600 border-blue-200'
                    : isDarkMode
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border-gray-700/30'
                      : 'bg-white/80 text-gray-700 hover:bg-gray-50 border-gray-200/50'
              } backdrop-blur-sm`}
              onClick={() => onDateSelect(date)}
            >
              <span className="text-xs font-medium">{weekDay}</span>
              <span className="text-sm font-bold">{day}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CompactCalendar;