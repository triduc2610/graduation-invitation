import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MessageSquareCode, Feather, Heart, GraduationCap, Clock, Award, ShieldAlert } from 'lucide-react';
import { Wish } from '../types';
import { INITIAL_WISHES } from '../data';

interface WishesBoardProps {
  wishes: Wish[];
  onAddNewWish: (wish: Wish) => void;
}

export default function WishesBoard({ wishes, onAddNewWish }: WishesBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'family' | 'friend' | 'professor'>('all');
  
  // Note Submission state
  const [noteName, setNoteName] = useState('');
  const [noteMsg, setNoteMsg] = useState('');
  const [noteRelation, setNoteRelation] = useState<'family' | 'friend' | 'professor' | 'classmate' | 'other'>('friend');
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handlePostQuickNote = (e: FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!noteName.trim()) {
      setErrorText('Please specify your name.');
      return;
    }
    if (!noteMsg.trim()) {
      setErrorText('Please write a congratulatory wish.');
      return;
    }

    const newWish: Wish = {
      id: `wish_${Date.now()}`,
      name: noteName.trim(),
      message: noteMsg.trim(),
      relation: noteRelation,
      timestamp: Date.now(),
      avatarSeed: noteName.trim().slice(0, 3)
    };

    // Save to LocalStorage
    try {
      const existingWishesRaw = localStorage.getItem('graduation_wishes');
      const existingWishes: Wish[] = existingWishesRaw ? JSON.parse(existingWishesRaw) : [];
      existingWishes.push(newWish);
      localStorage.setItem('graduation_wishes', JSON.stringify(existingWishes));

      // Propagate up to parent
      onAddNewWish(newWish);

      // Reset
      setNoteName('');
      setNoteMsg('');
      setNoteRelation('friend');
      setShowQuickNote(false);
    } catch (err) {
      console.error(err);
      setErrorText('Could not post your note. Please try again.');
    }
  };

  const getRelationBadge = (rel: string) => {
    switch (rel) {
      case 'professor':
        return { label: 'FACULTY', style: 'bg-emerald-950/45 border-emerald-800 text-emerald-300' };
      case 'family':
        return { label: 'FAMILY', style: 'bg-red-950/45 border-red-800 text-red-300' };
      case 'friend':
      case 'classmate':
        return { label: 'FRIEND', style: 'bg-indigo-950/45 border-indigo-800 text-indigo-300' };
      default:
        return { label: 'GUEST', style: 'bg-slate-800/80 border-slate-700 text-slate-300' };
    }
  };

  const filteredWishes = wishes.filter(wish => {
    const matchesSearch = wish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wish.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
                          (activeFilter === 'friend' && (wish.relation === 'friend' || wish.relation === 'classmate')) ||
                          wish.relation === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div id="wishes-wall-panel" className="w-full max-w-5xl mx-auto py-12 px-4">
      
      {/* Title & Introduction */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold font-display text-[10px] tracking-widest font-semibold mb-3">
          <MessageSquareCode className="w-3.5 h-3.5" />
          COMMUNITY CONGRATULATIONS
        </div>
        <h3 className="font-display text-3xl font-extrabold text-white tracking-wide">
          Wishes & Guestbook
        </h3>
        <p className="text-gray-400 font-serif text-sm italic mt-1 max-w-md mx-auto">
          Read congratulations or pin a direct note on the graduate's celebratory wishes wall
        </p>
      </div>

      {/* Filters, Search & Pin Note button */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl mb-8">
        
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search wishes by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-gold/50 font-serif"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0 ml-1" />
          {(['all', 'professor', 'family', 'friend'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-md text-xs font-display font-semibold tracking-wider uppercase transition-all cursor-pointer shrink-0 ${
                activeFilter === filter
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Write a Quick Wish Trigger */}
        <button
          onClick={() => setShowQuickNote(true)}
          className="w-full md:w-auto px-4 py-2 bg-gold text-slate-950 font-display font-black text-xs tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105 active:scale-95 transition-all"
        >
          <Feather className="w-3.5 h-3.5 text-slate-950" />
          PIN QUICK WISH
        </button>
      </div>

      {/* Quick Note Overlay Form */}
      <AnimatePresence>
        {showQuickNote && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 border border-gold/30 p-6 sm:p-8 rounded-xl max-w-md w-full relative shadow-2xl text-left"
            >
              {/* Top trim */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

              <h4 className="font-display text-lg font-bold text-white tracking-wider flex items-center gap-2 mb-2">
                <Feather className="w-4 h-4 text-gold" />
                Pin a blessing to the Wall
              </h4>
              <p className="text-gray-400 font-serif text-xs italic mb-4">
                Leave a short message celebrating Emily's academic achievements.
              </p>

              <form onSubmit={handlePostQuickNote} className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-sans text-gray-400 font-semibold tracking-wider">YOUR NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Uncle Raymond"
                    value={noteName}
                    onChange={(e) => setNoteName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-serif focus:outline-none focus:border-gold/40"
                  />
                </div>

                {/* Relation */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-sans text-gray-400 font-semibold tracking-wider">RELATION TO THE GRADUATE</label>
                  <select
                    value={noteRelation}
                    onChange={(e) => setNoteRelation(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-serif focus:outline-none focus:border-gold/40 cursor-pointer"
                  >
                    <option value="friend">Friend / Peer</option>
                    <option value="classmate">Classmate</option>
                    <option value="family">Family Member</option>
                    <option value="professor">Professor / Mentor</option>
                    <option value="other">Well-Wisher</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-sans text-gray-400 font-semibold tracking-wider">CONGRATULATORY NOTE</label>
                  <textarea
                    rows={4}
                    placeholder="Wishing you massive success Emily..."
                    value={noteMsg}
                    onChange={(e) => setNoteMsg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-serif focus:outline-none focus:border-gold/40 resize-none"
                  />
                </div>

                {/* Error field */}
                {errorText && (
                  <div className="flex items-center gap-1.5 text-red-400 bg-red-950/20 px-3 py-2 rounded-md text-xs border border-red-900/40">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{errorText}</span>
                  </div>
                )}

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickNote(false)}
                    className="py-2 border border-slate-800 text-gray-400 font-display text-[10px] tracking-wider font-semibold rounded-lg hover:text-white hover:bg-slate-900 cursor-pointer transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="py-2 bg-gold text-slate-950 font-display text-[10px] tracking-wider font-black rounded-lg hover:brightness-105 cursor-pointer transition-all flex items-center justify-center gap-1"
                  >
                    <Feather className="w-3 h-3 text-slate-950" />
                    PIN TO WALL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wishes Masonry Grid */}
      <AnimatePresence mode="popLayout">
        {filteredWishes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center text-gray-500 px-6 font-serif"
          >
            <Feather className="w-8 h-8 text-gold/30 mb-2" />
            <p className="text-sm">No blessings found matching the filters.</p>
            <p className="text-xs mt-1 text-gray-600">Be the first to post a custom congratulatory wish!</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] text-left"
          >
            {filteredWishes.map((wish) => {
              const badge = getRelationBadge(wish.relation);
              const initials = wish.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

              return (
                <motion.div
                  key={wish.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="wishes-card break-inside-avoid bg-white/95 border border-amber-100 rounded-xl p-6 shadow-md relative group flex flex-col gap-4 overflow-hidden hover:shadow-xl hover:border-gold/20 transition-all duration-300"
                >
                  {/* Small gold corner stamp for elegant touch */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-50 to-transparent pointer-events-none" />

                  {/* Top: Profile emblem & Metadata */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar sphere */}
                      <div className="w-9 h-9 rounded-full bg-slate-950 border border-gold/40 flex items-center justify-center text-[10px] font-display font-semibold text-gold-light select-none">
                        {initials || 'G'}
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-black text-gray-900 tracking-wide line-clamp-1">{wish.name}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-0.5 font-sans">
                          <Clock className="w-3 h-3 text-amber-800" />
                          <span>{new Date(wish.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    {/* Relation Badge */}
                    <span className={`px-2 py-0.5 rounded text-[8px] font-display font-bold tracking-widest border shrink-0 ${badge.style}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Heart graphic stamp on family posts */}
                  {wish.relation === 'family' && (
                    <div className="absolute -bottom-4 -right-4 text-red-500/5 select-none pointer-events-none">
                      <Heart className="w-24 h-24" fill="currentColor" />
                    </div>
                  )}

                  {/* Mortarboard graphic stamp on professor posts */}
                  {wish.relation === 'professor' && (
                    <div className="absolute -bottom-4 -right-4 text-emerald-500/5 select-none pointer-events-none">
                      <GraduationCap className="w-24 h-24" fill="currentColor" />
                    </div>
                  )}

                  {/* Middle: The custom message */}
                  <p className="font-serif text-sm text-gray-700 leading-relaxed italic relative z-10">
                    &ldquo;{wish.message}&rdquo;
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
