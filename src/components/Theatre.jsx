import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const lines = [
  { text: '11 years.', size: 'text-4xl md:text-6xl', delay: 0.3 },
  { text: '149,860 songs.', size: 'text-4xl md:text-6xl', delay: 1.6 },
  { text: 'One person.', size: 'text-4xl md:text-6xl', delay: 2.9 },
  { text: 'Some people write diaries.', size: 'text-3xl md:text-5xl', delay: 4.1 },
  { text: 'You made playlists.', size: 'text-5xl md:text-7xl', delay: 5.3, accent: true },
];

export default function Theatre({ onBegin }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 7100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="grain" />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 4px)',
        }}
      />
      <div
        className="absolute top-10 left-10 text-muted font-mono text-xs tracking-widest hidden sm:block"
        style={{ transform: 'rotate(-3deg)' }}
      >
        SIDE A · 2013–2024
      </div>
      <div
        className="absolute bottom-24 right-10 text-muted font-mono text-xs tracking-widest hidden sm:block"
        style={{ transform: 'rotate(2deg)' }}
      >
        ⏵ PLAY
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-4xl">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: line.delay, ease: 'easeOut' }}
            className={`font-serif ${line.size} font-semibold tracking-tight ${
              line.accent ? 'text-warm2 mt-2 italic' : 'text-primary'
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
            whileHover={{ scale: 1.03, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBegin}
            className="mt-10 px-10 py-4 border-2 border-warm1 bg-transparent text-warm2 font-mono font-bold text-base tracking-[0.2em] uppercase transition-all duration-300"
            style={{ boxShadow: '6px 6px 0 0 #C1502E' }}
          >
            ▶ Press Play
          </motion.button>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showButton ? 0.7 : 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-8 text-muted text-xs tracking-[0.3em] uppercase font-mono"
      >
        Rewind
      </motion.p>
    </div>
  );
}
