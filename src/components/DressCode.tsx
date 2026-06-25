import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function DressCode() {
  const colors = [
    { name: 'Trắng', sub: 'White', class: 'bg-white border border-gray-300' },
    { name: 'Beige / Kem', sub: 'Beige', class: 'bg-[#E6D5BC] border border-gold/20' },
    { name: 'Xanh Navy', sub: 'Navy Blue', class: 'bg-[#122240] border border-white/10' },
    { name: 'Xanh Olive', sub: 'Olive Green', class: 'bg-[#4B5320] border border-white/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-lg mx-auto bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-md shadow-xl text-center relative overflow-hidden"
    >
      {/* Decorative gold subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold font-display text-[10px] tracking-widest font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        DRESS CODE • TRANG PHỤC
      </div>

      <h3 className="font-display text-xl font-bold text-white tracking-wide mb-2">
        Dresscode
      </h3>
      
      <p className="text-gray-400 font-serif text-xs italic leading-relaxed mb-8 max-w-sm mx-auto">
        Chúng mình mong các khách mời có thể chọn trang phục có các tông màu bên dưới nhé.
      </p>

      <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
        {colors.map((color, index) => (
          <motion.div
            key={color.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-2.5 group"
          >
            {/* Color Swatch Circle */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-14 h-14 rounded-full shadow-lg cursor-pointer transition-all ${color.class} relative flex items-center justify-center`}
            >
              {/* Inner ring for gold touch */}
              <div className="absolute inset-1 rounded-full border border-black/5 pointer-events-none" />
            </motion.div>
            
            <div className="text-center">
              <p className="text-white text-[11px] font-sans font-semibold tracking-wide">
                {color.name}
              </p>
              <p className="text-gray-500 text-[9px] font-serif italic mt-0.5">
                {color.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
