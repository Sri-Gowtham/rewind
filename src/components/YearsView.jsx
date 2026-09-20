/**
 * YearsView — year-by-year explorer.
 * A clickable equalizer-style year selector drives a detail panel with
 * per-year stats, top tracks, and a "night owl score" gauge.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Music, ListMusic, Clock } from 'lucide-react';
import { yearlyStats, topTracksAllTime, chapters } from '../data/spotifyStory.js';
import { accentColor } from '../utils/color.js';
import EqBars from './EqBars.jsx';

function chapterForYear(year) {
  return chapters.find((c) => year >= c.yearRange[0] && year <= c.yearRange[1]);
}

// Deterministic per-year top tracks derived from the all-time list, seeded by year
function tracksForYear(year) {
  const seed = year % topTracksAllTime.length;
  const rotated = [...topTracksAllTime.slice(seed), ...topTracksAllTime.slice(0, seed)];
  return rotated.slice(0, 8);
}

const maxHours = Math.max(...yearlyStats.map((y) => y.totalHours));

export default function YearsView() {
  const [selectedYear, setSelectedYear] = useState(2020);
  const year = yearlyStats.find((y) => y.year === selectedYear);
  const chapter = chapterForYear(selectedYear);
  const accent = accentColor(chapter.color);
  const lateNightPct = ((year.lateNightPlays / year.totalPlays) * 100).toFixed(1);
  const nightOwlScore = Math.min(100, Math.round((year.lateNightPlays / year.totalPlays) * 180));
  const tracks = tracksForYear(selectedYear);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 tracking-tight">Year by Year</h2>
        <p className="text-secondary text-sm md:text-base max-w-2xl">
          Twelve years, twelve very different people. Pick a year to see who they were.
        </p>
      </div>

      <div className="bg-card border-2 border-border p-4 md:p-6 mb-8">
        <div className="flex items-end justify-between gap-1.5 md:gap-3 overflow-x-auto pb-1">
          {yearlyStats.map((y) => {
            const c = chapterForYear(y.year);
            const acc = accentColor(c.color);
            const active = y.year === selectedYear;
            return (
              <motion.button
                key={y.year}
                onClick={() => setSelectedYear(y.year)}
                whileHover={{ y: -3 }}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <span className="font-mono text-[10px] text-muted">{y.totalHours}h</span>
                <EqBars ratio={y.totalHours / maxHours} color={acc} height={130} width={18} segments={13} active={active} />
                <span className={`font-mono text-[11px] mt-1 transition-colors duration-300 ${active ? 'text-primary font-bold' : 'text-muted'}`}>
                  {y.year}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border-2 border-border p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="font-serif text-2xl font-bold">{selectedYear}</h3>
                <span
                  className="px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wide"
                  style={{ backgroundColor: `${accent}25`, color: accent, border: `1px solid ${accent}60` }}
                >
                  Chapter: {chapter.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-secondary text-xs uppercase tracking-wide mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Hours</div>
                  <div className="text-3xl font-bold font-mono text-primary">{year.totalHours}</div>
                </div>
                <div>
                  <div className="text-secondary text-xs uppercase tracking-wide mb-1 flex items-center gap-1"><ListMusic className="w-3 h-3" /> Plays</div>
                  <div className="text-3xl font-bold font-mono text-primary">{year.totalPlays.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-secondary text-xs uppercase tracking-wide mb-1 flex items-center gap-1"><Moon className="w-3 h-3" /> Late Night</div>
                  <div className="text-3xl font-bold font-mono text-primary">{year.lateNightPlays.toLocaleString()}</div>
                  <div className="text-xs text-secondary">{lateNightPct}% of plays</div>
                </div>
                <div>
                  <div className="text-secondary text-xs uppercase tracking-wide mb-1 flex items-center gap-1"><Music className="w-3 h-3" /> Artists</div>
                  <div className="text-3xl font-bold font-mono text-primary">{year.uniqueArtists.toLocaleString()}</div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="text-secondary text-xs uppercase tracking-wide mb-1">Top Artist of {selectedYear}</div>
                <div className="font-serif text-2xl md:text-3xl font-bold" style={{ color: accent }}>{year.topArtist}</div>
              </div>
            </div>

            <div className="bg-card border-2 border-border p-6">
              <h4 className="text-sm font-bold uppercase tracking-wide text-secondary mb-4">Top Tracks This Year</h4>
              <ol className="space-y-3">
                {tracks.map((t, i) => (
                  <li key={t.track} className="flex items-center gap-4">
                    <span className="text-secondary font-mono text-sm w-5 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{t.track}</div>
                      <div className="text-xs text-secondary truncate">{t.artist}</div>
                    </div>
                    <div className="text-sm font-semibold shrink-0" style={{ color: accent }}>{t.minutes}m</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="bg-card border-2 border-border p-6 flex flex-col items-center justify-center text-center">
            <h4 className="text-sm font-bold uppercase tracking-wide text-secondary mb-6">Night Owl Score</h4>
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#4A3B2E" strokeWidth="10" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={accent}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - nightOwlScore / 100) }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-mono">{nightOwlScore}</span>
                <span className="text-xs text-secondary">/ 100</span>
              </div>
            </div>
            <p className="text-secondary text-sm mt-6 leading-relaxed">
              {nightOwlScore > 55
                ? 'A true night owl year — the music mostly happened after dark.'
                : nightOwlScore > 35
                ? 'A balanced year, tilted toward the night.'
                : 'Music mostly happened in daylight hours this year.'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
