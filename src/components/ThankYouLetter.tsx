import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Mail, Check } from 'lucide-react';

export default function ThankYouLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the container is at least 30% visible in the viewport, automatically open it
        if (entry.isIntersecting) {
          setIsOpen(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px' // offset slightly so it triggers cleanly
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      id="thank-you-letter-section"
      ref={containerRef}
      className="w-full max-w-3xl mx-auto py-16 px-4 flex flex-col items-center"
    >
      {/* Title block */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold font-display text-[10px] tracking-widest font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 text-gold fill-gold/20 animate-pulse" />
          LỜI TRI ÂN SÂU SẮC
        </div>
        <h3 className="font-display text-3xl font-extrabold text-white tracking-wide">
          Thư Cảm Ơn
        </h3>
      </div>

      {/* The Envelope container */}
      <div className="relative w-full max-w-xl h-[420px] sm:h-[480px] flex items-end justify-center perspective-1000 mb-6">
        
        {/* Underlay Shadow */}
        <div className="absolute bottom-0 w-[95%] h-6 bg-black/60 rounded-full blur-xl filter opacity-80" />

        {/* 1. BACK OF ENVELOPE (The pocket) */}
        <div className="absolute bottom-0 w-full h-[240px] sm:h-[280px] bg-amber-900/10 border border-amber-950/20 rounded-b-2xl pointer-events-none" />

        {/* 2. THE LETTER PARCHMENT (Slides UP when open) */}
        <motion.div
          animate={isOpen ? { y: -160, scale: 1.02, zIndex: 30 } : { y: 0, scale: 0.95, zIndex: 10 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
          className="absolute bottom-2 w-[90%] sm:w-[94%] bg-[#fcf9f2] text-slate-800 rounded-lg shadow-xl p-6 sm:p-10 border-t border-b border-amber-200/50 flex flex-col items-center justify-center text-center font-serif transform-gpu origin-bottom h-[200px] sm:h-[240px] overflow-hidden"
        >
          {/* Subtle elegant border */}
          <div className="absolute inset-4 border border-gold/20 pointer-events-none rounded-md" />

          {/* Academic symbol watermark */}
          <div className="text-gold text-3xl mb-1 select-none">
            🎓
          </div>

          <h4 className="font-display text-4xl sm:text-6xl font-black tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-gold-dark via-amber-800 to-gold-dark leading-none">
            THANK YOU
          </h4>
        </motion.div>

        {/* 3. FRONT OF ENVELOPE (Left, Right and Bottom flap overlay) */}
        <div className="absolute bottom-0 w-full h-[240px] sm:h-[280px] z-20 pointer-events-none overflow-hidden rounded-b-2xl">
          {/* Main Envelope Body Color: Deep Midnight Royal Gold Cream combination */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/90 via-slate-900/95 to-amber-950/95" />
          
          {/* Diagonal left folder border */}
          <div className="absolute left-0 bottom-0 w-1/2 h-full bg-gradient-to-tr from-slate-950/80 to-transparent border-l border-b border-gold/10" style={{ clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)' }} />
          {/* Diagonal right folder border */}
          <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-tl from-slate-950/80 to-transparent border-r border-b border-gold/10" style={{ clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)' }} />
          
          {/* Triangular Bottom flap */}
          <div className="absolute left-0 right-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/80 via-slate-900 to-slate-950 border-t border-gold/15" style={{ clipPath: 'polygon(0% 100%, 50% 35%, 100% 100%)' }} />
        </div>

        {/* 4. ENVELOPE TOP FLAP (Folds up/open) */}
        <motion.div
          animate={isOpen ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 25 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-[120px] sm:h-[140px] top-[180px] sm:top-[200px] bg-gradient-to-b from-amber-900 to-slate-900 border-b border-gold/20 shadow-lg pointer-events-none transform-gpu"
          style={{ 
            transformOrigin: "top",
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
          }}
        />

        {/* 5. SEAL (Centred at the intersection of flap & body) */}
        <motion.div
          animate={isOpen ? { scale: 0, opacity: 0, zIndex: 0 } : { scale: 1, opacity: 1, zIndex: 35 }}
          transition={{ duration: 0.3 }}
          className="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-red-600 via-red-800 to-red-950 border-2 border-gold shadow-2xl flex items-center justify-center cursor-pointer pointer-events-auto bottom-[92px] sm:bottom-[112px]"
          onClick={() => setIsOpen(true)}
        >
          {/* Inner wax detail */}
          <div className="w-10 h-10 rounded-full border border-dashed border-gold/30 flex items-center justify-center text-gold font-bold text-sm">
            ❤️
          </div>
        </motion.div>
      </div>

      {/* Control Hint buttons */}
      <div className="flex gap-4 z-10">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-2 bg-slate-950/80 border border-gold/40 text-gold hover:bg-gold hover:text-slate-950 text-[10px] tracking-widest font-display font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            MỞ PHONG THƯ
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 bg-slate-950/80 border border-slate-800 text-gray-400 hover:text-white text-[10px] tracking-widest font-display font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            THU GỌN
          </button>
        )}
      </div>

      {/* Styled 3D helper styles */}
      <style>{`
        .perspective-1000 {
          perspective: 1200px;
        }
      `}</style>
    </div>
  );
}
