import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Clock, Moon, Star } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot,
} from 'recharts';
import { chapters, yearlyStats } from '../data/spotifyStory.js';
import { accentColor } from '../utils/color.js';
import WaveDivider from './WaveDivider.jsx';

const turningPoints = [
  "Spotify stopped being an experiment. Something clicked.",
  "The listening got heavier. Nights got longer. This became a habit, not a hobby.",
  "The world stopped. The music didn't. A new obsession took over.",
  "The chaos settled. New voices — new languages — entered the story.",
];

function chapterForYear(year) {
  return chapters.find((c) => year >= c.yearRange[0] && year <= c.yearRange[1]);
}

function ChapterCard({ chapter, isOpen, onToggle }) {
  const accent = accentColor(chapter.color);
  const yearsInChapter = yearlyStats.filter(
    (y) => y.year >= chapter.yearRange[0] && y.year <= chapter.yearRange[1]
  );
  const totalHours = yearsInChapter.reduce((s, y) => s + y.totalHours, 0);
  const totalLateNight = yearsInChapter.reduce((s, y) => s + y.lateNightPlays, 0);

  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="shrink-0 w-[85vw] sm:w-[480px] md:w-[520px] snap-center"
    >
      <div
        className="rounded-card p-[1.5px] h-full"
        style={{ background: `linear-gradient(150deg, ${accent}99 0%, #2A4A5A 45%, #4A9BAF99 100%)` }}
      >
        <div
          className="relative rounded-[10.5px] overflow-hidden bg-card h-full transition-shadow duration-300"
          style={{ boxShadow: `0 20px 50px -24px ${accent}70` }}
        >
          <div
            className="absolute inset-x-0 top-0 h-40 pointer-events-none"
            style={{ background: `linear-gradient(180deg, ${accent}45 0%, transparent 100%)` }}
          />

          <div className="relative p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
                style={{ backgroundColor: `${accent}25`, color: accent, border: `1px solid ${accent}70` }}
              >
                {chapter.years}
              </span>
              <Star className="w-4 h-4 opacity-70" style={{ color: accent }} />
            </div>

            <h3 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3 tracking-tight">
              {chapter.name}
            </h3>

            <p className="text-secondary/90 text-sm md:text-base leading-relaxed mb-5">
              {chapter.summary}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <div className="flex items-center gap-1 text-muted text-[10px] uppercase tracking-wide mb-1">
                  <Clock className="w-3 h-3" /> Hours
                </div>
                <div className="text-primary font-bold text-lg">{totalHours}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <div className="flex items-center gap-1 text-muted text-[10px] uppercase tracking-wide mb-1">
                  <Moon className="w-3 h-3" /> Late Night
                </div>
                <div className="text-primary font-bold text-lg">{totalLateNight.toLocaleString()}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <div className="text-muted text-[10px] uppercase tracking-wide mb-1">Top Artist</div>
                <div className="text-primary font-bold text-sm leading-tight">{chapter.topArtists[0]}</div>
              </div>
            </div>

            <div className="pl-4 py-2 mb-5 text-primary/90 text-sm italic" style={{ borderLeft: `3px solid ${accent}` }}>
              "{chapter.insight}"
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {chapter.topArtists.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-secondary border border-white/10"
                >
                  {a}
                </span>
              ))}
            </div>

            <button
              onClick={onToggle}
              className="flex items-center gap-1.5 text-secondary hover:text-warm3 text-sm font-medium transition-colors duration-300"
            >
              {isOpen ? 'Show less' : 'See the full chapter'}
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden relative"
              >
                <div className="px-6 md:px-8 pb-8 pt-2 bg-black/20 border-t border-white/5">
                  <h4 className="text-muted text-xs uppercase tracking-widest mb-3 font-semibold">
                    Key tracks
                  </h4>
                  <ul className="space-y-1.5 mb-6">
                    {chapter.keyTracks.map((t) => (
                      <li key={t} className="text-secondary text-sm">
                        • {t}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-muted text-xs uppercase tracking-widest mb-3 font-semibold">
                    Hours by year
                  </h4>
                  <div className="h-40 -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yearsInChapter}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis dataKey="year" stroke="#6B8FA0" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6B8FA0" fontSize={12} tickLine={false} axisLine={false} width={36} />
                        <Tooltip
                          contentStyle={{ background: '#1B3A4B', border: '1px solid #2A4A5A', borderRadius: 8, color: '#F2EDD8' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="totalHours" fill={accent} radius={[6, 6, 0, 0]} name="Hours" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function WaveDot(props) {
  const { cx, cy, payload } = props;
  const chapter = chapterForYear(payload.year);
  const accent = accentColor(chapter.color);
  return <Dot cx={cx} cy={cy} r={4.5} fill={accent} stroke="#0D1B2A" strokeWidth={2} />;
}

function CustomYearTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const y = payload[0].payload;
  const chapter = chapterForYear(y.year);
  const accent = accentColor(chapter.color);
  return (
    <div className="bg-card border border-border rounded-lg p-3 w-44 shadow-2xl text-left">
      <div className="font-bold text-sm mb-1 text-primary">{y.year}</div>
      <div className="text-xs text-secondary">Hours: <span className="text-primary font-medium">{y.totalHours}</span></div>
      <div className="text-xs text-secondary">Top artist: <span className="text-primary font-medium">{y.topArtist}</span></div>
      <div className="text-xs text-secondary">Late night: <span className="text-primary font-medium">{y.lateNightPlays.toLocaleString()}</span></div>
      <div className="text-xs" style={{ color: accent }}>Chapter: {chapter.name}</div>
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
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-card border border-border text-secondary hover:text-warm3 hover:border-cool2 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Next chapter"
          disabled={activeIdx === chapters.length - 1}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-card border border-border text-secondary hover:text-warm3 hover:border-cool2 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollerRef}
          className="flex md:flex-row flex-col gap-6 md:gap-8 md:overflow-x-auto pb-4 md:snap-x md:snap-mandatory scroll-thin items-stretch"
        >
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              isOpen={openId === chapter.id}
              onToggle={() => setOpenId(openId === chapter.id ? null : chapter.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-5">
        {chapters.map((c, i) => {
          const accent = accentColor(c.color);
          return (
            <button
              key={c.id}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${c.name}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: activeIdx === i ? 28 : 8,
                backgroundColor: activeIdx === i ? accent : '#2A4A5A',
              }}
            />
          );
        })}
      </div>

      <p className="hidden md:block text-center text-muted text-xs mt-3 tracking-wide">
        Use the arrows or drag to move between chapters — {activeIdx + 1} of {chapters.length}
      </p>

      <div className="my-10 md:my-12 max-w-2xl mx-auto">
        <h3 className="font-serif text-lg font-bold text-center mb-5">What Changed, Between Chapters</h3>
        <div className="space-y-4">
          {turningPoints.map((t, i) => {
            const from = chapters[i];
            const to = chapters[i + 1];
            const accent = accentColor(to.color);
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor(from.color) }} />
                  <span className="w-px flex-1 my-1 bg-border" style={{ minHeight: 18 }} />
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                </div>
                <div className="pb-2">
                  <p className="text-secondary text-sm">{t}</p>
                  <p className="text-muted text-xs mt-1">{from.name} → {to.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <WaveDivider id="story-mid" height={56} />

      <div className="mt-10">
        <h3 className="font-serif text-xl md:text-2xl font-bold mb-1">Riding the Waves</h3>
        <p className="text-secondary text-sm mb-6">Every year, its own swell — sized by hours listened, colored by chapter.</p>

        <div className="bg-card border border-border rounded-card p-4 md:p-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8682A" stopOpacity={0.55} />
                    <stop offset="55%" stopColor="#F0A050" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4A9BAF" stopOpacity={0.12} />
                  </linearGradient>
                  <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#E8682A" />
                    <stop offset="50%" stopColor="#F0A050" />
                    <stop offset="100%" stopColor="#4A9BAF" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A4A5A" vertical={false} />
                <XAxis dataKey="year" stroke="#6B8FA0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B8FA0" fontSize={12} tickLine={false} axisLine={false} width={40} />
                <Tooltip content={<CustomYearTooltip />} cursor={{ stroke: '#4A9BAF', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="totalHours"
                  stroke="url(#waveStroke)"
                  strokeWidth={3}
                  fill="url(#waveFill)"
                  dot={<WaveDot />}
                  activeDot={{ r: 6, stroke: '#0D1B2A', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center border-t border-border pt-4">
            {chapters.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-xs text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor(c.color) }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
