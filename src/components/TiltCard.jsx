import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

export default function TiltCard({ children, className = '', glowColor = '#ffffff', maxTilt = 10, scale = 1.02, layout = false }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), { stiffness: 220, damping: 22 });
  const scaleSpring = useSpring(1, { stiffness: 220, damping: 22 });
  const glowX = useTransform(px, [0, 1], ['0%', '100%']);
  const glowY = useTransform(py, [0, 1], ['0%', '100%']);
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, ${glowColor}35, transparent 55%)`;

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }
  function handleEnter() {
    scaleSpring.set(scale);
  }
  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
    scaleSpring.set(1);
  }

  return (
    <motion.div
      ref={ref}
      layout={layout}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        scale: scaleSpring,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 rounded-card"
        style={{ background: glowBg }}
      />
      {children}
    </motion.div>
  );
}
