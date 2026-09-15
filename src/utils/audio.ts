import { AudioTrackId } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.55;
  private currentTrack: AudioTrackId = 'ocean_waves';

  // Wave synthesis nodes
  private waveGain: GainNode | null = null;
  private waveFilter: BiquadFilterNode | null = null;
  private waveLfo: OscillatorNode | null = null;
  private waveNoiseSource: AudioBufferSourceNode | null = null;

  // Music loop interval / scheduler
  private musicTimer: number | null = null;
  private isMusicPlaying: boolean = false;
  private noteIndex: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.waveGain && this.ctx) {
      this.waveGain.gain.setTargetAtTime(
        muted ? 0 : this.volume * 0.45,
        this.ctx.currentTime,
        0.1
      );
    }
    if (muted) {
      this.stopMusic();
    } else {
      this.playTrack(this.currentTrack);
    }
  }

  public getMute(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.waveGain && this.ctx && !this.isMuted) {
      this.waveGain.gain.setTargetAtTime(this.volume * 0.45, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTrack(): AudioTrackId {
    return this.currentTrack;
  }

  public playTrack(track: AudioTrackId) {
    this.initContext();
    this.currentTrack = track;

    if (this.isMuted) return;

    // Always keep gentle ambient ocean wave backdrop
    this.startOceanWaves();

    // Handle music layer
    this.stopMusic();
    if (track === 'calm_piano') {
      this.startCalmOceanPiano();
    } else if (track === 'baby_shark_musicbox') {
      this.startBabySharkMusicBox();
    }
  }

  // 1. Natural ocean wave swell generator (pink noise + resonant LFO filter)
  private startOceanWaves() {
    if (this.waveNoiseSource || !this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate soft pink noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Lowpass filter for deep underwater ocean sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;
    filter.Q.value = 3.5;

    // LFO to simulate rolling ocean waves (every ~7 seconds a wave rolls in)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.14; // ~7s cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.value = this.isMuted ? 0 : this.volume * 0.4;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    lfo.start();

    this.waveNoiseSource = noise;
    this.waveFilter = filter;
    this.waveGain = gain;
    this.waveLfo = lfo;
  }

  public stopOceanWaves() {
    try {
      if (this.waveNoiseSource) {
        this.waveNoiseSource.stop();
        this.waveNoiseSource.disconnect();
        this.waveNoiseSource = null;
      }
      if (this.waveLfo) {
        this.waveLfo.stop();
        this.waveLfo.disconnect();
        this.waveLfo = null;
      }
    } catch {
      // ignore
    }
  }

  // 2. Play Bell / Kalimba note for music box
  private playBellNote(freq: number, time: number, duration: number = 1.2, gainFactor: number = 0.18) {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, time);

    const actualVolume = this.volume * gainFactor;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(actualVolume, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    oscHarmonic.start(time);
    osc.stop(time + duration);
    oscHarmonic.stop(time + duration);
  }

  // 3. Play warm soft piano/harp chime
  private playHarpNote(freq: number, time: number, duration: number = 2.0) {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.exponentialRampToValueAtTime(250, time + duration);

    const actualVolume = this.volume * 0.16;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(actualVolume, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // 4. Calming ocean instrumental: gentle harp/piano arpeggio pattern
  private startCalmOceanPiano() {
    this.isMusicPlaying = true;
    this.noteIndex = 0;

    // Frequencies in Hz: C4, D4, E4, G4, A4, C5, D5, E5, G5
    const pentatonic = [
      261.63, 293.66, 329.63, 392.00, 440.00,
      523.25, 587.33, 659.25, 783.99
    ];

    const arpeggios = [
      [261.63, 329.63, 392.00, 523.25], // Cmaj
      [220.00, 261.63, 329.63, 440.00], // Amin
      [174.61, 261.63, 329.63, 392.00], // Fmaj7
      [196.00, 293.66, 392.00, 493.88], // G
    ];

    let chordIdx = 0;
    let step = 0;

    this.musicTimer = window.setInterval(() => {
      if (!this.ctx || !this.isMusicPlaying || this.isMuted) return;
      const now = this.ctx.currentTime;
      const currentChord = arpeggios[chordIdx];
      const noteFreq = currentChord[step % currentChord.length];

      this.playHarpNote(noteFreq, now, 1.8);

      // occasionally add sweet high sparkle note
      if (Math.random() > 0.6) {
        const highNote = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        this.playBellNote(highNote, now + 0.25, 1.5, 0.08);
      }

      step++;
      if (step >= 4) {
        step = 0;
        chordIdx = (chordIdx + 1) % arpeggios.length;
      }
    }, 650);
  }

  // 5. Baby Shark Music Box Lullaby: Gentle, music-box tempo that does NOT ruin the calming atmosphere
  private startBabySharkMusicBox() {
    this.isMusicPlaying = true;
    this.noteIndex = 0;

    // Baby Shark melody frequencies:
    // D4: 293.66, E4: 329.63, G4: 392.00, F#4: 369.99
    const D = 293.66;
    const E = 329.63;
    const G = 392.00;
    const FS = 369.99;
    const B = 493.88;

    // Melody array: [freq, durationInSteps, isAccent]
    const melody: Array<{ freq: number; delay: number }> = [
      // Ba-by Shark, doo doo doo doo doo doo
      { freq: D, delay: 400 },
      { freq: E, delay: 400 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 450 },

      // Ba-by Shark, doo doo doo doo doo doo
      { freq: D, delay: 400 },
      { freq: E, delay: 400 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 450 },

      // Ba-by Shark, doo doo doo doo doo doo
      { freq: D, delay: 400 },
      { freq: E, delay: 400 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 280 },
      { freq: G, delay: 450 },

      // Ba-by Shark!
      { freq: G, delay: 350 },
      { freq: G, delay: 350 },
      { freq: FS, delay: 800 },

      // Rest pause with a gentle music box sparkle
      { freq: B, delay: 900 },
    ];

    let currentIdx = 0;

    const playNext = () => {
      if (!this.isMusicPlaying || this.isMuted || !this.ctx) return;
      const item = melody[currentIdx];
      const now = this.ctx.currentTime;

      // Soft crystalline music box bell note
      this.playBellNote(item.freq, now, 1.2, 0.15);

      // Add gentle bass chime on phrase starts
      if (currentIdx === 0 || currentIdx === 8 || currentIdx === 16 || currentIdx === 24) {
        this.playHarpNote(item.freq * 0.5, now, 2.5);
      }

      currentIdx = (currentIdx + 1) % melody.length;
      this.musicTimer = window.setTimeout(playNext, item.delay);
    };

    playNext();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // --- INTERACTIVE SFX ---
  public playBubblePop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startTime = this.ctx.currentTime;
    osc.frequency.setValueAtTime(320 + Math.random() * 180, startTime);
    osc.frequency.exponentialRampToValueAtTime(750 + Math.random() * 200, startTime + 0.09);

    gain.gain.setValueAtTime(this.volume * 0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.1);
  }

  public playGiftUnwrap() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - C6
    notes.forEach((freq, idx) => {
      this.playBellNote(freq, now + idx * 0.1, 1.2, 0.25);
    });
  }

  public playPearlCollect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [880.0, 1174.66, 1396.91]; // High shimmer
    chord.forEach((freq, idx) => {
      this.playBellNote(freq, now + idx * 0.05, 0.8, 0.2);
    });
  }

  public playPenScratch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(1400 + Math.random() * 400, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.value = 4.0;

    gain.gain.setValueAtTime(this.volume * 0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playWishSend() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const magicalNotes = [440, 554.37, 659.25, 830.61, 880, 1108.73, 1318.51];
    magicalNotes.forEach((freq, idx) => {
      this.playBellNote(freq, now + idx * 0.07, 1.6, 0.22);
    });
  }
}

export const soundEngine = new SoundEngine();
