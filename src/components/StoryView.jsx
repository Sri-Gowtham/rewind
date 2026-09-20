/**
 * StoryView — the narrative core of Rewind.
 * Renders the 5-chapter horizontal carousel (with click-to-open detail
 * modals), the "what changed between chapters" timeline, and the
 * year-by-year summary chart at the bottom.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Clock, Moon, Disc3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { chapters, yearlyStats } from '../data/spotifyStory.js';
import { accentColor } from '../utils/color.js';
import { playThunk, playClick } from '../utils/sound.js';
import EqBars from './EqBars.jsx';

const turningPoints = [
  "Spotify stopped being an experiment. Something clicked.",
  "The listening got heavier. Nights got longer. This became a habit, not a hobby.",
  "The world stopped. The music didn't. A new obsession took over.",
  "The chaos settled. New voices — new languages — entered the story.",
];

function chapterForYear(year) {
  return chapters.find((c) => year >= c.yearRange[0] && year <= c.yearRange[1]);
}

function ChapterCard({ chapter, onOpen, index }) {
  const accent = accentColor(chapter.color);
  const yearsInChapter = yearlyStats.filter(
    (y) => y.year >= chapter.yearRange[0] && y.year <= chapter.yearRange[1]
  );
  const totalHours = yearsInChapter.reduce((s, y) => s + y.totalHours, 0);
  const totalLateNight = yearsInChapter.reduce((s, y) => s + y.lateNightPlays, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, rotate: index % 2 === 0 ? -1 : 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="shrink-0 w-[85vw] sm:w-[440px] md:w-[460px] snap-center"
    >
      <button
        onClick={onOpen}
        className="ticket-hover ticket-notch halftone relative bg-card h-full text-left block w-full"
        style={{ '--accent': accent, border: `2px solid ${accent}`, boxShadow: `4px 4px 0 0 ${accent}` }}
      >
        <div className="px-6 md:px-7 pt-6 pb-2 flex items-center justify-between dashed-divider border-t-0" style={{ borderBottom: `2px dashed ${accent}55` }}>
          <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: accent }}>
            {chapter.years}
          </span>
          <Disc3 className="w-5 h-5" style={{ color: accent }} />
        </div>

        <div className="relative p-6 md:p-7">
          <h3 className="font-serif text-3xl md:text-[2.15rem] font-bold text-primary mb-3 tracking-tight leading-[1.05]">
            {chapter.name}
          </h3>

          <p className="text-secondary text-sm md:text-[0.95rem] leading-relaxed mb-5">
            {chapter.summary}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-5 font-mono">
            <div className="border border-border p-2.5">
              <div className="flex items-center gap-1 text-muted text-[9px] uppercase tracking-wide mb-1">
                <Clock className="w-3 h-3" /> Hrs
              </div>
              <div className="text-primary font-bold text-base">{totalHours}</div>
            </div>
            <div className="border border-border p-2.5">
              <div className="flex items-center gap-1 text-muted text-[9px] uppercase tracking-wide mb-1">
                <Moon className="w-3 h-3" /> Night
              </div>
              <div className="text-primary font-bold text-base">{totalLateNight.toLocaleString()}</div>
            </div>
            <div className="border border-border p-2.5">
              <div className="text-muted text-[9px] uppercase tracking-wide mb-1">Top Act</div>
              <div className="text-primary font-bold text-xs leading-tight">{chapter.topArtists[0]}</div>
            </div>
          </div>

          <div className="pl-4 py-1.5 mb-5 text-primary/90 text-sm italic" style={{ borderLeft: `3px solid ${accent}` }}>
            "{chapter.insight}"
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {chapter.topArtists.map((a) => (
              <span
                key={a}
                className="px-2.5 py-1 text-[11px] font-mono text-secondary border border-border"
              >
                {a}
              </span>
            ))}
          </div>

          <span
            className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest"
            style={{ color: accent }}
          >
            Play Chapter
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </button>
    </motion.div>
  );
}

function ChapterModal({ chapter, onClose }) {
  const accent = accentColor(chapter.color);
  const yearsInChapter = yearlyStats.filter(
    (y) => y.year >= chapter.yearRange[0] && y.year <= chapter.yearRange[1]
  );
  const totalHours = yearsInChapter.reduce((s, y) => s + y.totalHours, 0);
  const totalLateNight = yearsInChapter.reduce((s, y) => s + y.lateNightPlays, 0);
  const maxYearHours = Math.max(...yearsInChapter.map((y) => y.totalHours));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 bg-black/70"
        style={{ backdropFilter: 'blur(2px)' }}
        onClick={() => { playClick(); onClose(); }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative halftone bg-card w-full max-w-2xl max-h-[85vh] overflow-y-auto scroll-thin"
        style={{ border: `2px solid ${accent}`, boxShadow: `8px 8px 0 0 ${accent}` }}
      >
        <div
          className="sticky top-0 bg-card px-6 md:px-8 pt-6 pb-3 flex items-center justify-between z-10"
          style={{ borderBottom: `2px dashed ${accent}55` }}
        >
          <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: accent }}>
            {chapter.years}
          </span>
          <button
            onClick={() => { playClick(); onClose(); }}
            aria-label="Close"
            className="text-muted hover:text-warm2 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 md:px-8 py-6">
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3 tracking-tight">
            {chapter.name}
          </h3>

          <p className="text-secondary text-sm md:text-base leading-relaxed mb-6">
            {chapter.summary}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6 font-mono">
            <div className="border border-border p-3">
              <div className="flex items-center gap-1 text-muted text-[9px] uppercase tracking-wide mb-1">
                <Clock className="w-3 h-3" /> Hours
              </div>
              <div className="text-primary font-bold text-lg">{totalHours}</div>
            </div>
            <div className="border border-border p-3">
              <div className="flex items-center gap-1 text-muted text-[9px] uppercase tracking-wide mb-1">
                <Moon className="w-3 h-3" /> Late Night
              </div>
              <div className="text-primary font-bold text-lg">{totalLateNight.toLocaleString()}</div>
            </div>
            <div className="border border-border p-3">
              <div className="text-muted text-[9px] uppercase tracking-wide mb-1">Top Act</div>
              <div className="text-primary font-bold text-sm leading-tight">{chapter.topArtists[0]}</div>
            </div>
          </div>

          <div className="pl-4 py-1.5 mb-6 text-primary/90 text-sm italic" style={{ borderLeft: `3px solid ${accent}` }}>
            "{chapter.insight}"
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {chapter.topArtists.map((a) => (
              <span key={a} className="px-2.5 py-1 text-[11px] font-mono text-secondary border border-border">
                {a}
              </span>
            ))}
          </div>

          <h4 className="text-muted text-[10px] uppercase tracking-widest mb-3 font-mono">Key tracks</h4>
          <ul className="space-y-1.5 mb-7">
            {chapter.keyTracks.map((t) => (
              <li key={t} className="text-secondary text-sm">
                · {t}
              </li>
            ))}
          </ul>

          <h4 className="text-muted text-[10px] uppercase tracking-widest mb-4 font-mono">Hours by year</h4>
          <div className="flex items-end gap-6 justify-center">
            {yearsInChapter.map((y, i) => (
              <div key={y.year} className="flex flex-col items-center gap-2">
                <EqBars ratio={y.totalHours / maxYearHours} color={accent} height={100} width={18} segments={10} delay={i * 0.08} />
                <span className="font-mono text-[10px] text-muted">{String(y.year).slice(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SquareDot(props) {
  const { cx, cy, payload } = props;
  const chapter = chapterForYear(payload.year);
  const accent = accentColor(chapter.color);
  return <rect x={cx - 4} y={cy - 4} width={8} height={8} fill={accent} stroke="#1B1410" strokeWidth={1.5} />;
}

function CustomYearTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const y = payload[0].payload;
  const chapter = chapterForYear(y.year);
  const accent = accentColor(chapter.color);
  return (
    <div className="bg-card border-2 border-border p-3 w-44 text-left font-mono">
      <div className="font-bold text-sm mb-1 text-primary">{y.year}</div>
      <div className="text-[11px] text-secondary">Hours: <span className="text-primary">{y.totalHours}</span></div>
      <div className="text-[11px] text-secondary">Top: <span className="text-primary">{y.topArtist}</span></div>
      <div className="text-[11px] text-secondary">Night: <span className="text-primary">{y.lateNightPlays.toLocaleString()}</span></div>
      <div className="text-[11px] mt-1" style={{ color: accent }}>{chapter.name}</div>
    </div>
  );
}

export default function StoryView() {
  const [openId, setOpenId] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollerRef = useRef(null);

  const scrollToIndex = (i) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[i];
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const scrollBy = (dir) => {
    const next = Math.min(chapters.length - 1, Math.max(0, activeIdx + dir));
    setActiveIdx(next);
    scrollToIndex(next);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const children = Array.from(el.children);
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveIdx(closest);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div>
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 tracking-tight">The Story</h2>
        <p className="text-secondary text-sm md:text-base">
          Five chapters. Eleven years. One decade told entirely through what someone chose to listen to,
          and when.
        </p>
      </div>

      <div className="relative">
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous chapter"
          disabled={activeIdx === 0}
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 bg-card border-2 border-border text-secondary hover:text-warm2 hover:border-warm1 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          style={{ boxShadow: '3px 3px 0 0 #4A3B2E' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Next chapter"
          disabled={activeIdx === chapters.length - 1}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 bg-card border-2 border-border text-secondary hover:text-warm2 hover:border-warm1 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          style={{ boxShadow: '3px 3px 0 0 #4A3B2E' }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollerRef}
          className="flex md:flex-row flex-col gap-8 md:gap-10 md:overflow-x-auto pb-4 md:snap-x md:snap-mandatory scroll-thin items-stretch"
        >
          {chapters.map((chapter, i) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={i}
              onOpen={() => { playThunk(); setOpenId(chapter.id); }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openId && (
          <ChapterModal
            chapter={chapters.find((c) => c.id === openId)}
            onClose={() => setOpenId(null)}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-2 mt-6">
        {chapters.map((c, i) => {
          const accent = accentColor(c.color);
          return (
            <button
              key={c.id}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${c.name}`}
              className="h-1.5 transition-all duration-300"
              style={{
                width: activeIdx === i ? 28 : 8,
                backgroundColor: activeIdx === i ? accent : '#4A3B2E',
              }}
            />
          );
        })}
      </div>

      <p className="hidden md:block text-center text-muted text-xs mt-3 tracking-wide font-mono">
        ◀ ▶ or drag to move between chapters — {activeIdx + 1} / {chapters.length}
      </p>

      <div className="my-12 md:my-16 max-w-2xl mx-auto">
        <h3 className="font-serif text-lg font-bold text-center mb-6">What Changed, Between Chapters</h3>
        <div className="space-y-4">
          {turningPoints.map((t, i) => {
            const from = chapters[i];
            const to = chapters[i + 1];
            const accent = accentColor(to.color);
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <span className="w-2 h-2" style={{ backgroundColor: accentColor(from.color) }} />
                  <span className="w-px flex-1 my-1 bg-border" style={{ minHeight: 18 }} />
                  <span className="w-2 h-2" style={{ backgroundColor: accent }} />
                </div>
                <div className="pb-2">
                  <p className="text-secondary text-sm">{t}</p>
                  <p className="text-muted text-xs mt-1 font-mono">{from.name} → {to.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashed-divider mb-12" />

      <div>
        <h3 className="font-serif text-xl md:text-2xl font-bold mb-1">The Whole Tape</h3>
        <p className="text-secondary text-sm mb-6">Every year, played back to back — sized by hours, colored by chapter.</p>

        <div className="bg-card border-2 border-border p-4 md:p-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <pattern id="tapeHatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                    <rect width="7" height="7" fill="#C1502E" fillOpacity="0.06" />
                    <line x1="0" y1="0" x2="0" y2="7" stroke="#C1502E" strokeWidth="2.5" strokeOpacity="0.3" />
                  </pattern>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A3B2E" vertical={false} />
                <XAxis dataKey="year" stroke="#8A7860" fontSize={12} tickLine={false} axisLine={false} fontFamily="Space Mono" />
                <YAxis stroke="#8A7860" fontSize={12} tickLine={false} axisLine={false} width={40} fontFamily="Space Mono" />
                <Tooltip content={<CustomYearTooltip />} cursor={{ stroke: '#C1502E', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="linear"
                  dataKey="totalHours"
                  stroke="#C1502E"
                  strokeWidth={2.5}
                  fill="url(#tapeHatch)"
                  dot={<SquareDot />}
                  activeDot={{ r: 5, fill: '#E8C468', stroke: '#1B1410', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center border-t border-border pt-4 font-mono">
            {chapters.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-xs text-secondary">
                <span className="w-2.5 h-2.5" style={{ backgroundColor: accentColor(c.color) }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
