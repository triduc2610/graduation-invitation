import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Scroll, Sparkles, Utensils, 
  MapPin, Heart, Music, Calendar, Clock, ChevronDown, 
  Sparkle, Share2
} from 'lucide-react';

import { GRADUATION_INFO, TIMELINE_EVENTS, DEFAULT_MAIN_PHOTO } from './data';
import { RSVP } from './types';

// Component imports
import FloatingParticles from './components/FloatingParticles';
import InteractiveScroll from './components/InteractiveScroll';
import Countdown from './components/Countdown';
import RSVPForm from './components/RSVPForm';
import PhotoGallery from './components/PhotoGallery';
import ThankYouLetter from './components/ThankYouLetter';
import DressCode from './components/DressCode';
import AudioPlayer from './components/AudioPlayer';

export default function App() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [autoPlayMusic, setAutoPlayMusic] = useState(false);
  const [isOpenClicked, setIsOpenClicked] = useState(false);

  const invitationRef = useRef<HTMLDivElement | null>(null);

  // Initialize data from LocalStorage or Fallback defaults
  useEffect(() => {
    // Load RSVPs
    const storedRsvps = localStorage.getItem('graduation_rsvps');
    if (storedRsvps) {
      try {
        setRsvps(JSON.parse(storedRsvps));
      } catch (e) {
        console.error("Error parsing stored RSVPs", e);
      }
    }
  }, []);

  const handleOpenInvitation = () => {
    setIsOpenClicked(true);
    setAutoPlayMusic(true);
    
    // Smooth scroll to the main unrolled certificate area
    setTimeout(() => {
      invitationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleRsvpSuccess = () => {
    const storedRsvps = localStorage.getItem('graduation_rsvps');
    if (storedRsvps) {
      try {
        setRsvps(JSON.parse(storedRsvps));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const renderTimelineIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-gold" />;
      case 'Scroll': return <Scroll className="w-5 h-5 text-gold" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-gold-light" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-gold-light" />;
      default: return <Sparkle className="w-5 h-5 text-gold" />;
    }
  };

  // Copy invitation link to clipboard
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Đã sao chép liên kết thư mời! Bạn có thể chia sẻ liên kết này với gia đình và bạn bè.');
  };

  return (
    <div id="main-application-root" className="min-h-screen olive-academic-pattern text-slate-100 overflow-x-hidden relative selection:bg-gold/30 selection:text-white">
      
      {/* 1. Canvas Interactive Floating Particles */}
      <FloatingParticles />

      {/* 2. Audio Background Sound Node */}
      <AudioPlayer autoPlayTrigger={autoPlayMusic} />

      {/* 3. HERO/LANDING SCREEN (Full-height gate) */}
      <section className="min-h-screen flex flex-col items-center justify-between py-12 px-4 relative overflow-hidden z-20">
        {/* Top classical academic banner lines */}
        <div className="flex flex-col items-center gap-1.5 mt-6">
          <span className="font-display text-[10px] tracking-[0.4em] text-gold font-semibold text-center px-4">LỄ TRAO BẰNG TỐT NGHIỆP NIÊN KHÓA 2026</span>
          <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Centerpiece Crest */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center text-center w-full max-w-4xl px-2 my-auto gap-8"
        >
          {/* Animated Crest Stamp */}
          <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-dashed border-gold/40 flex items-center justify-center p-2.5 relative group hover:border-gold/80 transition-colors duration-500 shadow-2xl shadow-gold/5">
            <div className="w-full h-full bg-slate-950/80 rounded-full border border-gold overflow-hidden flex items-center justify-center text-gold shadow-xl relative z-10">
              <img
                src={DEFAULT_MAIN_PHOTO}
                alt="Portrait"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Spinning decorative stars */}
            <div className="absolute inset-0 border border-transparent border-t-gold/30 border-b-gold/30 rounded-full animate-spin-slow" />
          </div>

          <div className="space-y-4 w-full flex flex-col items-center">
            <h1 className="font-display text-2xl min-[360px]:text-3xl min-[410px]:text-4xl sm:text-5xl md:text-6xl font-black tracking-wide sm:tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-amber-500 leading-normal py-1 whitespace-nowrap">
              {GRADUATION_INFO.graduateName}
            </h1>
            <p className="font-serif text-base sm:text-lg italic text-gray-400">
              Tốt nghiệp Xuất sắc tại
            </p>
            <h2 className="font-display text-base sm:text-xl md:text-2xl tracking-[0.15em] text-white/90 font-bold max-w-xl mx-auto leading-relaxed">
              {GRADUATION_INFO.universityName.toUpperCase()}
            </h2>
          </div>

          {/* Golden Seal Entrance Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px 5px rgba(212, 175, 55, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenInvitation}
            className="mt-2 px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-amber-500 text-slate-950 font-display font-black text-xs tracking-[0.25em] rounded-full shadow-2xl relative cursor-pointer overflow-hidden flex items-center gap-2 group border border-gold-light/40"
          >
            {/* Glossy shine line */}
            <div className="absolute inset-y-0 -left-10 w-8 bg-white/20 skew-x-12 group-hover:translate-x-60 transition-transform duration-1000 ease-out" />
            <Scroll className="w-4 h-4 text-slate-950" />
            MỞ THƯ MỜI 
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 text-gray-500 animate-bounce cursor-pointer" onClick={handleOpenInvitation}>
          <span className="font-sans text-[9px] tracking-widest uppercase">XEM CHI TIẾT BÊN DƯỚI</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* 4. MAIN INVITATION CONTENT AREA */}
      <div 
        ref={invitationRef} 
        id="scroll-target-invitation" 
        className="w-full relative z-20 py-16 px-4 bg-gradient-to-b from-transparent via-slate-950/80 to-transparent"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-16">
          
          {/* A. Dynamic Interactive Scroll Component */}
          <InteractiveScroll />

          {/* B. Countdown Timer */}
          <Countdown />



          {/* D. Graduation Day Timeline */}
          <section id="ceremony-timeline" className="w-full py-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold font-display text-[10px] tracking-widest font-semibold mb-3">
                <Calendar className="w-3.5 h-3.5" />
                LỊCH TRÌNH BUỔI LỄ
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-wider">
                Thời Gian Chương Trình
              </h3>
              <p className="text-gray-400 font-serif text-sm italic mt-1">
                Lịch Trình
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto space-y-10 py-4">
              {/* Vertical timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 -translate-x-1/2 border-l border-gold/20" />

              {TIMELINE_EVENTS.map((evt, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <div 
                    key={evt.title} 
                    className={`relative flex flex-col md:flex-row items-start ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Floating Circle Timeline Node */}
                    <div className="absolute left-1 md:left-1/2 md:-translate-x-1/2 top-1 w-6 h-6 rounded-full bg-slate-950 border border-gold flex items-center justify-center shadow-lg z-10">
                      {renderTimelineIcon(evt.icon)}
                    </div>

                    {/* Timeline Text Card */}
                    <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${
                      isEven ? 'md:pr-10 md:text-right text-left' : 'md:pl-10 text-left'
                    }`}>
                      <span className="font-display text-xs text-gold font-bold tracking-widest">{evt.time}</span>
                      <h4 className="font-display text-base text-white font-bold mt-1 tracking-wide">{evt.title}</h4>
                      <p className="font-serif text-xs text-gray-400 mt-2 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    {/* Empty placeholder spacer for desktop alignment */}
                    <div className="hidden md:block w-[45%]" />
                  </div>
                );
              })}
            </div>
          </section>

          {/* E. Photo Gallery Carousel */}
          <PhotoGallery />

          {/* F. Ceremony Map details */}
          <section id="ceremony-venue-map" className="w-full py-6">
            <div className="text-center mb-10">
              <span className="font-display text-xs tracking-widest text-gold font-bold uppercase">BẢN ĐỒ & ĐỊA ĐIỂM</span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">Vị Trí Tổ Chức Buổi Lễ</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch max-w-4xl mx-auto">
              {/* Map Description Card */}
              <div className="md:col-span-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between text-left">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-display text-lg text-white font-bold">{GRADUATION_INFO.venueName}</h4>
                  <p className="font-serif text-xs text-gray-400 leading-relaxed">
                    Buổi lễ sẽ diễn ra tại trường Khoa học Liên ngành và Nghệ thuật
                  </p>
                  <p className="font-sans text-[11px] text-gray-500 font-bold tracking-wider">
                    NƠI ĐỖ XE: TRONG SÂN TRƯỜNG
                  </p>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(GRADUATION_INFO.venueAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center py-2.5 px-4 bg-slate-950 border border-gold/40 text-gold hover:text-slate-950 hover:bg-gold text-[10px] tracking-widest font-display font-semibold rounded-lg transition-all text-center cursor-pointer"
                >
                  CHỈ ĐƯỜNG BẢN ĐỒ
                </a>
              </div>

              {/* Map Iframe Embed container */}
              <div className="md:col-span-8 rounded-2xl overflow-hidden border border-slate-800 min-h-[300px] relative shadow-lg">
                <iframe
                  title="Stanford Memorial Auditorium Map"
                  src={GRADUATION_INFO.mapEmbedUrl}
                  className="w-full h-full border-0 min-h-[300px]"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </section>

          {/* G. RSVP form & Thank You Letter */}
          <section id="rsvp-guest-registration" className="w-full py-10 border-t border-slate-900/80 flex flex-col items-center gap-16">
            {/* Form */}
            <RSVPForm 
              onRsvpSuccess={handleRsvpSuccess} 
            />

            {/* Dress Code Section under RSVPForm */}
            <DressCode />

            {/* Thank You Letter */}
            <ThankYouLetter />
          </section>

        </div>
      </div>

      {/* 6. CORNER TOSS INTERACTION INSTRUCTION BUBBLE */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
        <div className="bg-slate-950/90 border border-gold/20 rounded-full px-4 py-2 shadow-2xl flex items-center gap-2 text-[10px] font-display text-gray-400 select-none">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>NHẤN VÀO NỀN MÀN HÌNH!</span>
        </div>
      </div>

    </div>
  );
}
