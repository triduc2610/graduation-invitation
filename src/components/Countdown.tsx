import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Award } from 'lucide-react';
import { GRADUATION_INFO } from '../data';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

export default function Countdown() {
  const targetDate = new Date(GRADUATION_INFO.date);
  
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isCompleted: false
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  const timeUnits = [
    { label: 'NGÀY', value: timeLeft.days },
    { label: 'GIỜ', value: timeLeft.hours },
    { label: 'PHÚT', value: timeLeft.minutes },
    { label: 'GIÂY', value: timeLeft.seconds }
  ];

  return (
    <div id="countdown-timer" className="flex flex-col items-center py-12 px-4 relative w-full">
      {/* Decorative Golden Vines Frame */}
      <div className="absolute inset-0 max-w-4xl mx-auto border border-gold/20 rounded-2xl pointer-events-none -z-10 m-4 flex items-center justify-center">
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold/30 rounded-tl" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/30 rounded-tr" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/30 rounded-bl" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold/30 rounded-br" />
      </div>

      <div className="text-center mb-8 z-10">
        <div className="flex items-center justify-center gap-2 text-gold font-display text-xs tracking-widest font-semibold mb-2">
          <Clock className="w-4 h-4 animate-pulse" />
          ĐẾM NGƯỢC NGÀY TỐT NGHIỆP
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-wide">
          Thời Gian Còn Lại
        </h3>
      </div>

      {timeLeft.isCompleted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-navy border border-gold/40 rounded-xl p-8 max-w-md text-center shadow-lg"
        >
          <Award className="w-12 h-12 text-gold mx-auto mb-4 animate-spin-slow" />
          <p className="font-display text-lg font-bold text-white tracking-wider mb-2">BUỔI LỄ ĐÃ CHÍNH THỨC BẮT ĐẦU</p>
          <p className="font-serif text-gray-300 text-sm">
            NHẬT LINH đã chính thức tốt nghiệp! Hãy cùng nhau chúc mừng cột mốc ý nghĩa này.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full px-4 z-10">
          {timeUnits.map((unit, idx) => (
            <div
              key={unit.label}
              className="relative flex flex-col items-center"
            >
              {/* Outer circular background */}
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-navy-dark via-slate-900 to-navy border border-gold/30 flex flex-col items-center justify-center shadow-xl relative overflow-hidden group">
                {/* Golden inner ring */}
                <div className="absolute inset-1.5 rounded-full border border-dashed border-gold/20 group-hover:border-gold/40 transition-colors" />
                
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                {/* Animated changing value */}
                <span className="font-display text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-amber-300 tracking-tight leading-none">
                  {formatNumber(unit.value)}
                </span>
                
                {/* Circular unit label */}
                <span className="font-sans text-[9px] md:text-[10px] text-gray-400 tracking-widest font-semibold mt-1">
                  {unit.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Date detail line */}
      <div className="mt-8 flex flex-col items-center gap-1 z-10">
        <div className="flex items-center gap-2 text-gold-light font-serif text-sm italic">
          <Calendar className="w-4 h-4" />
          Lễ trao bằng tốt nghiệp: 10:00 Sáng, ngày 12 tháng 07 năm 2026
        </div>
      </div>
    </div>
  );
}
