import React, { useEffect, useRef } from 'react';
import { ExplosionType, festiveAudio } from '../utils/audioEngine';

interface FireworksCanvasProps {
  isCelebrating: boolean;
  finaleTrigger: number;
  sparklerEnabled?: boolean;
}

interface BokehOrb {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  vx: number;
  vy: number;
  color: string;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  secondaryColor: string;
  trail: { x: number; y: number; alpha: number }[];
  type: ExplosionType;
}

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  prevX: number;
  prevY: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  drag: number;
  size: number;
  twinkle: boolean;
  hasSecondaryCrackle: boolean;
}

const FESTIVE_PALETTES: { primary: string; secondary: string; type: ExplosionType }[] = [
  { primary: '#FFE082', secondary: '#F5B041', type: 'willow' }, // Pure Gold Leaf Willow
  { primary: '#F5B041', secondary: '#E86F2C', type: 'peony' }, // Saffron & Marigold
  { primary: '#FF5E62', secondary: '#FFE082', type: 'crackle' }, // Kumkum Ruby & Gold
  { primary: '#38A1FF', secondary: '#FFE082', type: 'ring' }, // Rare Celestial Blue & Gold
  { primary: '#A55EEA', secondary: '#FF9FF3', type: 'peony' }, // Royal Amethyst & Rose Gold
  { primary: '#FFFDF9', secondary: '#F5B041', type: 'crackle' }, // White-Hot Diamond & Brass
  { primary: '#2ECC71', secondary: '#FFE082', type: 'ring' }, // Festive Emerald & Gold
];

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({
  isCelebrating,
  finaleTrigger,
  sparklerEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isCelebratingRef = useRef(isCelebrating);
  const sparklerEnabledRef = useRef(sparklerEnabled);
  const launchSalvoRef = useRef<((count: number) => void) | null>(null);

  useEffect(() => {
    isCelebratingRef.current = isCelebrating;
  }, [isCelebrating]);

  useEffect(() => {
    sparklerEnabledRef.current = sparklerEnabled;
  }, [sparklerEnabled]);

  useEffect(() => {
    if (finaleTrigger > 0 && launchSalvoRef.current) {
      launchSalvoRef.current(7);
    }
  }, [finaleTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Initialize Golden Defocused Bokeh Orbs
    const bokehColors = [
      'rgba(245, 176, 65, ',
      'rgba(232, 111, 44, ',
      'rgba(255, 224, 130, ',
      'rgba(217, 56, 58, ',
    ];
    const bokehOrbs: BokehOrb[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 2 + Math.random() * 24,
      alpha: 0.04 + Math.random() * 0.16,
      targetAlpha: 0.05 + Math.random() * 0.2,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.12 - Math.random() * 0.32,
      color: bokehColors[Math.floor(Math.random() * bokehColors.length)],
    }));

    const rockets: Rocket[] = [];
    const particles: FireworkParticle[] = [];

    // Helper to spawn a rocket
    const spawnRocket = (targetX?: number, targetY?: number) => {
      const palette =
        FESTIVE_PALETTES[Math.floor(Math.random() * FESTIVE_PALETTES.length)];

      // Favor framing the left/right sky slightly so center greeting remains super crisp,
      // while still allowing full-sky variety
      let destX: number;
      if (targetX !== undefined) {
        destX = targetX;
      } else {
        const zone = Math.random();
        if (zone < 0.4) {
          destX = width * (0.08 + Math.random() * 0.28);
        } else if (zone < 0.8) {
          destX = width * (0.64 + Math.random() * 0.28);
        } else {
          destX = width * (0.32 + Math.random() * 0.36);
        }
      }

      const startX = destX + (Math.random() - 0.5) * 110;
      const startY = height - 40;
      const destY =
        targetY !== undefined
          ? Math.max(70, Math.min(height * 0.65, targetY))
          : height * (0.12 + Math.random() * 0.36);

      const distanceY = startY - destY;
      const speed = 10.5 + Math.random() * 3.5;
      const flightFrames = Math.max(25, distanceY / (speed * 0.72));
      const vx = (destX - startX) / flightFrames;
      const vy = -speed;

      rockets.push({
        x: startX,
        y: startY,
        vx,
        vy,
        targetY: destY,
        color: palette.primary,
        secondaryColor: palette.secondary,
        trail: [],
        type: palette.type,
      });

      const pan = (destX / width) * 2 - 1;
      festiveAudio.playRocketLaunch(pan);
    };

    // Helper to explode a rocket into particles
    const explodeRocket = (rocket: Rocket) => {
      const pan = (rocket.x / width) * 2 - 1;
      festiveAudio.playExplosion(0.75 + Math.random() * 0.25, rocket.type, pan);

      const isMobile = width < 640;
      const baseCount =
        rocket.type === 'willow'
          ? isMobile
            ? 75
            : 115
          : rocket.type === 'ring'
          ? isMobile
            ? 64
            : 90
          : isMobile
          ? 70
          : 105;

      // Bright core flash particles
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.2;
        particles.push({
          x: rocket.x,
          y: rocket.y,
          prevX: rocket.x,
          prevY: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: '#FFFDF9',
          alpha: 1,
          decay: 0.045 + Math.random() * 0.03,
          gravity: 0.02,
          drag: 0.95,
          size: 2.6,
          twinkle: false,
          hasSecondaryCrackle: false,
        });
      }

      for (let i = 0; i < baseCount; i++) {
        let angle: number;
        let speed: number;

        if (rocket.type === 'ring') {
          angle = (i / baseCount) * Math.PI * 2;
          const isInnerRing = i % 2 === 0;
          speed = isInnerRing ? 3.4 : 5.8 + (Math.random() - 0.5) * 0.35;
        } else {
          angle = Math.random() * Math.PI * 2;
          // Spherical distribution projection
          const cosSpread = Math.cos(Math.random() * (Math.PI / 2));
          speed = (1.5 + Math.random() * 6.2) * cosSpread + 0.8;
        }

        const usePrimary =
          rocket.type === 'ring' ? i % 2 === 0 : Math.random() > 0.35;
        const color = usePrimary ? rocket.color : rocket.secondaryColor;

        const isWillow = rocket.type === 'willow';
        particles.push({
          x: rocket.x,
          y: rocket.y,
          prevX: rocket.x,
          prevY: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          decay: isWillow
            ? 0.0065 + Math.random() * 0.006
            : 0.011 + Math.random() * 0.01,
          gravity: isWillow ? 0.042 : 0.058,
          drag: isWillow ? 0.985 : 0.98,
          size: isWillow ? 1.8 : 1.7 + Math.random() * 1.1,
          twinkle: Math.random() > 0.45,
          hasSecondaryCrackle: rocket.type === 'crackle' && Math.random() < 0.22,
        });
      }
    };

    // Launch multiple rockets in a festive salvo
    const launchSalvo = (count: number) => {
      for (let i = 0; i < count; i++) {
        window.setTimeout(() => {
          const xPos = width * (0.12 + (i / Math.max(1, count - 1)) * 0.76);
          const yPos = height * (0.14 + Math.random() * 0.25);
          spawnRocket(xPos + (Math.random() - 0.5) * 50, yPos);
        }, i * 150);
      }
    };

    launchSalvoRef.current = launchSalvo;

    // Interactive sparkler particles on pointer move
    const spawnSparklerBurst = (x: number, y: number, count = 4) => {
      if (!sparklerEnabledRef.current) return;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 2.8;
        particles.push({
          x,
          y,
          prevX: x,
          prevY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.35 ? '#FFE082' : '#E86F2C',
          alpha: 0.95,
          decay: 0.032 + Math.random() * 0.025,
          gravity: 0.04,
          drag: 0.96,
          size: 1.3 + Math.random() * 0.9,
          twinkle: true,
          hasSecondaryCrackle: false,
        });
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      spawnSparklerBurst(e.clientX, e.clientY, isCelebratingRef.current ? 4 : 2);
    };

    const handleCanvasClick = (e: MouseEvent) => {
      if (!isCelebratingRef.current) return;
      // Ignore clicks on interactive controls/buttons
      const target = e.target as HTMLElement;
      if (target && target.closest('button, input, a, [data-interactive="true"]')) {
        return;
      }
      spawnRocket(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleCanvasClick);

    let lastLaunchTime = 0;
    let celebratedInitialized = false;

    const render = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(render);

      // Semi-transparent clear for glowing particle motion trails
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = isCelebratingRef.current
        ? 'rgba(7, 5, 10, 0.20)'
        : 'rgba(7, 5, 10, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Subtle warm radial ambient glow from bottom Diya stage
      const floorGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.98,
        10,
        width * 0.5,
        height * 0.95,
        Math.max(width, height) * 0.55
      );
      floorGlow.addColorStop(0, 'rgba(232, 111, 44, 0.045)');
      floorGlow.addColorStop(0.5, 'rgba(245, 176, 65, 0.015)');
      floorGlow.addColorStop(1, 'rgba(7, 5, 10, 0)');
      ctx.fillStyle = floorGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw & update floating Golden Bokeh Orbs
      ctx.globalCompositeOperation = 'lighter';
      for (const orb of bokehOrbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.y < -orb.radius * 2) {
          orb.y = height + orb.radius;
          orb.x = Math.random() * width;
        }
        if (orb.x < -orb.radius * 2) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius * 2) orb.x = -orb.radius;

        if (Math.abs(orb.alpha - orb.targetAlpha) < 0.005) {
          orb.targetAlpha = 0.03 + Math.random() * 0.16;
        } else {
          orb.alpha += (orb.targetAlpha - orb.alpha) * 0.02;
        }

        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        grad.addColorStop(0, `${orb.color}${orb.alpha.toFixed(3)})`);
        grad.addColorStop(0.6, `${orb.color}${(orb.alpha * 0.45).toFixed(3)})`);
        grad.addColorStop(1, `${orb.color}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Trigger initial celebratory salvo when user enters Celebration Mode
      if (isCelebratingRef.current && !celebratedInitialized) {
        celebratedInitialized = true;
        launchSalvo(4);
        lastLaunchTime = timestamp;
      } else if (!isCelebratingRef.current && celebratedInitialized) {
        celebratedInitialized = false;
      }

      // Autonomous continuous firework launches during Celebration Mode
      if (isCelebratingRef.current) {
        const launchInterval = 680 + Math.random() * 520;
        if (timestamp - lastLaunchTime > launchInterval && rockets.length < 6) {
          spawnRocket();
          if (Math.random() < 0.34) {
            // Occasional double twin launch!
            window.setTimeout(() => {
              if (isCelebratingRef.current) spawnRocket();
            }, 180);
          }
          lastLaunchTime = timestamp;
        }
      }

      // Update & render ascending Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        if (r.trail.length > 10) r.trail.shift();

        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.14; // gravity slowing ascent

        // Render rocket spark tail
        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          pt.alpha *= 0.85;
          ctx.fillStyle = `rgba(245, 176, 65, ${pt.alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (t / r.trail.length) * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Rocket head glow
        ctx.fillStyle = '#FFFDF9';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Check if rocket reached apex or targetY
        if (r.y <= r.targetY || r.vy >= -1.2) {
          explodeRocket(r);
          rockets.splice(i, 1);
        }
      }

      // Update & render Firework Explosion Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.prevX = p.x;
        p.prevY = p.y;

        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0.01) {
          // If particle has secondary crackle, pop into 3 tiny sparks at end of life
          if (p.hasSecondaryCrackle) {
            for (let c = 0; c < 3; c++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = 0.8 + Math.random() * 1.6;
              particles.push({
                x: p.x,
                y: p.y,
                prevX: p.x,
                prevY: p.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                color: '#FFFDF9',
                alpha: 0.9,
                decay: 0.06,
                gravity: 0.03,
                drag: 0.94,
                size: 1.2,
                twinkle: true,
                hasSecondaryCrackle: false,
              });
            }
          }
          particles.splice(i, 1);
          continue;
        }

        const flicker =
          p.twinkle && p.alpha < 0.55 ? (Math.random() > 0.35 ? 1 : 0.25) : 1;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha * flicker);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Glowing hot tip
        if (p.alpha > 0.4) {
          ctx.fillStyle = '#FFFDF9';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
