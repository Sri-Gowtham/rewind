import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, ReferenceDot,
} from 'recharts';
import { Moon, Smartphone, Repeat, Hourglass, SkipForward } from 'lucide-react';
import { hourlyPattern, yearlyStats } from '../data/spotifyStory.js';

const hourData = hourlyPattern.map((v, h) => ({
  hour: h,
  label: h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`,
  value: v,
  zone: (h >= 0 && h <= 4) ? 'night' : (h >= 17 && h <= 21) ? 'evening' : 'normal',
}));

const nightPeakHour = hourData.reduce((max, d) => (d.zone === 'night' && d.value > max.value ? d : max), hourData[0]);
const eveningPeakHour = hourData.reduce((max, d) => (d.zone === 'evening' && d.value > max.value ? d : max), hourData[0]);

function CustomHourTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
      <div className="font-bold text-sm">{d.label}</div>
      <div className="text-xs text-secondary">{d.value.toLocaleString()}M ms played</div>
    </div>
  );
}

export default function PatternsView() {
  const circles = useMemo(() => {
    const arr = Array.from({ length: 100 }, (_, i) => ({ id: i, skipped: i < 5 }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(((i * 9301 + 49297) % 233280) / 233280 * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const peakYear2017 = yearlyStats.find((y) => y.year === 2017);
  const peakYear2021 = yearlyStats.find((y) => y.year === 2021);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 tracking-tight">The Patterns</h2>
        <p className="text-secondary text-sm md:text-base max-w-2xl">
          Behind the songs are habits — when, how, and how faithfully this person listened.
        </p>
      </div>

      <div className="bg-card border border-border rounded-card p-4 md:p-6 mb-8">
        <h3 className="text-lg font-bold mb-1">When does the music play?</h3>
        <p className="text-secondary text-sm mb-6">Total listening time by hour of day, across all 11 years.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourData}>
              <defs>
                <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8682A" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#E8682A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A4A5A" vertical={false} />
              <XAxis dataKey="label" stroke="#6B8FA0" fontSize={11} tickLine={false} axisLine={false} interval={1} />
              <YAxis stroke="#6B8FA0" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<CustomHourTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#E8682A" fill="url(#hourGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-cool2" />
            <span className="text-secondary">Late-night peak: <span className="text-primary font-medium">{nightPeakHour.label}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-amber inline-block" />
            <span className="text-secondary">Evening peak: <span className="text-primary font-medium">{eveningPeakHour.label}</span></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2"><SkipForward className="w-4 h-4 text-amber" /> The Skip Story</h3>
          <p className="text-secondary text-sm mb-5">Only <span className="text-primary font-semibold">5.2%</span> of songs were ever skipped.</p>
          <div className="grid grid-cols-10 gap-1.5 mb-5">
            {circles.map((c) => (
              <motion.span
                key={c.id}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: c.id * 0.005 }}
                className={`aspect-square rounded-full ${c.skipped ? 'bg-warm1' : 'bg-cool1'} opacity-90`}
              />
            ))}
          </div>
          <p className="text-sm text-secondary italic">This is someone who commits.</p>
        </div>

        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2"><Smartphone className="w-4 h-4 text-amber" /> Platform Evolution</h3>
          <p className="text-secondary text-sm mb-5">Started on web browser in 2013. Moved to Android — and never really left.</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-secondary mb-1"><span>Android</span><span>93%</span></div>
              <div className="w-full h-4 bg-bg rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: '93%' }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-cool1 to-cool2 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-secondary mb-1"><span>Web Browser</span><span>5%</span></div>
              <div className="w-full h-4 bg-bg rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} viewport={{ once: true }} whileInView={{ width: '5%' }} transition={{ duration: 1, delay: 0.1 }} className="h-full bg-gradient-to-r from-warm2 to-warm3 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-secondary mb-1"><span>Other / Desktop</span><span>2%</span></div>
              <div className="w-full h-4 bg-bg rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: '2%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-muted rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-card p-4 md:p-6 mb-8">
        <h3 className="text-lg font-bold mb-1 flex items-center gap-2"><Repeat className="w-4 h-4 text-amber" /> The Late Night Index</h3>
        <p className="text-secondary text-sm mb-6">Late-night plays (10PM – 4AM) per year. Two moments stand out.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A4A5A" vertical={false} />
              <XAxis dataKey="year" stroke="#6B8FA0" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B8FA0" fontSize={12} tickLine={false} axisLine={false} width={50} />
              <Tooltip contentStyle={{ background: '#1B3A4B', border: '1px solid #2A4A5A', borderRadius: 8 }} labelStyle={{ color: '#F2EDD8' }} formatter={(v) => v.toLocaleString()} />
              <Line type="monotone" dataKey="lateNightPlays" stroke="#4A9BAF" strokeWidth={2.5} dot={{ r: 3, fill: '#4A9BAF' }} name="Late Night Plays" />
              <ReferenceDot x={2017} y={peakYear2017.lateNightPlays} r={6} fill="#E8682A" stroke="#F2EDD8" strokeWidth={1} />
              <ReferenceDot x={2021} y={peakYear2021.lateNightPlays} r={6} fill="#7EC8D4" stroke="#F2EDD8" strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-6 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-warm1 inline-block" />
            <span className="text-secondary">2017: <span className="text-primary font-medium">8,948</span> — someone wasn't sleeping</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cool2 inline-block" />
            <span className="text-secondary">2021: <span className="text-primary font-medium">9,529</span> — the all-time peak</span>
          </div>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-card border border-border p-8 md:p-12 text-center"
        style={{ background: 'linear-gradient(160deg, rgba(232,104,42,0.18) 0%, #1B3A4B 55%, #1B3A4B 100%)' }}
      >
        <Hourglass className="w-8 h-8 text-amber mx-auto mb-4" />
        <p className="text-secondary text-sm uppercase tracking-widest mb-3">Total Listening Time</p>
        <p className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-3">
          5,838 <span className="text-amber">hours</span>
        </p>
        <p className="text-secondary text-base md:text-lg max-w-xl mx-auto">
          If you played every song back to back, it would take <span className="text-primary font-semibold">243 days</span> of
          continuous, unbroken music. Eight months of a life, spent listening.
        </p>
      </div>
    </div>
  );
}
