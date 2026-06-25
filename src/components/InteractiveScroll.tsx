import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scroll, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { GRADUATION_INFO, DEFAULT_MAIN_PHOTO } from '../data';

export default function InteractiveScroll() {
  const [isUnrolled, setIsUnrolled] = useState(false);
  const [mainPhoto, setMainPhoto] = useState(DEFAULT_MAIN_PHOTO);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Load photo on mount and on custom event
  const loadMainPhoto = () => {
    const savedMainPhoto = localStorage.getItem('grad_main_photo');
    if (savedMainPhoto) {
      setMainPhoto(savedMainPhoto);
    } else {
      setMainPhoto(DEFAULT_MAIN_PHOTO);
    }
  };

  useEffect(() => {
    loadMainPhoto();
    window.addEventListener('grad_photo_updated', loadMainPhoto);
    return () => {
      window.removeEventListener('grad_photo_updated', loadMainPhoto);
    };
  }, []);

  const handleUnroll = () => {
    setIsUnrolled(true);
    // Play a gentle paper-rustling scroll sound if supported, or just scroll to view
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 450);
  };

  return (
    <div id="interactive-scroll-container" className="flex flex-col items-center justify-center py-12 px-4 w-full" ref={scrollRef}>
      <AnimatePresence mode="wait">
        {!isUnrolled ? (
          /* ================= ROLLED SCROLL STATE ================= */
          <motion.div
            key="rolled"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative cursor-pointer group flex flex-col items-center"
            onClick={handleUnroll}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* The Scroll Body */}
            <div className="relative w-72 h-20 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 rounded-lg shadow-xl border-t border-b border-amber-200/60 flex items-center justify-center overflow-visible">
              
              {/* Left Scroll Roller / Wooden Dowel Tip */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-24 bg-gradient-to-b from-amber-800 via-amber-600 to-amber-900 rounded-full border-r border-gold shadow-md flex items-center justify-center">
                <div className="w-2 h-2 bg-gold rounded-full" />
              </div>

              {/* Right Scroll Roller / Wooden Dowel Tip */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-24 bg-gradient-to-b from-amber-800 via-amber-600 to-amber-900 rounded-full border-l border-gold shadow-md flex items-center justify-center">
                <div className="w-2 h-2 bg-gold rounded-full" />
              </div>

              {/* Decorative Scroll Lines / Rolled edges */}
              <div className="absolute left-6 inset-y-0 w-[1px] bg-amber-200/40" />
              <div className="absolute right-6 inset-y-0 w-[1px] bg-amber-200/40" />

              {/* Elegant Text */}
              <div className="text-center z-10 px-4">
                <p className="font-display text-xs tracking-[0.25em] text-gold-dark font-semibold">LỄ TỐT NGHIỆP</p>
                <p className="font-serif text-sm italic text-gray-700">Hoàng Vũ Nhật Linh</p>
              </div>

              {/* Royal Ribbon Overlay */}
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-10 bg-gradient-to-r from-red-800 via-red-600 to-red-800 shadow-lg flex items-center justify-center">
                {/* Gold Tassel Ribbons dangling down */}
                <div className="absolute -bottom-6 left-1 w-3 h-8 bg-red-700 clip-ribbon shadow-sm" />
                <div className="absolute -bottom-8 left-4 w-3 h-10 bg-red-800 clip-ribbon shadow-sm" />

                {/* Wax Seal */}
                <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-gold shadow-md flex items-center justify-center seal-pulse transform -translate-y-0.5 z-20">
                  <div className="w-9 h-9 rounded-full border border-dashed border-gold/40 flex items-center justify-center text-gold font-bold font-display text-base">
                    🎓
                  </div>
                </div>
              </div>
            </div>

            {/* Tap prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col items-center gap-1.5"
            >
              <div className="flex items-center gap-2 text-gold font-display text-xs tracking-wider font-semibold">
                <Scroll className="w-4 h-4 animate-bounce" />
                CHẠM ĐỂ MỞ THƯ MỜI
              </div>
              <p className="text-gray-400 font-serif text-xs italic">Xem chi tiết nghi lễ và buổi lễ tốt nghiệp chính thức</p>
            </motion.div>
          </motion.div>
        ) : (
          /* ================= UNROLLED PARCHMENT STATE ================= */
          <motion.div
            key="unrolled"
            initial={{ height: 100, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl relative"
          >
            {/* Top Scroll Handle */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[98%] h-4 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 rounded-full shadow-md z-20 border-b border-gold/40 flex justify-between px-8 items-center">
              <div className="w-2 h-2 bg-gold rounded-full" />
              <div className="w-2 h-2 bg-gold rounded-full" />
            </div>

            {/* Parchment Body */}
            <motion.div
              initial={{ scaleY: 0.1, originY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="parchment-bg border-l-4 border-r-4 border-amber-900/80 rounded-sm shadow-2xl p-6 sm:p-12 relative overflow-hidden text-gray-800"
            >
              {/* Ornate Gold Filigree Border Corners */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-gold/50 rounded-tl-md" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-gold/50 rounded-tr-md" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-gold/50 rounded-bl-md" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-gold/50 rounded-br-md" />

              {/* Watermark Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop" 
                  alt="Watermark Logo" 
                  className="w-96 h-96 object-contain rounded-full grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Scroll Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* Header emblem */}
                <div className="flex items-center gap-1.5 mb-6">
                  <div className="h-[1px] w-12 bg-gold/40" />
                  <span className="text-gold text-lg">🎓</span>
                  <div className="h-[1px] w-12 bg-gold/40" />
                </div>

                <p className="font-display text-sm tracking-[0.3em] text-gold-dark font-bold mb-2">
                  THƯ MỜI TỐT NGHIỆP
                </p>
                <p className="font-serif text-sm italic text-gray-500 mb-8">
                  Với niềm tự hào và hân hoan, trân trọng kính mời quý khách tới tham dự lễ tốt nghiệp của
                </p>

                {/* Graduate's name in glorious display font */}
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-wider mb-2">
                  {GRADUATION_INFO.graduateName}
                </h2>
                <div className="w-24 h-[1px] bg-gold my-4" />

                {/* Degree Information */}
                <div className="px-6 py-4 bg-amber-50/50 border border-amber-200/40 rounded-lg max-w-md mx-auto mb-8 shadow-inner">
                  <p className="font-serif text-lg font-medium text-amber-900">
                    {GRADUATION_INFO.degreeName}
                  </p>
                  <p className="font-display text-xs text-gold-dark tracking-widest font-semibold mt-1">
                    {GRADUATION_INFO.honors}
                  </p>
                  <p className="font-serif text-sm italic text-gray-600 mt-2">
                    {GRADUATION_INFO.universityName}
                  </p>
                </div>

                {/* Invitation Prose */}
                <p className="font-serif text-base text-gray-600 leading-relaxed max-w-lg mb-10">
                  Chặng đường nỗ lực bền bỉ, những ngày tháng học tập và rèn luyện đã kết tinh thành cột mốc đầy tự hào này. Sự hiện diện của bạn là niềm vinh hạnh lớn đối với chúng tôi.
                </p>

                {/* Event Cards (Ceremony) */}
                <div className="w-full text-left mb-10 max-w-md mx-auto">
                  {/* Ceremony Card */}
                  <div className="p-6 bg-white/85 border border-amber-100 rounded-lg shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:border-gold/40 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                    <div className="flex items-center gap-2 text-gold-dark font-display text-xs font-bold tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      BUỔI LỄ TỐT NGHIỆP CHÍNH THỨC
                    </div>
                    <h4 className="font-display text-base text-gray-900 font-bold">{GRADUATION_INFO.venueName}</h4>
                    <div className="flex flex-col gap-1.5 text-sm text-gray-600 font-serif">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-800" />
                        Chủ Nhật, ngày 12 tháng 07 năm 2026
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-800" />
                        {GRADUATION_INFO.ceremonyTime}
                      </div>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                        <span>{GRADUATION_INFO.venueAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ceremony Info picture */}
                <div className="w-full rounded-lg overflow-hidden border border-amber-200 shadow-md mb-8 group relative max-w-md">
                  <img
                    src={mainPhoto}
                    alt="Graduation Venue"
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Footer seal of authentication */}
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gold via-amber-200 to-gold p-0.5 shadow-md flex items-center justify-center">
                    <div className="w-full h-full bg-amber-50 rounded-full border border-gold-dark/60 flex items-center justify-center font-display text-[9px] font-bold text-amber-900 tracking-tighter text-center leading-none">
                      NIÊN KHÓA<br/><span className="text-xs font-black">2026</span>
                    </div>
                  </div>
                </div>

                {/* Roll back up button */}
                <button
                  onClick={() => setIsUnrolled(false)}
                  className="mt-12 text-gray-500 hover:text-gold-dark font-serif text-xs italic underline transition-colors"
                >
                  Cuộn thư mời lại
                </button>
              </motion.div>
            </motion.div>

            {/* Bottom Scroll Handle */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[98%] h-4 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 rounded-full shadow-md z-20 border-t border-gold/40 flex justify-between px-8 items-center">
              <div className="w-2 h-2 bg-gold rounded-full" />
              <div className="w-2 h-2 bg-gold rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled ribbon bottom shape for wax seal fallback */}
      <style>{`
        .clip-ribbon {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%);
        }
      `}</style>
    </div>
  );
}
