import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

export default function AudioPlayer({ autoPlayTrigger }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Send controls to YouTube Iframe
  const sendCommand = (func: string, args: any[] = []) => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: func,
          args: args
        }),
        '*'
      );
    } catch (e) {
      console.warn("YouTube control error:", e);
    }
  };

  // Attempt play on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      sendCommand('playVideo');
      sendCommand('setVolume', [volume * 100]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Synchronize autoplay click
  useEffect(() => {
    if (autoPlayTrigger) {
      setTimeout(() => {
        sendCommand('playVideo');
        sendCommand('setVolume', [volume * 100]);
        setIsPlaying(true);
      }, 500);
    }
  }, [autoPlayTrigger]);

  // Synchronize mute/volume adjustments
  useEffect(() => {
    if (isPlaying) {
      if (isMuted) {
        sendCommand('mute');
      } else {
        sendCommand('unMute');
        sendCommand('setVolume', [volume * 100]);
      }
    }
  }, [volume, isMuted, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      sendCommand('setVolume', [volume * 100]);
      setIsPlaying(true);
    }
  };

  return (
    <div id="ambient-audio-player" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Hidden YouTube player embedding the requested track */}
      <iframe
        ref={iframeRef}
        id="yt-music-iframe"
        src="https://www.youtube.com/embed/hceNBCnOx44?enablejsapi=1&autoplay=1&loop=1&playlist=hceNBCnOx44&controls=0&mute=0&rel=0&start=3"
        className="hidden pointer-events-none w-0 h-0 absolute opacity-0"
        allow="autoplay"
        title="Background Music Player"
      />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            className="mb-3 bg-slate-950/95 border border-gold/35 rounded-xl p-4 shadow-2xl flex flex-col gap-3.5 max-w-[280px] text-left"
          >
            {/* Track Info */}
            <div className="flex items-center gap-3">
              {/* Spinning Disc */}
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br from-gold via-slate-900 to-gold border border-gold-dark p-0.5 relative flex items-center justify-center shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[10px] text-gold font-bold font-display">
                  🎓
                </div>
                {/* Spindle hole */}
                <div className="absolute w-2 h-2 rounded-full bg-slate-900 border border-gold-light" />
              </div>

              <div>
                <p className="text-white text-xs font-semibold tracking-wide truncate w-[160px]">Graduation Background Theme</p>
                <p className="text-gray-400 font-serif text-[10px] italic truncate w-[160px]">Requested YouTube Audio</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4 border-t border-slate-800/60 pt-3">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-gold hover:scale-105 active:scale-95 text-slate-950 flex flex-col items-center justify-center cursor-pointer transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-slate-950" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                  )}
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-16 h-1 bg-slate-800 accent-gold rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Floating Circle Controller */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center border cursor-pointer transition-all ${
          isPlaying
            ? 'bg-gold border-gold text-slate-950 animate-pulse'
            : 'bg-slate-950 border-gold/40 text-gold hover:border-gold'
        }`}
      >
        <Music className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
      </motion.button>
      
      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
