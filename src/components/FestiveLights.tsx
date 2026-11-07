import React from 'react';

interface FestiveLightsProps {
  intense?: boolean;
}

export const FestiveLights: React.FC<FestiveLightsProps> = ({ intense = false }) => {
  // Vertical hanging strings of golden Diwali fairy lights across the top edge
  const strands = [
    { left: '4%', height: 110, bulbs: 4, delay: '0s' },
    { left: '11%', height: 75, bulbs: 3, delay: '0.4s' },
    { left: '19%', height: 130, bulbs: 5, delay: '0.9s' },
    { left: '28%', height: 85, bulbs: 3, delay: '0.2s' },
    { left: '37%', height: 65, bulbs: 2, delay: '1.1s' },
    { left: '50%', height: 55, bulbs: 2, delay: '0.6s' },
    { left: '63%', height: 65, bulbs: 2, delay: '0.3s' },
    { left: '72%', height: 85, bulbs: 3, delay: '1.3s' },
    { left: '81%', height: 130, bulbs: 5, delay: '0.7s' },
    { left: '89%', height: 75, bulbs: 3, delay: '0.15s' },
    { left: '96%', height: 110, bulbs: 4, delay: '0.85s' },
  ];

  return (
    <div
      className="fixed top-0 left-0 right-0 pointer-events-none z-10 overflow-hidden h-44"
      aria-hidden="true"
    >
      {/* Top Warm Ambient Golden Glow Wash */}
      <div
        className="w-full h-24 transition-opacity duration-1000"
        style={{
          opacity: intense ? 0.95 : 0.65,
          background:
            'radial-gradient(ellipse 80% 100% at 50% -20%, rgba(245, 176, 65, 0.25) 0%, rgba(232, 111, 44, 0.08) 55%, transparent 100%)',
        }}
      />

      {/* Draped Catenary Swag Garlands (SVG) */}
      <svg
        className="absolute top-0 left-0 w-full h-28 opacity-85"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="goldWire" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(245, 176, 65, 0.2)" />
            <stop offset="50%" stopColor="rgba(255, 224, 130, 0.65)" />
            <stop offset="100%" stopColor="rgba(245, 176, 65, 0.2)" />
          </linearGradient>
          <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDF9" stopOpacity="1" />
            <stop offset="40%" stopColor="#FFE082" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#E86F2C" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E86F2C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Draped golden wire swags */}
        <path
          d="M0,2 Q180,68 360,4 T720,6 T1080,4 T1440,2"
          fill="none"
          stroke="url(#goldWire)"
          strokeWidth="1.5"
        />
        <path
          d="M-60,0 Q120,92 300,12 T660,16 T1020,12 T1380,10 T1500,2"
          fill="none"
          stroke="url(#goldWire)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Swag Curve Bulbs */}
        {[90, 180, 270, 450, 540, 630, 810, 900, 990, 1170, 1260, 1350].map(
          (cx, idx) => {
            const cy = idx % 3 === 1 ? 35 : 22;
            return (
              <g
                key={cx}
                className="animate-bulb-twinkle"
                style={{ animationDelay: `${(idx * 0.27) % 2.2}s` }}
              >
                <circle cx={cx} cy={cy} r={intense ? 12 : 9} fill="url(#bulbGlow)" />
                <circle cx={cx} cy={cy} r="2.8" fill="#FFFDF9" />
              </g>
            );
          }
        )}
      </svg>

      {/* Vertical Hanging Fairy Light Drops */}
      <div className="relative w-full h-full">
        {strands.map((strand, sIdx) => (
          <div
            key={sIdx}
            className="absolute top-0 flex flex-col items-center"
            style={{
              left: strand.left,
              height: `${strand.height}px`,
            }}
          >
            {/* Delicate Golden Thread */}
            <div className="w-[1px] h-full bg-gradient-to-b from-[#F5B041]/55 via-[#F5B041]/30 to-transparent" />

            {/* Glowing Bulbs along the thread */}
            {Array.from({ length: strand.bulbs }).map((_, bIdx) => {
              const topPct = ((bIdx + 1) / strand.bulbs) * 92;
              const delaySec =
                (parseFloat(strand.delay) + bIdx * 0.35).toFixed(2) + 's';
              return (
                <div
                  key={bIdx}
                  className="absolute -translate-x-1/2 left-1/2 animate-bulb-twinkle rounded-full"
                  style={{
                    top: `${topPct}%`,
                    animationDelay: delaySec,
                  }}
                >
                  <div
                    className={`rounded-full bg-[#FFFDF9] ${
                      bIdx === strand.bulbs - 1 ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'
                    }`}
                    style={{
                      boxShadow: intense
                        ? '0 0 8px 3px rgba(255, 224, 130, 0.95), 0 0 20px 6px rgba(232, 111, 44, 0.65)'
                        : '0 0 6px 2px rgba(255, 224, 130, 0.8), 0 0 14px 4px rgba(245, 176, 65, 0.45)',
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
