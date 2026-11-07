import React from 'react';

interface RangoliBackdropProps {
  isCelebrating: boolean;
}

export const RangoliBackdrop: React.FC<RangoliBackdropProps> = ({ isCelebrating }) => {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const innerPetals = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`relative transition-all duration-1000 ${
          isCelebrating
            ? 'w-[34rem] h-[34rem] sm:w-[44rem] sm:h-[44rem] opacity-[0.11] scale-105'
            : 'w-[28rem] h-[28rem] sm:w-[36rem] sm:h-[36rem] opacity-[0.14] scale-100'
        }`}
      >
        {/* Outer Clockwise Mandala */}
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full animate-mandala-slow"
        >
          <defs>
            <radialGradient id="mandalaGold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="65%" stopColor="#F5B041" />
              <stop offset="100%" stopColor="#E86F2C" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          <g
            transform="translate(200, 200)"
            fill="none"
            stroke="url(#mandalaGold)"
          >
            <circle r="185" strokeWidth="1" strokeDasharray="4 6" />
            <circle r="168" strokeWidth="1.2" />
            <circle r="130" strokeWidth="0.9" strokeDasharray="2 5" />
            <circle r="92" strokeWidth="1.2" />

            {petals.map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <path
                  d="M0,-92 C22,-125 22,-152 0,-168 C-22,-152 -22,-125 0,-92 Z"
                  strokeWidth="1.1"
                />
                <circle cx="0" cy="-176" r="2.2" fill="#F5B041" />
              </g>
            ))}
          </g>
        </svg>

        {/* Inner Counter-Clockwise Lotus Ring */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 w-full h-full animate-mandala-reverse"
        >
          <g
            transform="translate(200, 200)"
            fill="none"
            stroke="#FFE082"
            opacity="0.85"
          >
            {innerPetals.map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <path
                  d="M0,-28 C16,-52 16,-76 0,-92 C-16,-76 -16,-52 0,-28 Z"
                  strokeWidth="1"
                />
              </g>
            ))}
            <circle r="28" strokeWidth="1.2" />
            <circle r="10" strokeWidth="1.5" fill="#F5B041" fillOpacity="0.25" />
          </g>
        </svg>
      </div>
    </div>
  );
};
