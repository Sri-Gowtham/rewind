/**
 * App — root shell for Rewind.
 * Gates the experience behind the Theatre intro, then renders the sticky
 * nav and routes between the four views (Story, Years, Artists, Patterns).
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CalendarDays, Users, Activity, CassetteTape } from 'lucide-react';
import Theatre from './components/Theatre.jsx';
import StoryView from './components/StoryView.jsx';
import YearsView from './components/YearsView.jsx';
import ArtistsView from './components/ArtistsView.jsx';
import PatternsView from './components/PatternsView.jsx';
import Waveform from './components/Waveform.jsx';
import { playClick } from './utils/sound.js';

const NAV = [
  { id: 'story', label: 'Story', icon: BookOpen },
  { id: 'years', label: 'Years', icon: CalendarDays },
  { id: 'artists', label: 'Artists', icon: Users },
  { id: 'patterns', label: 'Patterns', icon: Activity },
];

export default function App() {
  const [began, setBegan] = useState(false);
  const [view, setView] = useState('story');

  if (!began) {
    return <Theatre onBegin={() => setBegan(true)} />;
  }

  return (
    <div
      className="relative min-h-screen text-primary overflow-x-hidden"
      style={{ background: 'radial-gradient(ellipse 1200px 800px at 50% -10%, #3A2418 0%, #1B1410 55%)' }}
    >
      <div className="grain" />
      <div className="fixed inset-x-0 bottom-0 h-40 pointer-events-none z-0 px-2">
        <Waveform bars={64} opacity={0.1} className="h-full" />
      </div>

      <header className="relative z-40 sticky top-0 bg-bg/95 border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <CassetteTape className="w-5 h-5 text-warm1" />
            <span className="font-mono font-bold text-base tracking-[0.15em] uppercase hidden sm:inline">Rewind</span>
          </div>

          <nav className="flex items-center gap-1 bg-card border-2 border-border p-1 overflow-x-auto no-scrollbar">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { playClick(); setView(item.id); }}
                  className={`relative flex items-center gap-1.5 px-3 md:px-4 py-2 text-sm font-medium font-mono transition-colors duration-300 whitespace-nowrap ${
                    active ? 'text-bg' : 'text-secondary hover:text-warm3'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-warm1"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden md:block text-xs text-muted font-mono shrink-0">2013 → 2024</div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {view === 'story' && <StoryView />}
            {view === 'years' && <YearsView />}
            {view === 'artists' && <ArtistsView />}
            {view === 'patterns' && <PatternsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t-2 border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-muted text-xs font-mono tracking-wide">
          BUILT FROM 149,860 REAL LISTENING EVENTS — EVERY NUMBER HERE HAPPENED
        </div>
      </footer>
    </div>
  );
}
