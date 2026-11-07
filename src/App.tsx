import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Share2,
  UserPen,
  Check,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { FireworksCanvas } from './components/FireworksCanvas';
import { FestiveLights } from './components/FestiveLights';
import { DiyaStageEnsemble, GlowingDiya } from './components/DiyaEnsemble';
import { RangoliBackdrop } from './components/RangoliBackdrop';
import { festiveAudio } from './utils/audioEngine';

const BLESSINGS = [
  'May your life be filled with happiness, prosperity and endless light.',
  'May the divine glow of Diyas illuminate your path with peace, joy, and success.',
  'May this festival of lights bring abundant health, wealth, and sweet moments to your home.',
  'Wishing you and your loved ones a sparkling Deepawali overflowing with love and laughter.',
];

export function App() {
  const [name, setName] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('name') || '').trim();
  });
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [shakeError, setShakeError] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [finaleCounter, setFinaleCounter] = useState<number>(0);
  const [blessingIndex, setBlessingIndex] = useState<number>(0);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isCelebrating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCelebrating]);

  const handleStartCelebration = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedName = name.trim();
    if (trimmedName === '') {
      setErrorMsg('Please enter your name!');
      setShakeError(true);
      window.setTimeout(() => setShakeError(false), 450);
      inputRef.current?.focus();
      return;
    }

    setErrorMsg('');
    setName(trimmedName);

    // Update URL query parameter non-destructively so the link is easily shareable
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('name', trimmedName);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore history API restrictions in sandboxed iframes
    }

    // Unlock and start realistic firecracker audio after user interaction
    festiveAudio.unlockAndStart();
    setIsMuted(festiveAudio.isMuted());

    // Enter Step 03: Personalized Diwali Celebration
    setIsCelebrating(true);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nowMuted = festiveAudio.toggleMute();
    setIsMuted(nowMuted);
  };

  const handleTriggerGrandFinale = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFinaleCounter((c) => c + 1);
    festiveAudio.playCrackerGarland();
  };

  const handleChangeName = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCelebrating(false);
    festiveAudio.stopAmbientLoop();
  };

  const handleShareLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const shareUrl = new URL(window.location.origin + window.location.pathname);
      if (name.trim()) {
        shareUrl.searchParams.set('name', name.trim());
      }
      const urlString = shareUrl.toString();

      if (navigator.share) {
        await navigator.share({
          title: `Happy Deepawali, ${name.trim()}! 🪔`,
          text: `Open your personalized Deepawali 2026 wish! 🪔✨`,
          url: urlString,
        });
        return;
      }

      await navigator.clipboard.writeText(urlString);
      setCopiedToast('Shareable link copied to clipboard! 🪔');
      window.setTimeout(() => setCopiedToast(null), 3200);
    } catch {
      setCopiedToast('Copy this page URL to share with friends & family! 🪔');
      window.setTimeout(() => setCopiedToast(null), 3200);
    }
  };

  const handleCycleBlessing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBlessingIndex((prev) => (prev + 1) % BLESSINGS.length);
    festiveAudio.playDiyaSpark();
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between select-none bg-[#07050A]">
      {/* Deep Obsidian to Royal Night Plum Ambient Radial Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{
          background: isCelebrating
            ? 'radial-gradient(circle at 50% 38%, rgba(36, 20, 52, 0.72) 0%, rgba(19, 13, 28, 0.85) 48%, #07050A 100%)'
            : 'radial-gradient(circle at 50% 45%, rgba(28, 17, 42, 0.82) 0%, #07050A 85%)',
        }}
      />

      {/* Sacred Geometric Lotus Rangoli Backdrop */}
      <RangoliBackdrop isCelebrating={isCelebrating} />

      {/* Full-Viewport HTML5 Canvas Fireworks & Golden Bokeh Engine */}
      <FireworksCanvas
        isCelebrating={isCelebrating}
        finaleTrigger={finaleCounter}
      />

      {/* Animated Hanging Fairy Lights & Golden Canopy */}
      <FestiveLights intense={isCelebrating} />

      {/* TOP BAR: Brand Pill & Floating Celebration Controls */}
      <header className="relative z-30 w-full px-4 sm:px-8 pt-4 sm:pt-6 flex items-center justify-between">
        {/* Left Festive Brand Badge */}
        <div className="smoked-glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-[#F5B041]/30">
          <span className="text-base sm:text-lg leading-none">🪔</span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#FFE082]">
            Deepawali Wishes 2026
          </span>
        </div>

        {/* Right Utility Controls (Visible in Celebration State) */}
        {isCelebrating && (
          <div
            className="flex items-center gap-2 sm:gap-2.5"
            data-interactive="true"
          >
            {/* Launch Extra Fireworks / Crackers Button */}
            <button
              type="button"
              onClick={handleTriggerGrandFinale}
              title="Launch Firecracker Salvo 🎆"
              className="smoked-glass-pill px-3 sm:px-3.5 py-2 rounded-full flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#FFE082] hover:border-[#F5B041] hover:bg-[#F5B041]/15 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5B041]" />
              <span className="hidden sm:inline">Burst Crackers</span>
            </button>

            {/* Mute / Unmute Firecracker Audio Control (FR-07) */}
            <button
              type="button"
              onClick={handleToggleMute}
              aria-label={isMuted ? 'Unmute firecracker sound' : 'Mute firecracker sound'}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className={`smoked-glass-pill px-3 sm:px-3.5 py-2 rounded-full flex items-center gap-2 text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer ${
                isMuted
                  ? 'text-[#9E8C70] border-white/10 hover:border-[#F5B041]/40'
                  : 'text-[#FFFDF9] border-[#F5B041]/50 bg-[#F5B041]/10 hover:bg-[#F5B041]/20'
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-[#E86F2C]" />
                  <span>Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#F5B041] animate-pulse" />
                  <span>Sound On</span>
                </>
              )}
            </button>

            {/* Change Name Button */}
            <button
              type="button"
              onClick={handleChangeName}
              title="Enter another name"
              className="smoked-glass-pill p-2 sm:px-3.5 sm:py-2 rounded-full flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#E6D7C3] hover:text-[#FFFDF9] hover:border-[#F5B041]/50 active:scale-95 transition-all cursor-pointer"
            >
              <UserPen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5B041]" />
              <span className="hidden md:inline">Change Name</span>
            </button>

            {/* Share Link Button */}
            <button
              type="button"
              onClick={handleShareLink}
              title="Share personalized Deepawali link"
              className="smoked-glass-pill p-2 sm:px-3.5 sm:py-2 rounded-full flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#FFE082] hover:border-[#F5B041] hover:bg-[#F5B041]/15 active:scale-95 transition-all cursor-pointer"
            >
              {copiedToast ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5B041]" />
              )}
              <span className="hidden md:inline">Share</span>
            </button>
          </div>
        )}
      </header>

      {/* Share Copy Toast Banner */}
      {copiedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 smoked-glass-pill px-5 py-2.5 rounded-full border border-[#F5B041]/60 text-xs sm:text-sm text-[#FFFDF9] shadow-2xl flex items-center gap-2 animate-celebrate-reveal">
          <Sparkles className="w-4 h-4 text-[#F5B041]" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* MAIN CENTER STAGE: STEP 01/02 (Welcome) OR STEP 03 (Celebration) */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
        {!isCelebrating ? (
          /* =========================================================
             STEP 01 & STEP 02: WELCOME & NAME INPUT RITUAL
             ========================================================= */
          <div
            className={`w-full max-w-[440px] smoked-glass-card rounded-3xl p-6 sm:p-9 text-center transition-all duration-500 ${
              shakeError ? 'animate-shake border-[#D9383A]/80' : ''
            }`}
          >
            {/* Ceremonial Welcoming Glowing Diya Icon */}
            <div className="flex justify-center -mt-4 mb-1">
              <GlowingDiya
                size="sm"
                variant="royal-brass"
                interactive={true}
              />
            </div>

            {/* Step 02 Title */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-wide text-gold-leaf mb-2">
              🪔 Welcome!
            </h1>

            <p className="text-sm sm:text-base text-[#E6D7C3] mb-6 leading-relaxed">
              Enter your name to receive a special wish.
            </p>

            {/* Name Input Form */}
            <form onSubmit={handleStartCelebration} noValidate className="text-left">
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#FFE082]/90 mb-2 ml-1"
              >
                Your Name
              </label>

              <div className="relative mb-2">
                <input
                  ref={inputRef}
                  id="username"
                  type="text"
                  maxLength={42}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter your name here..."
                  autoComplete="off"
                  className={`w-full px-4 py-3.5 rounded-xl bg-[#07050A]/75 text-[#FFFDF9] placeholder-[#9E8C70]/70 text-base sm:text-lg font-medium border transition-all outline-none ${
                    errorMsg
                      ? 'border-[#D9383A] ring-2 ring-[#D9383A]/30'
                      : 'border-[#F5B041]/35 focus:border-[#F5B041] focus:ring-3 focus:ring-[#F5B041]/25'
                  }`}
                />
                {name.trim().length > 0 && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                    ✨
                  </span>
                )}
              </div>

              {/* Validation Error Message */}
              <div className="min-h-[22px] mb-3">
                {errorMsg ? (
                  <p
                    role="alert"
                    className="text-xs sm:text-sm font-medium text-[#FF6B6B] flex items-center gap-1.5 pl-1"
                  >
                    <span>⚠️</span>
                    <span>{errorMsg}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#9E8C70] pl-1">
                    Sound effects & fireworks will start when you click Continue.
                  </p>
                )}
              </div>

              {/* Continue CTA Button (FR-02) */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-base sm:text-lg text-[#07050A] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,176,65,0.4)] hover:shadow-[0_0_42px_rgba(245,176,65,0.7)] hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                style={{
                  background:
                    'linear-gradient(135deg, #FFE082 0%, #F5B041 48%, #D97706 100%)',
                }}
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        ) : (
          /* =========================================================
             STEP 03: PERSONALIZED DIWALI CELEBRATION STAGE
             ========================================================= */
          <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center animate-celebrate-reveal px-2">
            {/* Soft Radial Dark Scrim Behind Typography for 100% Contrast Against Fireworks */}
            <div
              className="relative rounded-3xl px-5 py-6 sm:px-10 sm:py-8 transition-all"
              style={{
                background:
                  'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(7, 5, 10, 0.72) 0%, rgba(7, 5, 10, 0.38) 65%, transparent 100%)',
              }}
            >
              {/* Auspicious Sanskrit / Traditional Subtitle */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5B041]/10 border border-[#F5B041]/30 text-[#FFE082] text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                <span>✨</span>
                <span>Shubh Deepawali • Festival of Lights</span>
                <span>✨</span>
              </div>

              {/* Main Personalized Greeting Headline (FR-03) */}
              <h1
                id="wish"
                className="font-display font-bold tracking-tight leading-[1.12] mb-4 sm:mb-5"
              >
                <span className="block text-3xl sm:text-5xl md:text-6xl text-gold-leaf">
                  Happy Deepawali,
                </span>
                <span className="block mt-1 sm:mt-2 text-4xl sm:text-6xl md:text-7xl text-gold-shimmer break-words">
                  {name}! <span className="inline-block not-italic">🪔</span>
                </span>
              </h1>

              {/* Ornate Golden Divider Line */}
              <div className="flex items-center justify-center gap-3 my-3 sm:my-4">
                <span className="h-[1px] w-14 sm:w-24 bg-gradient-to-r from-transparent to-[#F5B041]/70" />
                <span className="text-[#F5B041] text-sm">✦</span>
                <span className="h-[1px] w-14 sm:w-24 bg-gradient-to-l from-transparent to-[#F5B041]/70" />
              </div>

              {/* Heartfelt Blessing Copy */}
              <p
                onClick={handleCycleBlessing}
                title="Click to see another Deepawali blessing ✨"
                data-interactive="true"
                className="font-display italic text-xl sm:text-2xl md:text-[26px] text-[#E6D7C3] max-w-[46ch] mx-auto leading-relaxed cursor-pointer hover:text-[#FFFDF9] transition-colors"
              >
                “{BLESSINGS[blessingIndex]}”
              </p>

              {/* Interactive Celebration Feature Pill Bar */}
              <div
                className="mt-6 sm:mt-7 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full smoked-glass-pill text-xs sm:text-sm text-[#FFE082]/90 tracking-wider"
                data-interactive="true"
              >
                <button
                  type="button"
                  onClick={handleTriggerGrandFinale}
                  className="hover:text-[#FFFDF9] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Click to launch extra fireworks!"
                >
                  <span>🎆</span>
                  <span>Fireworks</span>
                </button>
                <span className="text-[#F5B041]/50">•</span>
                <button
                  type="button"
                  onClick={() => festiveAudio.playDiyaSpark()}
                  className="hover:text-[#FFFDF9] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Glowing Diyas"
                >
                  <span>🪔</span>
                  <span>Diyas</span>
                </button>
                <span className="text-[#F5B041]/50">•</span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#E86F2C] inline" />
                  <span>Candlelight</span>
                </span>
                <span className="text-[#F5B041]/50">•</span>
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="hover:text-[#FFFDF9] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Toggle firecracker sound"
                >
                  <span>{isMuted ? '🔇' : '🔊'}</span>
                  <span>{isMuted ? 'Sound Muted' : 'Sound'}</span>
                </button>
              </div>

              {/* Subtle Interactive Hint */}
              <p className="mt-3 text-[11px] sm:text-xs text-[#9E8C70] tracking-wide">
                Tap anywhere on the night sky to launch fireworks • Tap any Diya to brighten its flame
              </p>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM FOREGROUND: REALISTIC GLOWING DIYAS & CANDLELIGHT ENSEMBLE (FR-04) */}
      <footer className="relative z-20 w-full flex flex-col items-center">
        <DiyaStageEnsemble isCelebrating={isCelebrating} />
      </footer>
    </div>
  );
}

export default App;
