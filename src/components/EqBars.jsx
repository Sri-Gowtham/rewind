import { motion } from 'framer-motion';

// A segmented, hi-fi-equalizer style bar: a stack of small blocks rather
// than one smooth rounded rectangle. Deliberately not a Recharts <Bar/>.
export default function EqBars({ ratio, color, segments = 12, height = 180, width = 22, delay = 0, active = true }) {
  const lit = Math.max(1, Math.round(ratio * segments));
  const blocks = Array.from({ length: segments });
  const gap = 3;
  const blockHeight = (height - gap * (segments - 1)) / segments;

  return (
    <div className="flex flex-col-reverse" style={{ width, height, gap }}>
      {blocks.map((_, i) => {
        const isLit = i < lit;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleX: 0.5 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: delay + i * 0.012 }}
            style={{
              height: blockHeight,
              borderRadius: 1.5,
              background: isLit ? color : 'transparent',
              border: isLit ? 'none' : '1px solid #4A3B2E',
              opacity: isLit ? (active ? 1 : 0.35) : 1,
            }}
          />
        );
      })}
    </div>
  );
}
