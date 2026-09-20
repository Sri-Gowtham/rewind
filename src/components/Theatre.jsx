import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const lines = [
  { text: '11 years.', size: 'text-4xl md:text-6xl', delay: 0.3 },
  { text: '149,860 songs.', size: 'text-4xl md:text-6xl', delay: 1.6 },
  { text: 'One person.', size: 'text-4xl md:text-6xl', delay: 2.9 },
  { text: 'What were they listening for?', size: 'text-5xl md:text-7xl', delay: 4.3, accent: true },
];

export default function Theatre({ onBegin }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 6200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 opacity-30" style={{
        background: 'radial-gradient(circle at 50% 40%, rgba(99,102,241,0.15), transparent 60%)'
      }} />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-4xl">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: line.delay, ease: 'easeOut' }}
            className={`${line.size} font-bold tracking-tight ${
              line.accent
                ? 'bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent mt-4'
                : 'text-primary'
            }`}
          >
            {line.text}
          </motion.p>
        ))}

        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBegin}
            className="mt-10 px-10 py-4 rounded-card bg-amber text-black font-semibold text-lg tracking-wide shadow-[0_0_40px_rgba(245,158,11,0.35)] hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] transition-all duration-300"
          >
            Begin
          </motion.button>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showButton ? 0.5 : 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-8 text-secondary text-sm tracking-widest uppercase"
      >
        Echoes — A Decade in Sound
      </motion.p>
    </div>
  );
}
