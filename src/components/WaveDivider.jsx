export default function WaveDivider({ flip = false, className = '', height = 64, id }) {
  const gradId = `wave-grad-${id || Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8682A" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#F0A050" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4A9BAF" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path
          d="M0,40 C150,90 350,0 600,45 C850,90 1050,10 1200,50 L1200,120 L0,120 Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M0,60 C200,100 400,20 650,60 C900,100 1050,40 1200,70 L1200,120 L0,120 Z"
          fill="#1B3A4B"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
