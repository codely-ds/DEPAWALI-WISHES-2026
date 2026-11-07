import React, { useEffect, useState } from 'react';
import { festiveAudio } from '../utils/audioEngine';

interface GlowingDiyaProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  delay?: string;
  interactive?: boolean;
  className?: string;
  variant?: 'royal-brass' | 'terracotta' | 'crimson-gold';
}

export const GlowingDiya: React.FC<GlowingDiyaProps> = ({
  size = 'md',
  delay = '0s',
  interactive = true,
  className = '',
  variant = 'terracotta',
}) => {
  const [flaring, setFlaring] = useState(false);

  const dimensions = {
    sm: 'w-20 h-24',
    md: 'w-28 h-32',
    lg: 'w-36 h-40',
    hero: 'w-44 h-48',
  }[size];

  const handleDiyaClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    setFlaring(true);
    festiveAudio.playDiyaSpark();
    window.setTimeout(() => setFlaring(false), 700);
  };

  const uid = React.useId().replace(/:/g, '');

  const bowlColors =
    variant === 'royal-brass'
      ? { top: '#E59838', mid: '#A85B14', deep: '#4E2304' }
      : variant === 'crimson-gold'
      ? { top: '#C93B3B', mid: '#801B1E', deep: '#3B080A' }
      : { top: '#C85532', mid: '#8A3019', deep: '#421207' };

  return (
    <div
      onClick={handleDiyaClick}
      data-interactive="true"
      title={interactive ? 'Click to brighten Diya flame 🪔' : undefined}
      className={`relative flex flex-col items-center justify-end select-none ${dimensions} ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Warm Radial Candlelight Halo Behind Flame */}
      <div
        className={`absolute -top-3 w-24 h-24 rounded-full pointer-events-none animate-halo-breath transition-transform duration-500 ${
          flaring ? 'scale-150 opacity-100' : 'group-hover:scale-125'
        }`}
        style={{
          animationDelay: delay,
          background:
            'radial-gradient(circle, rgba(255,224,130,0.68) 0%, rgba(245,176,65,0.34) 42%, rgba(232,111,44,0.12) 70%, rgba(232,111,44,0) 100%)',
          filter: 'blur(6px)',
        }}
      />

      {/* SVG Ornate Diya & Multi-Layer Flickering Flame */}
      <svg
        viewBox="0 0 160 170"
        className="w-full h-full overflow-visible drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
      >
        <defs>
          {/* Outer Flame Gradient */}
          <linearGradient id={`flameOuter-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#F5B041" stopOpacity="0.98" />
            <stop offset="85%" stopColor="#E86F2C" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#D9383A" stopOpacity="0.7" />
          </linearGradient>

          {/* Inner Flame Gradient */}
          <linearGradient id={`flameInner-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="65%" stopColor="#FFF3C4" />
            <stop offset="100%" stopColor="#F5B041" />
          </linearGradient>

          {/* Terracotta / Brass Bowl Gradient */}
          <linearGradient id={`bowlGrad-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={bowlColors.top} />
            <stop offset="52%" stopColor={bowlColors.mid} />
            <stop offset="100%" stopColor={bowlColors.deep} />
          </linearGradient>

          {/* Metallic Gold Trim Gradient */}
          <linearGradient id={`goldTrim-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B7791F" />
            <stop offset="30%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#FFFDF9" />
            <stop offset="70%" stopColor="#F5B041" />
            <stop offset="100%" stopColor="#975A16" />
          </linearGradient>

          {/* Glowing Oil / Ghee Pool */}
          <radialGradient id={`oilPool-${uid}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFF3C4" />
            <stop offset="45%" stopColor="#F5B041" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#5C2006" />
          </radialGradient>
        </defs>

        {/* Surface Reflection Pool under Diya Base */}
        <ellipse
          cx="80"
          cy="156"
          rx={flaring ? '64' : '54'}
          ry="9"
          fill="rgba(245, 176, 65, 0.25)"
          className="transition-all duration-500"
        />

        {/* MULTI-LAYERED FLICKERING FLAME */}
        <g
          className="animate-flame-outer"
          style={{
            animationDelay: delay,
            transformOrigin: '80px 88px',
          }}
        >
          {/* Soft Outer Flame Glow */}
          <path
            d="M80 12 C63 40, 54 62, 63 80 C68 89, 92 89, 97 80 C106 62, 97 40, 80 12 Z"
            fill={`url(#flameOuter-${uid})`}
            opacity={flaring ? '1' : '0.92'}
            transform={flaring ? 'scale(1.18) translate(-12, -12)' : undefined}
          />

          {/* Middle Golden Core */}
          <g className="animate-flame-inner" style={{ animationDelay: delay }}>
            <path
              d="M80 26 C69 47, 63 64, 69 79 C73 86, 87 86, 91 79 C97 64, 91 47, 80 26 Z"
              fill={`url(#flameInner-${uid})`}
            />
            {/* White-Hot Inner Wick Heart */}
            <path
              d="M80 46 C74 58, 72 70, 75 80 C77 84, 83 84, 85 80 C88 70, 86 58, 80 46 Z"
              fill="#FFFDF9"
            />
            {/* Subtle Blue Oxygen Base at Wick Tip */}
            <ellipse
              cx="80"
              cy="83"
              rx="5.5"
              ry="3.5"
              fill="#60A5FA"
              opacity="0.55"
            />
          </g>

          {/* Tiny Rising Spark Motes */}
          <circle
            cx="75"
            cy="8"
            r={flaring ? '2.4' : '1.4'}
            fill="#FFFDF9"
            opacity="0.85"
          />
          <circle
            cx="86"
            cy="15"
            r={flaring ? '2' : '1.1'}
            fill="#FFE082"
            opacity="0.7"
          />
        </g>

        {/* Cotton Wick */}
        <path
          d="M80 82 Q80 91 78 96"
          stroke="#3E2723"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="80" cy="83" r="2.2" fill="#FF6B35" />

        {/* Ornate Diya Vessel Back Rim &Glowing Ghee Pool */}
        <ellipse
          cx="80"
          cy="98"
          rx="52"
          ry="14"
          fill={`url(#goldTrim-${uid})`}
        />
        <ellipse
          cx="80"
          cy="99"
          rx="47"
          ry="11"
          fill={`url(#oilPool-${uid})`}
        />

        {/* Diya Terracotta Sculpted Body */}
        <path
          d="M26 98 C28 134, 52 148, 80 148 C108 148, 132 134, 134 98 C118 110, 42 110, 26 98 Z"
          fill={`url(#bowlGrad-${uid})`}
          stroke={`url(#goldTrim-${uid})`}
          strokeWidth="2"
        />

        {/* Central Spout / Beak Lip */}
        <path
          d="M66 96 Q80 84 94 96 Q80 105 66 96 Z"
          fill={`url(#goldTrim-${uid})`}
        />

        {/* Traditional Carved Gold Band & Kundan Gems on Bowl */}
        <path
          d="M36 116 Q80 129 124 116"
          fill="none"
          stroke={`url(#goldTrim-${uid})`}
          strokeWidth="2.2"
          strokeDasharray="3 4"
        />
        <path
          d="M44 128 Q80 139 116 128"
          fill="none"
          stroke={`url(#goldTrim-${uid})`}
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* Decorative Jewel Dots along Bowl */}
        {[52, 66, 80, 94, 108].map((cx, i) => (
          <circle
            key={cx}
            cx={cx}
            cy={i === 2 ? 123 : i === 1 || i === 3 ? 121.5 : 119}
            r={i === 2 ? '3' : '2.1'}
            fill="#FFE082"
          />
        ))}

        {/* Pedestal Foot Base */}
        <path
          d="M56 146 L104 146 L112 154 C112 156, 48 156, 48 154 Z"
          fill={`url(#goldTrim-${uid})`}
        />
      </svg>
    </div>
  );
};

interface DiyaStageEnsembleProps {
  isCelebrating: boolean;
}

export const DiyaStageEnsemble: React.FC<DiyaStageEnsembleProps> = ({
  isCelebrating,
}) => {
  // Subtle wind lean effect responding to cursor horizontal position
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const normalized = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const deg = (normalized * 4.5).toFixed(2);
      document.documentElement.style.setProperty('--wind-lean', `${deg}deg`);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-end pointer-events-auto z-20 pb-2 sm:pb-4">
      {/* Golden Ambient Floor Horizon Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[92vw] max-w-4xl h-28 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: isCelebrating ? 0.95 : 0.55,
          background:
            'radial-gradient(ellipse 65% 80% at 50% 100%, rgba(245, 176, 65, 0.28) 0%, rgba(232, 111, 44, 0.11) 55%, transparent 100%)',
        }}
      />

      {/* Row of Glowing Diyas */}
      <div className="relative flex items-end justify-center gap-1 sm:gap-5 md:gap-8 px-3">
        {/* Far Left Small Diya (Desktop/Tablet) */}
        <div className="hidden md:block transform translate-y-2 opacity-90 hover:opacity-100 transition-opacity">
          <GlowingDiya
            size="sm"
            delay="0.7s"
            variant="crimson-gold"
          />
        </div>

        {/* Left Medium Diya */}
        <div className="transform translate-y-1">
          <GlowingDiya
            size="md"
            delay="0.35s"
            variant="terracotta"
          />
        </div>

        {/* Centerpiece Ceremonial Royal Brass Diya */}
        <div className="transform -translate-y-1 z-10">
          <GlowingDiya
            size={isCelebrating ? 'lg' : 'md'}
            delay="0s"
            variant="royal-brass"
          />
        </div>

        {/* Right Medium Diya */}
        <div className="transform translate-y-1">
          <GlowingDiya
            size="md"
            delay="1.1s"
            variant="terracotta"
          />
        </div>

        {/* Far Right Small Diya (Desktop/Tablet) */}
        <div className="hidden md:block transform translate-y-2 opacity-90 hover:opacity-100 transition-opacity">
          <GlowingDiya
            size="sm"
            delay="0.5s"
            variant="crimson-gold"
          />
        </div>
      </div>

      {/* Ornate Golden Rangoli Pedestal Border Line */}
      <div className="w-72 sm:w-[30rem] h-[2px] mt-1 bg-gradient-to-r from-transparent via-[#F5B041]/60 to-transparent rounded-full" />
    </div>
  );
};
