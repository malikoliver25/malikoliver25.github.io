export default function NovaEmblem({ size = 56 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      className="nova-emblem select-none"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible">
        {/* shadow */}
        <ellipse cx="50" cy="88" rx="22" ry="6" fill="black" opacity="0.18" />
        {/* body bob group */}
        <g className="nova-bob">
          {/* clock body */}
          <rect x="12" y="14" width="76" height="76" rx="28" fill="#FFE81A" stroke="#0E131A" strokeWidth="3" />
          {/* inner face */}
          <rect x="18" y="20" width="64" height="58" rx="18" fill="white" stroke="#0E131A" strokeWidth="2.5" />
          {/* ticks like TVA */}
          <g stroke="#0E131A" strokeWidth="2" strokeLinecap="round" opacity="0.9">
            <path d="M50 28 v8" />
            <path d="M50 70 v8" />
            <path d="M26 49 h8" />
            <path d="M66 49 h8" />
          </g>
          {/* eyes */}
          <g className="nova-eyes">
            <ellipse cx="36" cy="44" rx="8.5" ry="10" fill="#0E131A" />
            <ellipse cx="64" cy="44" rx="8.5" ry="10" fill="#0E131A" />
            <circle cx="38.5" cy="41" r="2.6" fill="white" opacity="0.95" />
            <circle cx="66.5" cy="41" r="2.6" fill="white" opacity="0.95" />
            <circle cx="34.2" cy="47.5" r="1.2" fill="white" opacity="0.7" />
            <circle cx="62.2" cy="47.5" r="1.2" fill="white" opacity="0.7" />
          </g>
          {/* big smile — TVA Miss Minutes style */}
          <path
            d="M 28 60 Q 50 82 72 60"
            fill="none"
            stroke="#0E131A"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* smile inner */}
          <path d="M 30.5 62 Q 50 79 69.5 62 Q 50 74 30.5 62" fill="#0E131A" />
          {/* tongue hint */}
          <ellipse cx="50" cy="68" rx="7" ry="3.5" fill="#FF6B8A" opacity="0.95" />
          {/* blush */}
          <ellipse cx="22" cy="56" rx="5" ry="2.8" fill="#FF8FA1" opacity="0.85" />
          <ellipse cx="78" cy="56" rx="5" ry="2.8" fill="#FF8FA1" opacity="0.85" />
          {/* little hands waving */}
          <g className="nova-hand">
            <ellipse cx="10" cy="54" rx="6" ry="8" fill="white" stroke="#0E131A" strokeWidth="2.2" />
            <ellipse cx="90" cy="50" rx="6" ry="8" fill="white" stroke="#0E131A" strokeWidth="2.2" />
          </g>
        </g>
      </svg>
      <style>{`
        .nova-bob { animation: novaBob 2s ease-in-out infinite; transform-origin: 50% 50%; }
        .nova-hand { animation: novaWave 1.6s ease-in-out infinite; transform-origin: 90px 50px; }
        @keyframes novaBob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes novaWave { 0%,100% { transform: rotate(-6deg) } 50% { transform: rotate(10deg) } }
        @media (prefers-reduced-motion: reduce) { .nova-bob, .nova-hand { animation: none !important; } }
      `}</style>
    </div>
  );
}
