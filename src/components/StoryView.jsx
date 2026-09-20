import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Moon, Star, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { chapters, yearlyStats } from '../data/spotifyStory.js';

const turningPoints = [
  "Spotify stopped being an experiment. Something clicked.",
  "The listening got heavier. Nights got longer. This became a habit, not a hobby.",
  "The world stopped. The music didn't. A new obsession took over.",
  "The chaos settled. New voices — new languages — entered the story.",
];

function chapterForYear(year) {
  return chapters.find((c) => year >= c.yearRange[0] && year <= c.yearRange[1]);
}

const maxHours = Math.max(...yearlyStats.map((y) => y.totalHours));

function ChapterCard({ chapter, isOpen, onToggle }) {
  const yearsInChapter = yearlyStats.filter(
    (y) => y.year >= chapter.yearRange[0] && y.year <= chapter.yearRange[1]
  );
  const totalHours = yearsInChapter.reduce((s, y) => s + y.totalHours, 0);
  const totalLateNight = yearsInChapter.reduce((s, y) => s + y.lateNightPlays, 0);

  return (
    <motion.div
      layout
      className="shrink-0 w-[85vw] sm:w-[520px] md:w-[560px] snap-center"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`relative rounded-card overflow-hidden border border-border bg-gradient-to-br ${chapter.gradient} shadow-xl transition-shadow duration-300 hover:shadow-2xl`}
        style={{ boxShadow: `0 20px 60px -20px ${chapter.color}55` }}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{ backgroundColor: `${chapter.color}30`, color: '#fff', border: `1px solid ${chapter.color}80` }}
            >
              {chapter.years}
            </span>
            <Star className="w-4 h-4 opacity-60" style={{ color: chapter.color }} />
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            {chapter.name}
          </h3>

          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-5">
            {chapter.summary}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-black/25 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1 text-white/60 text-[10px] uppercase tracking-wide mb-1">
                <Clock className="w-3 h-3" /> Hours
              </div>
              <div className="text-white font-bold text-lg">{totalHours}</div>
            </div>
            <div className="bg-black/25 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1 text-white/60 text-[10px] uppercase tracking-wide mb-1">
                <Moon className="w-3 h-3" /> Late Night
              </div>
              <div className="text-white font-bold text-lg">{totalLateNight.toLocaleString()}</div>
            </div>
            <div className="bg-black/25 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-white/60 text-[10px] uppercase tracking-wide mb-1">Top Artist</div>
              <div className="text-white font-bold text-sm leading-tight">{chapter.topArtists[0]}</div>
            </div>
          </div>

          <div
            className="pl-4 py-2 mb-5 text-white/90 text-sm italic"
            style={{ borderLeft: `3px solid ${chapter.color}` }}
          >
            "{chapter.insight}"
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {chapter.topArtists.map((a) => (
              <span
                key={a}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/10"
              >
                {a}
              </span>
            ))}
          </div>

          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors duration-300"
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
              className="overflow-hidden"
            >
              <div className="px-6 md:px-8 pb-8 pt-2 bg-black/20">
                <h4 className="text-white/70 text-xs uppercase tracking-widest mb-3 font-semibold">
                  Key tracks
                </h4>
                <ul className="space-y-1.5 mb-6">
                  {chapter.keyTracks.map((t) => (
                    <li key={t} className="text-white/85 text-sm">
                      • {t}
                    </li>
                  ))}
                </ul>

                <h4 className="text-white/70 text-xs uppercase tracking-widest mb-3 font-semibold">
                  Hours by year
                </h4>
                <div className="h-40 -ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearsInChapter}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} width={36} />
                      <Tooltip
                        contentStyle={{ background: '#0D1117', border: '1px solid #1C2333', borderRadius: 8, color: '#F0F6FC' }}
                        cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                      />
                      <Bar dataKey="totalHours" fill={chapter.color} radius={[6, 6, 0, 0]} name="Hours" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function StoryView() {
  const [openId, setOpenId] = useState(null);
  const [hoverYear, setHoverYear] = useState(null);

  return (
    <div>
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">The Story</h2>
        <p className="text-secondary text-sm md:text-base">
          Five chapters. Eleven years. One decade told entirely through what someone chose to listen to,
          and when. Scroll through the story, or tap a chapter to go deeper.
        </p>
      </div>

      <div className="flex md:flex-row flex-col gap-6 md:gap-0 md:overflow-x-auto pb-6 md:snap-x md:snap-mandatory no-scrollbar items-stretch">
        {chapters.map((chapter, i) => (
          <div key={chapter.id} className="flex md:flex-row flex-col items-stretch">
            <ChapterCard
              chapter={chapter}
              isOpen={openId === chapter.id}
              onToggle={() => setOpenId(openId === chapter.id ? null : chapter.id)}
            />
            {i < chapters.length - 1 && (
              <div className="hidden md:flex flex-col items-center justify-center w-16 shrink-0 group relative">
                <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/30 to-white/10" />
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-card border border-border rounded-lg px-3 py-2 text-xs text-secondary w-48 -top-16 z-20 shadow-xl text-center pointer-events-none">
                  {turningPoints[i]}
                </div>
                <div className="w-2 h-2 rounded-full bg-white/40 -mt-1" />
              </div>
            )}
            {i < chapters.length - 1 && (
              <div className="md:hidden flex items-center justify-center py-1 text-secondary text-xs gap-2 px-4 text-center">
                <ArrowDown className="w-4 h-4 shrink-0" />
                <span>{turningPoints[i]}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-lg font-bold mb-1">The Full Timeline</h3>
        <p className="text-secondary text-sm mb-6">Every year, sized by how many hours were spent listening.</p>

        <div className="bg-card border border-border rounded-card p-6">
          <div className="flex items-end gap-1.5 md:gap-3 h-56">
            {yearlyStats.map((y) => {
              const chapter = chapterForYear(y.year);
              const heightPct = Math.max((y.totalHours / maxHours) * 100, 3);
              return (
                <div
                  key={y.year}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoverYear(y.year)}
                  onMouseLeave={() => setHoverYear(null)}
                >
                  {hoverYear === y.year && (
                    <div className="absolute bottom-full mb-2 z-30 bg-card border border-border rounded-lg p-3 w-44 shadow-2xl text-left">
                      <div className="font-bold text-sm mb-1">{y.year}</div>
                      <div className="text-xs text-secondary">Hours: <span className="text-primary font-medium">{y.totalHours}</span></div>
                      <div className="text-xs text-secondary">Top artist: <span className="text-primary font-medium">{y.topArtist}</span></div>
                      <div className="text-xs text-secondary">Late night: <span className="text-primary font-medium">{y.lateNightPlays.toLocaleString()}</span></div>
                      <div className="text-xs text-secondary">Chapter: <span style={{ color: chapter.color }} className="font-medium">{chapter.name}</span></div>
                    </div>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.7, delay: 0.03 * (y.year - 2013) }}
                    className="w-full rounded-t-md transition-opacity duration-300 group-hover:opacity-80"
                    style={{ backgroundColor: chapter.color, minHeight: 4 }}
                  />
                  <div className="text-[10px] md:text-xs text-secondary mt-2 -rotate-0">{String(y.year).slice(2)}</div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-6 justify-center border-t border-border pt-4">
            {chapters.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-xs text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
