import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { WishItem } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Sparkles, Send, Heart, Star, CheckCircle, RotateCcw } from 'lucide-react';
import { SharkYubi } from '../SharkYubi';

interface WishesPageProps {
  onRestartExperience: () => void;
}

const DEFAULT_WISHES: WishItem[] = [
  {
    id: 'w-1',
    category: 'Harapan Tahun Ini',
    content: 'Semoga di tahun ini hati selalu tenang, langkah semakin mantap, dan setiap usaha berbuah manis.',
    date: 'Hari Ulang Tahun',
    bottleColor: 'cyan',
  },
];

export const WishesPage: React.FC<WishesPageProps> = ({ onRestartExperience }) => {
  const [wishes, setWishes] = useState<WishItem[]>(() => {
    try {
      const saved = localStorage.getItem('qiya_shark_wishes');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_WISHES;
  });

  const [wishText, setWishText] = useState('');
  const [category, setCategory] = useState<WishItem['category']>('Harapan Tahun Ini');
  const [bottleColor, setBottleColor] = useState<WishItem['bottleColor']>('cyan');
  const [isSavingAnimation, setIsSavingAnimation] = useState(false);
  const [justSavedWish, setJustSavedWish] = useState<WishItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('qiya_shark_wishes', JSON.stringify(wishes));
    } catch {
      // ignore
    }
  }, [wishes]);

  const handleSaveWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim() || isSavingAnimation) return;

    const newWish: WishItem = {
      id: `wish-${Date.now()}`,
      category,
      content: wishText.trim(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      bottleColor,
    };

    setIsSavingAnimation(true);
    setJustSavedWish(newWish);
    soundEngine.playWishSend();

    // Trigger celebratory sparkles
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#fb7185', '#fef08a', '#34d399'],
    });

    setTimeout(() => {
      setWishes([newWish, ...wishes]);
      setWishText('');
      setIsSavingAnimation(false);
    }, 2400);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 select-none">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 text-[#dfb16e] text-xs font-bold tracking-[0.25em] uppercase mb-2">
          <span>★</span>
          <span>HARAPAN & CITA-CITA</span>
          <span>★</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-5xl text-[#f2f7f7] font-medium leading-tight mb-2">
          Botol Harapan Samudra Qiya 🍾
        </h1>
        <p className="font-quicksand text-xs sm:text-sm text-[#a5ced6] max-w-xl mx-auto">
          Tuliskan semua impian, cita-cita, dan doa yang ingin terwujud di usia barumu. Harapanmu akan dimasukkan ke dalam botol kaca bercahaya dan diluncurkan ke samudra luas!
        </p>
      </motion.div>

      {/* Main Wish Input Form */}
      <div className="relative bg-[#072732]/95 backdrop-blur-xl border border-[#397d8b]/70 rounded-3xl p-6 sm:p-8 shadow-2xl mb-12">
        {/* Magical Bottle Animation Overlay while Saving */}
        <AnimatePresence>
          {isSavingAnimation && justSavedWish && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-[#061e27]/95 rounded-3xl flex flex-col items-center justify-center p-6 text-center backdrop-blur-md"
            >
              {/* Floating Glowing Bottle Ascending into Deep Sea */}
              <motion.div
                initial={{ scale: 0.5, y: 40, rotate: 0 }}
                animate={{
                  scale: [0.5, 1.2, 1, 0.8],
                  y: [40, 0, -30, -120],
                  rotate: [0, -10, 10, -5],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 2.3, ease: 'easeInOut' }}
                className="relative flex flex-col items-center"
              >
                {/* Bottle SVG Icon */}
                <div className="text-6xl sm:text-7xl filter drop-shadow-[0_0_25px_rgba(223,177,110,0.9)] animate-pulse">
                  🍾
                </div>
                {/* Glow ring */}
                <div className="w-24 h-24 rounded-full bg-[#dfb16e]/30 filter blur-xl absolute inset-0 -z-10 animate-ping" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 space-y-2"
              >
                <div className="text-xl sm:text-2xl font-serif-display font-medium text-[#dfb16e]">
                  ✨ Pesan Harapan Sedang Meluncur ke Samudra! ✨
                </div>
                <p className="text-xs sm:text-sm text-[#a5ced6] max-w-sm font-quicksand">
                  Yubi mengawal botol impian Qiya agar didengar oleh semesta dan terkabul satu per satu...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSaveWish} className="space-y-6">
          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[#dfb16e] mb-2 font-quicksand">
              Pilih Kategori Harapan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-quicksand">
              {(['Cita-cita', 'Harapan Tahun Ini', 'Doa Bahagia'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-[#dfb16e] text-[#07252f] shadow-md shadow-[#dfb16e]/20 scale-[1.02] border border-[#edd29b]/60'
                      : 'bg-[#061e27] text-[#a5ced6] border border-[#397d8b]/40 hover:border-[#dfb16e]'
                  }`}
                >
                  {cat === 'Cita-cita' && '🎯 Cita-cita & Karier'}
                  {cat === 'Harapan Tahun Ini' && '🌟 Harapan Tahun Ini'}
                  {cat === 'Doa Bahagia' && '💖 Doa Bahagia & Damai'}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area for Wishes */}
          <div>
            <div className="flex items-center justify-between mb-2 font-quicksand">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#dfb16e]">
                Tuliskan Harapan, Cita-cita, & Doa Qiya:
              </label>
              <span className="text-[11px] text-[#a5ced6]/70">
                Semesta mendengar setiap harapan tulusmu
              </span>
            </div>
            <textarea
              id="wish-input-textarea"
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Contoh: Di usia ini aku ingin lebih berani mencoba hal baru, lulus dengan hasil terbaik, dan selalu dikelilingi orang yang tulus..."
              rows={4}
              required
              className="w-full p-4 rounded-2xl bg-[#061e27] border border-[#397d8b]/60 text-[#f2f7f7] placeholder-slate-400 text-sm sm:text-base focus:border-[#dfb16e] outline-none transition-all shadow-inner leading-relaxed resize-none font-quicksand"
            />
          </div>

          {/* Bottle Color Customizer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 font-quicksand">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#a5ced6]">Warna Botol:</span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'cyan', label: 'Biru Laut', bg: 'bg-cyan-400' },
                  { id: 'pink', label: 'Kristal Mawar', bg: 'bg-rose-400' },
                  { id: 'amber', label: 'Emas Bintang', bg: 'bg-amber-400' },
                  { id: 'emerald', label: 'Zamrud Karang', bg: 'bg-emerald-400' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setBottleColor(c.id as WishItem['bottleColor'])}
                    className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer ${
                      bottleColor === c.id
                        ? 'ring-4 ring-white/60 scale-110 shadow-lg'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="save-wish-btn"
              disabled={!wishText.trim() || isSavingAnimation}
              className="px-8 py-3.5 rounded-xl bg-[#dfb16e] hover:bg-[#eac47e] text-[#07252f] font-bold font-quicksand text-sm sm:text-base shadow-[0_10px_25px_rgba(223,177,110,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 border border-[#edd29b]/50"
            >
              <Send className="w-4 h-4 text-[#07252f]" />
              <span>Simpan & Luncurkan Harapan ke Samudra 🍾</span>
            </button>
          </div>
        </form>
      </div>

      {/* Saved Wishes Collection (Peti Harta Karun Harapan) */}
      <div className="space-y-4 mb-12">
        <div className="flex items-center justify-between pb-2 border-b border-[#397d8b]/40">
          <div className="flex items-center gap-2 text-[#f2f7f7] font-serif-display text-xl font-medium">
            <span>🎁 Peti Harta Karun Harapan Qiya ({wishes.length})</span>
          </div>
          <span className="text-xs text-[#dfb16e] font-quicksand font-medium">Tersimpan Abadi di Samudra</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishes.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#072732]/90 border border-[#397d8b]/50 backdrop-blur-md flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-[#dfb16e] transition-all"
            >
              {/* Bottle color accent top bar */}
              <div
                className={`absolute top-0 inset-x-0 h-1.5 ${
                  w.bottleColor === 'pink'
                    ? 'bg-rose-400'
                    : w.bottleColor === 'amber'
                    ? 'bg-amber-400'
                    : w.bottleColor === 'emerald'
                    ? 'bg-emerald-400'
                    : 'bg-cyan-400'
                }`}
              />

              <div className="flex items-center justify-between text-[11px] text-[#dfb16e] font-semibold pt-1 font-quicksand">
                <span className="px-2.5 py-0.5 rounded-full bg-[#061e27] border border-[#397d8b]/50">
                  {w.category}
                </span>
                <span className="text-[#a5ced6]/70">{w.date}</span>
              </div>

              <p className="text-sm text-[#f2f7f7] leading-relaxed font-quicksand">
                "{w.content}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#397d8b]/30 text-[11px] text-[#a5ced6] font-quicksand">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Disimpan Bersama Yubi
                </span>
                <span className="text-base">🍾</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sweet Closing Birthday Card from Yubi */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#072732] via-[#061e27] to-[#04151b] border border-[#dfb16e]/50 backdrop-blur-xl text-center space-y-4 shadow-2xl">
        <SharkYubi
          size="md"
          pose="happy"
          showPartyHat={true}
          speechBubble="Selamat bertumbuh dan bahagia selalu, Qiya! Kamu adalah yang terbaik! 🦈🎉"
        />

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-2xl sm:text-3xl font-medium font-serif-display text-[#f2f7f7]">
            Semoga Hari Ulang Tahunmu Seindah Samudra Ini 🌊💖
          </h3>
          <p className="text-xs sm:text-sm text-[#a5ced6] leading-relaxed font-quicksand">
            Terima kasih telah menjelajahi kado bawah laut ini. Semoga semua harapan yang telah kamu tabur di sini menjadi kenyataan manis di waktu yang tepat!
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            id="restart-adventure-btn"
            onClick={() => {
              soundEngine.playBubblePop();
              onRestartExperience();
            }}
            className="px-6 py-3 rounded-xl bg-[#061e27] hover:bg-[#092b36] text-[#dfb16e] text-xs font-bold font-quicksand flex items-center gap-2 cursor-pointer transition-all border border-[#397d8b]/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Petualangan Bawah Laut dari Awal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
