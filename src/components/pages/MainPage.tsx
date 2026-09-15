import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { SharkYubi } from '../SharkYubi';
import { soundEngine } from '../../utils/audio';
import { Sparkles, Heart, Gift, Cake, CheckCircle2, ArrowRight } from 'lucide-react';

interface MainPageProps {
  onGoToMemories: () => void;
}

interface PearlQuestItem {
  id: number;
  label: string;
  icon: string;
  wish: string;
  isCollected: boolean;
}

export const MainPage: React.FC<MainPageProps> = ({ onGoToMemories }) => {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [pearls, setPearls] = useState<PearlQuestItem[]>([
    { id: 1, label: 'Mutiara Kebahagiaan', icon: '💖', wish: 'Semoga setiap hari Qiya dipenuhi tawa dan senyuman tulus!', isCollected: false },
    { id: 2, label: 'Mutiara Kesehatan', icon: '🍀', wish: 'Semoga Qiya selalu sehat raga dan damai jiwa, dilindungi selalu!', isCollected: false },
    { id: 3, label: 'Mutiara Mimpi Indah', icon: '⭐', wish: 'Semua cita-cita dan target Qiya dimudahkan jalannya satu per satu!', isCollected: false },
    { id: 4, label: 'Mutiara Kehangatan', icon: '🌸', wish: 'Dikelilingi orang-orang yang tulus menghargai dan menyayangi Qiya!', isCollected: false },
    { id: 5, label: 'Mutiara Keberanian', icon: '🦈', wish: 'Kuat dan tangguh mengarungi samudra kehidupan seperti hiu Yubi!', isCollected: false },
  ]);

  const [activeWishPopup, setActiveWishPopup] = useState<string | null>(null);

  const collectedCount = pearls.filter((p) => p.isCollected).length;
  const isGameComplete = collectedCount === pearls.length;

  const handleBlowCandle = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    soundEngine.playBubblePop();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  const handleCollectPearl = (id: number) => {
    soundEngine.playPearlCollect();
    setPearls((prev) =>
      prev.map((p) => {
        if (p.id === id && !p.isCollected) {
          setActiveWishPopup(p.wish);
          return { ...p, isCollected: true };
        }
        return p;
      })
    );

    // If this was the last pearl, trigger celebration!
    if (collectedCount + 1 === pearls.length) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#fb7185', '#fef08a', '#34d399', '#a78bfa'],
        });
      }, 500);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 select-none">
      {/* Top Banner Celebration */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 text-[#dfb16e] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-3">
          <span>★</span>
          <span>HARI BAHAGIA SEDUNIA</span>
          <span>★</span>
        </div>

        <h1 className="font-serif-display text-3xl sm:text-5xl md:text-6xl text-[#f2f7f7] font-medium leading-tight mb-3">
          Selamat Ulang Tahun, Qiya! 🎂
        </h1>
        <p className="font-quicksand text-base sm:text-lg text-[#a5ced6] font-normal max-w-xl mx-auto leading-relaxed">
          Semoga di usia yang baru ini, langkahmu seanggun lumba-lumba dan sekuat hiu di luasnya samudra!
        </p>
      </motion.div>

      {/* Main Greeting Card with Interactive Cake & Yubi */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-10">
        {/* Left: Cute Shark Yubi */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <SharkYubi
            size="lg"
            pose="happy"
            showPartyHat={true}
            speechBubble="Yeaaay! Selamat ulang tahun Qiya tercinta! Yubi bangga banget sama kamu! 💖"
          />

          {/* Interactive Underwater Cake */}
          <div
            id="birthday-cake-card"
            onClick={handleBlowCandle}
            className="mt-2 w-full max-w-xs p-4 rounded-2xl bg-[#072732]/90 border border-[#397d8b]/60 backdrop-blur-md text-center cursor-pointer hover:border-[#dfb16e] transition-all group shadow-xl"
            title="Klik lilin untuk meniup harapan!"
          >
            <div className="flex items-center justify-center gap-3 text-3xl mb-2">
              <span className={`transition-all ${candlesBlown ? 'opacity-40 grayscale' : 'animate-bounce'}`}>
                {candlesBlown ? '💨' : '🕯️'}
              </span>
              <span className="text-4xl group-hover:scale-110 transition-transform">🎂</span>
              <span className={`transition-all ${candlesBlown ? 'opacity-40 grayscale' : 'animate-bounce'}`}>
                {candlesBlown ? '💨' : '🕯️'}
              </span>
            </div>
            <div className="text-xs font-semibold font-quicksand text-[#f2f7f7]">
              {candlesBlown ? '✨ Lilin Berhasil Ditiup! Harapanmu Dikirim ke Samudra ✨' : '👆 Ketuk Lilin Laut untuk Meniup Harapan!'}
            </div>
          </div>
        </div>

        {/* Right: Heartfelt Wishes Card */}
        <div className="md:col-span-7 bg-[#072732]/90 backdrop-blur-xl border border-[#397d8b]/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-[#dfb16e] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
            <Heart className="w-4 h-4 fill-[#dfb16e] text-[#dfb16e]" />
            <span>Untaian Doa & Harapan Terdalam</span>
          </div>

          <div className="space-y-3 text-[#a5ced6] text-sm sm:text-base leading-relaxed font-quicksand">
            <p className="text-[#f2f7f7]">
              Di hari yang begitu istimewa ini, terima kasih sudah hadir di dunia dengan senyuman dan kebaikanmu yang menyejukkan.
            </p>
            <p className="p-4 rounded-2xl bg-[#061e27]/80 border border-[#397d8b]/40 text-[#f2f7f7] font-serif-display text-base sm:text-lg italic leading-relaxed shadow-inner">
              “Semoga Qiya senantiasa diberikan kelapangan hati, kesehatan yang prima, kebahagiaan yang melimpah, dan kemudahan dalam setiap langkah meraih apa yang diimpikan.”
            </p>
            <p>
              Jangan pernah ragu akan potensimu, Qiya. Kamu jauh lebih kuat dan lebih berharga dari apa yang kamu kira! Yubi dan semua yang menyayangimu akan selalu mendukungmu.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#dfb16e] font-medium font-quicksand">
            <span className="px-3.5 py-1 rounded-full bg-[#061e27] border border-[#397d8b]/50">✨ Penuh Berkah</span>
            <span className="px-3.5 py-1 rounded-full bg-[#061e27] border border-[#397d8b]/50">💖 Selalu Bahagia</span>
            <span className="px-3.5 py-1 rounded-full bg-[#061e27] border border-[#397d8b]/50">⭐ Cita-Cita Terwujud</span>
          </div>
        </div>
      </div>

      {/* Mini Game Section: Quest to unlock next page */}
      <div className="bg-[#072732]/95 backdrop-blur-xl border border-[#397d8b]/70 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#397d8b]/40 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#dfb16e] text-xs font-bold tracking-[0.22em] uppercase mb-1">
              <span>★</span>
              <span>MINI GAME BAWAH LAUT</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-[#f2f7f7] font-medium">
              Bantu Yubi Mengumpulkan 5 Mutiara Harapan!
            </h2>
            <p className="text-xs sm:text-sm text-[#a5ced6] mt-1 font-quicksand">
              Ketuk kerang mutiara di bawah ini untuk membuka halaman memori indah Qiya 📸
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-3 bg-[#061e27] border border-[#397d8b]/60 px-4 py-2 rounded-2xl shrink-0">
            <span className="text-2xl">🐚</span>
            <div>
              <div className="text-[11px] text-[#a5ced6] font-semibold">Mutiara Terkumpul</div>
              <div className="text-lg font-bold font-serif-display text-[#dfb16e]">
                {collectedCount} / {pearls.length}
              </div>
            </div>
            {isGameComplete && <CheckCircle2 className="w-6 h-6 text-[#dfb16e]" />}
          </div>
        </div>

        {/* 5 Pearl Interactive Clams */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {pearls.map((pearl) => (
            <motion.div
              key={pearl.id}
              id={`pearl-quest-item-${pearl.id}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCollectPearl(pearl.id)}
              className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border ${
                pearl.isCollected
                  ? 'bg-gradient-to-b from-[#0e3b49] to-[#072732] border-[#dfb16e] shadow-lg shadow-[#dfb16e]/10'
                  : 'bg-[#061e27]/80 border-[#397d8b]/40 hover:border-[#dfb16e]/60 hover:bg-[#082b36]'
              }`}
            >
              <div className="relative text-3xl mb-2">
                {pearl.isCollected ? (
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="inline-block"
                  >
                    ✨{pearl.icon}
                  </motion.span>
                ) : (
                  <span className="inline-block animate-pulse opacity-80">🦪</span>
                )}
              </div>
              <div className="text-xs font-semibold font-quicksand text-[#f2f7f7] mb-1">
                {pearl.label}
              </div>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold font-quicksand ${
                  pearl.isCollected
                    ? 'bg-[#dfb16e]/20 text-[#dfb16e] border border-[#dfb16e]/40'
                    : 'bg-[#061e27] text-[#a5ced6]'
                }`}
              >
                {pearl.isCollected ? 'Tersimpan ✓' : 'Buka Kerang'}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Wish Popup from collected pearl */}
        {activeWishPopup && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-[#061e27] border border-[#dfb16e]/60 text-[#f2f7f7] text-xs sm:text-sm flex items-center justify-between gap-3 shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">💌</span>
              <span>
                <strong className="text-[#dfb16e] font-serif-display text-sm sm:text-base">Pesan Mutiara: </strong>
                <span className="font-quicksand text-[#a5ced6]">{activeWishPopup}</span>
              </span>
            </div>
            <button
              onClick={() => setActiveWishPopup(null)}
              className="text-[#dfb16e] hover:text-white text-xs font-bold px-2 py-1 cursor-pointer"
            >
              Tutup
            </button>
          </motion.div>
        )}

        {/* Unlock Next Page Button */}
        <div className="text-center pt-2">
          {isGameComplete ? (
            <motion.button
              id="goto-memories-btn"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: [1, 1.03, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={onGoToMemories}
              className="px-8 py-3.5 sm:py-4 rounded-xl bg-[#dfb16e] hover:bg-[#eac47e] text-[#07252f] font-bold font-quicksand text-base sm:text-lg shadow-[0_10px_25px_rgba(223,177,110,0.3)] transition-all cursor-pointer inline-flex items-center gap-3 border border-[#edd29b]/50"
            >
              <span>Semua Mutiara Terkumpul! Buka Halaman Memory Qiya</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <div className="text-xs text-[#a5ced6] flex items-center justify-center gap-2 font-quicksand">
              <span>🔒 Buka semua {pearls.length} kerang mutiara untuk membuka Halaman Memory! (Sisa {pearls.length - collectedCount})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
