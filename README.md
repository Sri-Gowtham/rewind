# Rewind

> Some people write diaries. You made playlists.

A cinematic frontend experience that transforms 11 years of real
Spotify listening data into an emotional narrative — built for WebRush 2026.

## Live Demo
[https://rewind-lilac.vercel.app/](https://rewind-lilac.vercel.app/)

## Tech Stack
React · Vite · Tailwind CSS · Framer Motion · Recharts

## The Story
149,860 songs. 11 years. 4,113 artists.
Not a dashboard. Not a timeline. A story.

## Getting Started
```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Project Structure
```
src/
  data/spotifyStory.js   # all listening data, embedded (no backend/API)
  components/
    Theatre.jsx           # cinematic intro sequence
    StoryView.jsx          # 5-chapter narrative + detail modal
    YearsView.jsx           # year-by-year explorer
    ArtistsView.jsx          # top artists + era chart
    PatternsView.jsx          # listening habits and patterns
    EqBars.jsx                 # custom equalizer-style chart bars
    Waveform.jsx                 # animated background waveform
  utils/
    color.js                     # chapter accent color contrast helper
    sound.js                      # synthesized UI click/thunk sounds
  App.jsx                          # nav shell + view routing
```

## Features
- Cinematic intro, then 4 explorable views: Story, Years, Artists, Patterns
- Click-to-open chapter detail modals with per-year mini charts
- Custom equalizer-style bar visualizations (no generic chart-library bars)
- Synthesized UI sound via Web Audio API — no audio files
- Fully responsive, dark retro "mixtape liner notes" aesthetic
- 100% frontend — all data embedded, zero backend or external API calls

## Data
Real personal Spotify listening history (2013–2024), pre-aggregated into
yearly stats, top tracks/artists, and hourly patterns, and embedded
directly as a JS module — no runtime fetch, no database.
