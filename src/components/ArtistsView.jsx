import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { topArtistsAllTime, globalInsights } from '../data/spotifyStory.js';

const eraData = [
  { year: 2013, Beatles: 5, Killers: 0, Mayer: 60 },
  { year: 2014, Beatles: 2, Killers: 0, Mayer: 10 },
  { year: 2015, Beatles: 20, Killers: 5, Mayer: 15 },
  { year: 2016, Beatles: 70, Killers: 10, Mayer: 20 },
  { year: 2017, Beatles: 95, Killers: 25, Mayer: 35 },
  { year: 2018, Beatles: 80, Killers: 20, Mayer: 30 },
  { year: 2019, Beatles: 75, Killers: 25, Mayer: 25 },
  { year: 2020, Beatles: 40, Killers: 85, Mayer: 20 },
  { year: 2021, Beatles: 35, Killers: 90, Mayer: 15 },
  { year: 2022, Beatles: 20, Killers: 55, Mayer: 15 },
  { year: 2023, Beatles: 15, Killers: 70, Mayer: 20 },
  { year: 2024, Beatles: 15, Killers: 40, Mayer: 65 },
];

const dominantYears = {
  'The Beatles': '2016 – 2019',
  'The Killers': '2020 – 2023',
  'John Mayer': '2013, 2024',
  'Bob Dylan': '2017 – 2019',
  'Paul McCartney': '2017 – 2018',
  'Howard Shore': '2020 – 2021',
  'The Strokes': '2020 – 2021',
  'The Rolling Stones': '2015 – 2016',
  'Pink Floyd': '2022 – 2023',
  'Led Zeppelin': '2019 – 2020',
  'Imagine Dragons': '2016 – 2017',
  'Johnny Cash': '2018 – 2019',
};

const maxHours = topArtistsAllTime[0].hoursPlayed;

export default function ArtistsView() {
  const [insightIdx, setInsightIdx] = useState(0);
  const insights = globalInsights.slice(0, 5);

  useEffect(() => {
    const t = setInterval(() => setInsightIdx((i) => (i + 1) % insights.length), 4000);
    return () => clearInterval(t);
  }, [insights.length]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 tracking-tight">The Artists</h2>
        <p className="text-secondary text-sm md:text-base max-w-2xl">
          Twelve names that shaped a decade. Some burned bright for a year, others never left.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
        {topArtistsAllTime.map((a, i) => {
          const segments = 16;
          const lit = Math.max(1, Math.round((a.hoursPlayed / maxHours) * segments));
          return (
            <motion.div
              key={a.artist}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="ticket-hover bg-card border-2 border-border p-5"
              style={{ '--accent': '#C1502E' }}
            >
              <div className="flex items-start justify-between mb-3 font-mono">
                <span className="text-secondary text-xs">#{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs text-muted">{dominantYears[a.artist] || '—'}</span>
              </div>
              <h3 className="font-serif text-xl font-bold mb-1 leading-tight">{a.artist}</h3>
              <div className="font-mono text-2xl font-bold text-warm1 mb-3">{a.hoursPlayed.toLocaleString()}<span className="text-sm text-secondary font-normal"> hrs</span></div>
              <div className="flex gap-[3px]">
                {Array.from({ length: segments }).map((_, s) => (
                  <motion.span
                    key={s}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: i * 0.03 + s * 0.015 }}
                    className="h-2.5 flex-1"
                    style={{ background: s < lit ? '#C1502E' : '#4A3B2E' }}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mb-14">
        <h3 className="font-serif text-lg font-bold mb-1">Artist Eras</h3>
        <p className="text-secondary text-sm mb-6">
          The three artists who defined the decade — and exactly when each one took over.
        </p>
        <div className="bg-card border-2 border-border p-4 md:p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={eraData}>
                <defs>
                  <linearGradient id="beatlesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C1502E" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#C1502E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="killersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6FA8A6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6FA8A6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mayerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8C468" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#E8C468" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A3B2E" vertical={false} />
                <XAxis dataKey="year" stroke="#8A7860" fontSize={12} tickLine={false} axisLine={false} fontFamily="Space Mono" />
                <YAxis stroke="#8A7860" fontSize={12} tickLine={false} axisLine={false} width={36} fontFamily="Space Mono" />
                <Tooltip contentStyle={{ background: '#2A2019', border: '2px solid #4A3B2E' }} labelStyle={{ color: '#F3E9D2' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#C9A876', fontFamily: 'Space Mono' }} />
                <Area type="monotone" dataKey="Beatles" name="The Beatles" stroke="#C1502E" fill="url(#beatlesGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Killers" name="The Killers" stroke="#6FA8A6" fill="url(#killersGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Mayer" name="John Mayer" stroke="#E8C468" fill="url(#mayerGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-warm1" /> Did You Know?</h3>
        <div className="relative bg-card border-2 border-border p-8 min-h-[140px] flex items-center">
          <button
            onClick={() => setInsightIdx((i) => (i - 1 + insights.length) % insights.length)}
            className="absolute left-3 p-2 rounded-full hover:bg-white/5 text-secondary transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <AnimatePresence mode="wait">
            <motion.p
              key={insightIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="text-lg md:text-xl font-medium text-center px-10 mx-auto max-w-2xl"
            >
              {insights[insightIdx]}
            </motion.p>
          </AnimatePresence>
          <button
            onClick={() => setInsightIdx((i) => (i + 1) % insights.length)}
            className="absolute right-3 p-2 rounded-full hover:bg-white/5 text-secondary transition-colors duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-center gap-1.5 mt-4">
          {insights.map((_, i) => (
            <button
              key={i}
              onClick={() => setInsightIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === insightIdx ? 'w-6 bg-amber' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
