// Realistic Firecracker & Deepawali Celebration Audio Engine
// Combines real-time synchronized Web Audio synthesis with an in-memory WAV <audio> ambience track.

export type ExplosionType = 'peony' | 'willow' | 'ring' | 'crackle';

class FestiveAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private ambientAudioEl: HTMLAudioElement | null = null;
  private muted: boolean = false;
  private initialized: boolean = false;
  private ambientCrackleTimer: number | null = null;

  /**
   * Must be invoked inside a direct user gesture (e.g., clicking "Continue ->")
   */
  public unlockAndStart(): void {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      if (!this.initialized && this.ctx) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.muted ? 0 : 0.82;
        this.masterGain.connect(this.ctx.destination);

        // Pre-compute 2-second rich noise buffer for explosions, whooshes, and crackles
        this.noiseBuffer = this.createNoiseBuffer(this.ctx, 2.0);

        // Also build an HTML5 <audio> element with generated festive firecracker ambience WAV
        this.setupAmbientAudioElement();

        this.initialized = true;
      }

      if (!this.muted) {
        this.playAuspiciousWelcomeChime();
        this.startAmbientLoop();
      }
    } catch {
      // Gracefully ignore if browser audio device is unavailable
    }
  }

  private createNoiseBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
    const bufferSize = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // Pink-ish weighted white noise for natural pyrotechnic acoustics
    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 0.0526913;
      output[i] = Math.max(-1, Math.min(1, (b0 + b1 + b2 + white * 0.18) * 0.32));
    }
    return buffer;
  }

  /**
   * Generates a real WAV audio blob in-memory containing subtle festive night crackles
   * so an HTML5 <audio> element is also active and controllable via Mute/Unmute.
   */
  private setupAmbientAudioElement(): void {
    try {
      const sampleRate = 22050;
      const seconds = 4;
      const numSamples = sampleRate * seconds;
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);

      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + numSamples * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 1, true); // Mono
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, numSamples * 2, true);

      // Synthesize distant celebratory crackles & warm evening breeze
      let env = 0;
      for (let i = 0; i < numSamples; i++) {
        if (Math.random() < 0.0022) {
          env = 0.35 + Math.random() * 0.45;
        }
        env *= 0.986;
        const sample = (Math.random() * 2 - 1) * env * 0.16;
        const pcm = Math.max(-1, Math.min(1, sample));
        view.setInt16(44 + i * 2, pcm * 32767, true);
      }

      const blob = new Blob([buffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = 0.28;
      this.ambientAudioEl = audio;
    } catch {
      // Fallback safely to Web Audio only
    }
  }

  private startAmbientLoop(): void {
    if (this.ambientAudioEl && !this.muted) {
      this.ambientAudioEl.play().catch(() => {
        // Ignore autoplay promise rejection if any
      });
    }

    if (this.ambientCrackleTimer) {
      window.clearInterval(this.ambientCrackleTimer);
    }

    // Occasional distant festive patakha / sparkler crackle
    this.ambientCrackleTimer = window.setInterval(() => {
      if (!this.muted && this.ctx && document.visibilityState === 'visible') {
        if (Math.random() < 0.48) {
          this.playSparkleCluster(0.18, (Math.random() - 0.5) * 1.2);
        }
      }
    }, 1800);
  }

  public stopAmbientLoop(): void {
    if (this.ambientAudioEl) {
      this.ambientAudioEl.pause();
    }
    if (this.ambientCrackleTimer) {
      window.clearInterval(this.ambientCrackleTimer);
      this.ambientCrackleTimer = null;
    }
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(mute ? 0 : 0.82, this.ctx.currentTime, 0.04);
    }
    if (this.ambientAudioEl) {
      this.ambientAudioEl.muted = mute;
      if (!mute) {
        this.ambientAudioEl.play().catch(() => {});
      } else {
        this.ambientAudioEl.pause();
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  /**
   * Gentle auspicious temple bell & warm chord when the celebration reveals
   */
  public playAuspiciousWelcomeChime(): void {
    if (this.muted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const freqs = [528, 660, 792, 1056]; // Auspicious harmonic fifths

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.065 / (idx + 1), now + idx * 0.09 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 1.9);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 2.0);
    });
  }

  /**
   * Ascending rocket whoosh sound when a firework launches from the ground
   */
  public playRocketLaunch(panValue = 0): void {
    if (this.muted || !this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const now = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(380, now);
    filter.frequency.exponentialRampToValueAtTime(1450, now + 0.45);
    filter.Q.value = 3.2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    const panner = this.ctx.createStereoPanner();
    panner.pan.value = Math.max(-0.9, Math.min(0.9, panValue));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.5);
  }

  /**
   * Realistic firework shell burst: deep sky boom + secondary crackle stars
   */
  public playExplosion(
    intensity = 0.85,
    type: ExplosionType = 'peony',
    panValue = 0
  ): void {
    if (this.muted || !this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const now = this.ctx.currentTime;
    const clampedPan = Math.max(-0.9, Math.min(0.9, panValue));
    const panner = this.ctx.createStereoPanner();
    panner.pan.value = clampedPan;
    panner.connect(this.masterGain);

    // 1. Sub-bass chest thump (physical acoustic shockwave)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    const startFreq = type === 'willow' ? 95 : 115 + Math.random() * 25;
    subOsc.frequency.setValueAtTime(startFreq, now);
    subOsc.frequency.exponentialRampToValueAtTime(26, now + 0.36);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.36 * intensity, now + 0.012);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    subOsc.connect(subGain);
    subGain.connect(panner);
    subOsc.start(now);
    subOsc.stop(now + 0.45);

    // 2. Explosive broadband burst body with lowpass sweep (sky echo)
    const burstSource = this.ctx.createBufferSource();
    burstSource.buffer = this.noiseBuffer;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1600 * intensity, now);
    lowpass.frequency.exponentialRampToValueAtTime(140, now + 0.75);

    const burstGain = this.ctx.createGain();
    burstGain.gain.setValueAtTime(0.001, now);
    burstGain.gain.linearRampToValueAtTime(0.34 * intensity, now + 0.008);
    burstGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.82);

    burstSource.connect(lowpass);
    lowpass.connect(burstGain);
    burstGain.connect(panner);

    burstSource.start(now);
    burstSource.stop(now + 0.85);

    // 3. Delayed crackle / sizzle stars (especially pronounced for 'crackle' & 'willow')
    const crackleDelay = type === 'crackle' ? 0.14 : 0.22;
    const crackleStrength = type === 'crackle' ? intensity * 0.85 : intensity * 0.45;
    window.setTimeout(() => {
      this.playSparkleCluster(crackleStrength, clampedPan);
    }, crackleDelay * 1000);
  }

  /**
   * Simulates high-frequency patakha / sparkler crackle pops
   */
  public playSparkleCluster(strength = 0.4, basePan = 0): void {
    if (this.muted || !this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const popCount = 5 + Math.floor(Math.random() * 7);
    for (let i = 0; i < popCount; i++) {
      const delay = Math.random() * 0.34;
      const now = this.ctx.currentTime + delay;

      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1800 + Math.random() * 3800, now);
      bp.Q.value = 4.5;

      const gain = this.ctx.createGain();
      const peak = (0.08 + Math.random() * 0.12) * strength;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045 + Math.random() * 0.03);

      const panner = this.ctx.createStereoPanner();
      panner.pan.value = Math.max(
        -0.95,
        Math.min(0.95, basePan + (Math.random() - 0.5) * 0.5)
      );

      src.connect(bp);
      bp.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);

      src.start(now, Math.random() * 1.2, 0.08);
      src.stop(now + 0.08);
    }
  }

  /**
   * Simulates lighting a garland of Diwali firecrackers (Ladi)
   */
  public playCrackerGarland(): void {
    if (this.muted || !this.ctx) return;
    for (let i = 0; i < 6; i++) {
      window.setTimeout(() => {
        const pan = (Math.random() - 0.5) * 1.4;
        this.playExplosion(0.65 + Math.random() * 0.3, 'crackle', pan);
      }, i * 165);
    }
  }

  /**
   * Gentle warm spark sound when clicking a Diya
   */
  public playDiyaSpark(): void {
    if (this.muted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.36);

    this.playSparkleCluster(0.25, 0);
  }
}

export const festiveAudio = new FestiveAudioEngine();
