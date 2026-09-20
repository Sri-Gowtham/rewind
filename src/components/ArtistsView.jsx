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
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">The Artists</h2>
        <p className="text-secondary text-sm md:text-base max-w-2xl">
          Twelve names that shaped a decade. Some burned bright for a year, others never left.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
        {topArtistsAllTime.map((a, i) => (
          <motion.div
            key={a.artist}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-card border border-border rounded-card p-5 hover:border-amber/50 transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-secondary font-mono text-xs">#{i + 1}</span>
              <span className="text-xs text-secondary">{dominantYears[a.artist] || '—'}</span>
            </div>
            <h3 className="text-xl font-bold mb-1 leading-tight">{a.artist}</h3>
            <div className="text-2xl font-extrabold text-amber mb-3">{a.hoursPlayed.toLocaleString()}<span className="text-sm text-secondary font-normal"> hrs</span></div>
            <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(a.hoursPlayed / maxHours) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-amber to-orange-500"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-14">
        <h3 className="text-lg font-bold mb-1">Artist Eras</h3>
        <p className="text-secondary text-sm mb-6">
          The three artists who defined the decade — and exactly when each one took over.
        </p>
        <div className="bg-card border border-border rounded-card p-4 md:p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={eraData}>
                <defs>
                  <linearGradient id="beatlesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="killersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mayerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2333" vertical={false} />
                <XAxis dataKey="year" stroke="#8B949E" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B949E" fontSize={12} tickLine={false} axisLine={false} width={36} />
                <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid #1C2333', borderRadius: 8 }} labelStyle={{ color: '#F0F6FC' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#8B949E' }} />
                <Area type="monotone" dataKey="Beatles" name="The Beatles" stroke="#6366f1" fill="url(#beatlesGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Killers" name="The Killers" stroke="#8b5cf6" fill="url(#killersGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Mayer" name="John Mayer" stroke="#f59e0b" fill="url(#mayerGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber" /> Did You Know?</h3>
        <div className="relative bg-card border border-border rounded-card p-8 min-h-[140px] flex items-center">
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
