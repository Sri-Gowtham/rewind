import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CalendarDays, Users, Activity, Headphones } from 'lucide-react';
import Theatre from './components/Theatre.jsx';
import StoryView from './components/StoryView.jsx';
import YearsView from './components/YearsView.jsx';
import ArtistsView from './components/ArtistsView.jsx';
import PatternsView from './components/PatternsView.jsx';

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
    <div className="min-h-screen bg-bg text-primary">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-bg/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Headphones className="w-5 h-5 text-amber" />
            <span className="font-bold text-lg tracking-tight hidden sm:inline">Echoes</span>
          </div>

          <nav className="flex items-center gap-1 bg-card border border-border rounded-full p-1 overflow-x-auto no-scrollbar">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                    active ? 'text-black' : 'text-secondary hover:text-primary'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-amber rounded-full"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden md:block text-xs text-secondary shrink-0">2013 — 2024</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
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

      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-secondary text-xs">
          Built from 149,860 real listening events. Every number here happened.
        </div>
      </footer>
    </div>
  );
}
