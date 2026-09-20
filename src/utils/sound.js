let ctx;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function tone({ type, from, to, duration, gain }) {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(from, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(to, c.currentTime + duration);
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + duration);
  } catch {
    // audio unsupported or blocked before first user gesture — fail silently
  }
}

// Light plastic click, for nav taps and small UI toggles
export function playClick() {
  tone({ type: 'square', from: 220, to: 90, duration: 0.08, gain: 0.06 });
}

// Heavier cassette-button thunk, for opening/closing a chapter or pressing play
export function playThunk() {
  tone({ type: 'sine', from: 150, to: 45, duration: 0.16, gain: 0.1 });
}
