export function shade(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

function luminance(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// Returns a lightened version of the color when it's too dark to read
// against the card surface it will sit on (used for the "Long Night"
// chapter, whose brand color is intentionally the same dark teal as the card).
export function accentColor(hex, threshold = 0.3, boost = 45) {
  return luminance(hex) < threshold ? shade(hex, boost) : hex;
}
