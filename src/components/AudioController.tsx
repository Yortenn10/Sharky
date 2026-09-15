import React, { useState } from 'react';
import { Volume2, VolumeX, Waves, Music, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { AudioTrackId } from '../types';

export const AudioController: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrackId>('calm_piano');
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startAudioOnce = (track?: AudioTrackId) => {
    const selected = track || currentTrack;
    soundEngine.setMute(false);
    soundEngine.playTrack(selected);
    setIsMuted(false);
    setHasStarted(true);
  };

  const handleToggleMute = () => {
    if (!hasStarted) {
      startAudioOnce();
      return;
    }
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMute(nextMuted);
  };

  const handleChangeTrack = (track: AudioTrackId) => {
    setCurrentTrack(track);
    if (!hasStarted) {
      startAudioOnce(track);
    } else {
      setIsMuted(false);
      soundEngine.setMute(false);
      soundEngine.playTrack(track);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {/* Floating Pill Controller */}
      <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 rounded-full p-1.5 shadow-2xl transition-all hover:border-cyan-400">
        {/* Play/Mute Quick Button */}
        <button
          id="audio-mute-toggle-btn"
          onClick={handleToggleMute}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
            isMuted || !hasStarted
              ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
              : 'bg-cyan-500/25 text-cyan-200 hover:bg-cyan-500/35 border border-cyan-400/40'
          }`}
          title={isMuted ? 'Nyalakan Audio' : 'Matikan Suara (Mute)'}
        >
          {isMuted || !hasStarted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Suara: Mati</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span className="hidden sm:inline font-quicksand font-bold">
                {currentTrack === 'ocean_waves' && 'Deburan Ombak'}
                {currentTrack === 'calm_piano' && 'Instrumen Tenang'}
                {currentTrack === 'baby_shark_musicbox' && 'Baby Shark Chime'}
              </span>
              {/* Equalizer animation */}
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-cyan-400 animate-[pulse_0.6s_ease-in-out_infinite]" />
                <span className="w-0.5 h-2 bg-cyan-300 animate-[pulse_0.8s_ease-in-out_infinite]" />
                <span className="w-0.5 h-3.5 bg-cyan-200 animate-[pulse_0.5s_ease-in-out_infinite]" />
              </span>
            </>
          )}
        </button>

        {/* Expand / Track Picker toggle */}
        <button
          id="audio-menu-expand-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Pilihan Musik & Suara Laut"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Track Menu */}
      {isOpen && (
        <div className="mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 text-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-900/50 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Audio Bawah Laut
            </span>
            <span className="text-[10px] text-slate-400">Pilih Suara Favorit</span>
          </div>

          <div className="space-y-1.5">
            {/* Track 1: Deburan Ombak */}
            <button
              onClick={() => handleChangeTrack('ocean_waves')}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                currentTrack === 'ocean_waves' && !isMuted
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-semibold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <div>Deburan Ombak</div>
                  <div className="text-[10px] text-slate-400 font-normal">Suara laut alami menenangkan</div>
                </div>
              </div>
              {currentTrack === 'ocean_waves' && !isMuted && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>

            {/* Track 2: Musik Instrumen Tenang */}
            <button
              onClick={() => handleChangeTrack('calm_piano')}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                currentTrack === 'calm_piano' && !isMuted
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-semibold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div>Instrumen Harpa & Piano Laut</div>
                  <div className="text-[10px] text-slate-400 font-normal">Melodi relaksasi bawah laut</div>
                </div>
              </div>
              {currentTrack === 'calm_piano' && !isMuted && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>

            {/* Track 3: Baby Shark Music Box */}
            <button
              onClick={() => handleChangeTrack('baby_shark_musicbox')}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                currentTrack === 'baby_shark_musicbox' && !isMuted
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-semibold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <div className="text-left">
                  <div>Baby Shark (Kotak Musik Lullaby)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Versi lembut & gemas tidak merusak suasana</div>
                </div>
              </div>
              {currentTrack === 'baby_shark_musicbox' && !isMuted && (
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
              )}
            </button>
          </div>

          {/* Quick Mute button inside drawer */}
          <div className="mt-3 pt-2 border-t border-cyan-900/50 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Status Audio:</span>
            <button
              onClick={handleToggleMute}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                isMuted
                  ? 'bg-rose-500/30 text-rose-200 hover:bg-rose-500/40'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isMuted ? 'Nyalakan Kembali' : 'Matikan Suara'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
