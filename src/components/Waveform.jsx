import { motion } from 'framer-motion';

const COLORS = ['#C1502E', '#D4A017', '#2F6F6E', '#E8C468'];

// A decorative, self-animating audio waveform — no audio API, no file,
// just bars breathing at different phases so it reads as "live" music.
export default function Waveform({ bars = 48, className = '', opacity = 0.14 }) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`} style={{ opacity }}>
      {Array.from({ length: bars }).map((_, i) => {
        const peak = 25 + Math.abs(Math.sin(i * 0.7)) * 65;
        return (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{ background: COLORS[i % COLORS.length], minWidth: 2 }}
            animate={{ height: [`${peak * 0.25}%`, `${peak}%`, `${peak * 0.35}%`, `${peak * 0.8}%`, `${peak * 0.25}%`] }}
            transition={{
              duration: 1.6 + (i % 6) * 0.25,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i % 9) * 0.12,
            }}
          />
        );
      })}
    </div>
  );
}
