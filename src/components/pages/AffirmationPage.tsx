import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AffirmationItem } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Sparkles, PenTool, RefreshCw, ArrowRight, Heart, Feather } from 'lucide-react';
import { SharkYubi } from '../SharkYubi';

interface AffirmationPageProps {
  onGoToWishes: () => void;
}

const AFFIRMATIONS: AffirmationItem[] = [
  {
    id: 'aff-1',
    title: 'Kamu Luar Biasa, Qiya',
    category: 'apresiasi',
    from: 'Hiu Yubi & Alam Semesta',
    text: 'Untuk Qiya yang berharga: Dalam setiap hembusan ombak dan tenangnya samudra, ingatlah bahwa keberadaanmu adalah anugerah. Kamu telah berjuang sejauh ini dengan hati yang tulus dan tangguh. Jangan pernah remehkan kekuatan kecil yang kamu miliki, karena dari hal-hal kecil itulah kamu menerangi orang-orang di sekitarmu.',
  },
  {
    id: 'aff-2',
    title: 'Pelukan Hangat di Saat Lelah',
    category: 'pelukan',
    from: 'Pesan Kasih Sayang',
    text: 'Qiya sayang, tidak apa-apa jika sesekali merasa lelah. Samudra pun ada saat pasang dan surutnya. Tarik napas perlahan, biarkan hatimu istirahat sejenak. Kamu tidak harus selalu sempurna untuk menjadi sosok yang dicintai. Kamu sudah lebih dari cukup apa adanya.',
  },
  {
    id: 'aff-3',
    title: 'Semua Mimpimu Pasti Terwujud',
    category: 'mimpi',
    from: 'Bintang Laut Keberuntungan',
    text: 'Tataplah ke depan dengan penuh keyakinan! Setiap impian dan harapan yang kamu simpan dalam doa sedang dirajut oleh takdir terbaik. Percayalah pada prosesmu, teruslah melangkah tanpa takut, karena alam semesta selalu berpihak pada hati yang berani bermimpi.',
  },
  {
    id: 'aff-4',
    title: 'Tersenyumlah, Hari Ini Milikmu',
    category: 'semangat',
    from: 'Yubi Si Hiu Baik Hati',
    text: 'Qiya, senyumanmu itu seperti cahaya mentari yang menembus hingga ke dasar samudra terdalam! Jadikan hari ini awal lembaran baru yang dipenuhi kejutan manis, tawa yang lepas, dan kedamaian tanpa batas. Kami selalu ada di sini untuk mendukungmu!',
  },
];

export const AffirmationPage: React.FC<AffirmationPageProps> = ({ onGoToWishes }) => {
  const [selectedAffirmation, setSelectedAffirmation] = useState<AffirmationItem>(AFFIRMATIONS[0]);
  const [displayedText, setDisplayedText] = useState('');
  const [isWriting, setIsWriting] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Handwriting typewriter effect
  useEffect(() => {
    setIsWriting(true);
    setDisplayedText('');
    const fullText = selectedAffirmation.text;
    let index = 0;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      index++;
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        // scratch sound effect every 4 characters
        if (index % 4 === 0) {
          soundEngine.playPenScratch();
        }
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsWriting(false);
      }
    }, 28);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedAffirmation]);

  const handleSelectAffirmation = (item: AffirmationItem) => {
    if (selectedAffirmation.id === item.id && isWriting) return;
    soundEngine.playBubblePop();
    setSelectedAffirmation(item);
  };

  const handleTransition = () => {
    soundEngine.playWishSend();
    setIsTransitioning(true);
    setTimeout(() => {
      onGoToWishes();
    }, 1200);
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
          <span>UNTAIAN KATA PENYEMANGAT HATI</span>
          <span>★</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-5xl text-[#f2f7f7] font-medium leading-tight mb-2">
          Surat Afirmasi Samudra untuk Qiya 📜
        </h1>
        <p className="font-quicksand text-xs sm:text-sm text-[#a5ced6] max-w-lg mx-auto">
          Pena tinta laut sedang menuliskan kata-kata dukungan tulus untuk menemani harimu.
        </p>
      </motion.div>

      {/* Affirmation Category Selector Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 font-quicksand">
        {AFFIRMATIONS.map((item) => (
          <button
            key={item.id}
            id={`btn-affirmation-${item.id}`}
            onClick={() => handleSelectAffirmation(item)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedAffirmation.id === item.id
                ? 'bg-[#dfb16e] text-[#07252f] shadow-lg shadow-[#dfb16e]/20 scale-105 border border-[#edd29b]/60'
                : 'bg-[#072732]/80 text-[#a5ced6] border border-[#397d8b]/50 hover:border-[#dfb16e] hover:bg-[#092b36]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{item.title}</span>
          </button>
        ))}
      </div>

      {/* Parchment Scroll Paper on Seabed */}
      <motion.div
        animate={
          isTransitioning
            ? { scale: [1, 0.8, 0.1], rotate: [0, 15, 360], opacity: [1, 0.7, 0] }
            : { y: [0, -4, 0] }
        }
        transition={
          isTransitioning
            ? { duration: 1.1, ease: 'easeInOut' }
            : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        }
        className="relative max-w-2xl mx-auto mb-10"
      >
        {/* Parchment Container */}
        <div className="relative bg-[#fdfbf7] text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border-8 border-[#f3ead7] overflow-hidden">
          {/* Paper Texture Lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#92400e_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top Vintage Ribbon / Seal */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-900/20 mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 tracking-wider font-serif-display uppercase">
              <span>🌊 PESAN SAMUDRA CINTA</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 font-quicksand">
              <Heart className="w-3 h-3 fill-rose-500" />
              <span>Untuk Qiya Tercinta</span>
            </div>
          </div>

          {/* Animated Quill Pen (Appears while writing) */}
          {isWriting && (
            <motion.div
              animate={{
                x: [0, 15, 0, 20, 5],
                y: [0, -6, 2, -4, 0],
                rotate: [0, 8, -4, 12, 0],
              }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="absolute top-6 right-6 text-amber-700 flex items-center gap-1.5 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 text-xs font-quicksand font-bold shadow-md"
            >
              <PenTool className="w-4 h-4 text-amber-800 animate-pulse" />
              <span>Sedang menulis...</span>
            </motion.div>
          )}

          {/* Title of Affirmation */}
          <h2 className="text-2xl sm:text-3xl font-medium font-serif-display text-amber-950 mb-4">
            {selectedAffirmation.title}
          </h2>

          {/* Body Text with Handwriting Font & Animation */}
          <div className="min-h-[160px] text-lg sm:text-2xl font-caveat text-amber-950 leading-relaxed font-semibold">
            {displayedText}
            {isWriting && (
              <span className="inline-block w-2.5 h-6 bg-amber-800 ml-1 animate-pulse align-middle" />
            )}
          </div>

          {/* Sender & Seal */}
          <div className="mt-8 pt-4 border-t border-amber-900/20 flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-800/80 font-medium font-quicksand">Tertanda hangat:</div>
              <div className="text-sm font-semibold font-serif-display text-amber-950">
                {selectedAffirmation.from}
              </div>
            </div>

            {/* Red Wax Seal Stamp with Shark Icon */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-600 to-red-700 shadow-md border-2 border-red-400 flex flex-col items-center justify-center text-white text-[9px] font-bold font-quicksand rotate-12">
              <span>🦈</span>
              <span className="scale-75 uppercase">YUBI</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Bottom Navigator: Go to Wish Bottle Page */}
      <div className="p-6 rounded-3xl bg-[#072732]/90 border border-[#397d8b]/60 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3 text-left">
          <SharkYubi size="sm" pose="happy" />
          <div>
            <div className="font-serif-display text-lg text-[#f2f7f7]">
              Sekarang giliran Qiya menabur impian! 🌟
            </div>
            <div className="text-xs text-[#a5ced6] font-quicksand">
              Tuliskan semua cita-cita dan harapan terbesarmu ke dalam Botol Harapan Samudra.
            </div>
          </div>
        </div>

        <button
          id="goto-wishes-btn"
          disabled={isTransitioning}
          onClick={handleTransition}
          className="px-8 py-3.5 sm:py-4 rounded-xl bg-[#dfb16e] hover:bg-[#eac47e] text-[#07252f] font-bold font-quicksand text-base shadow-[0_10px_25px_rgba(223,177,110,0.3)] transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 border border-[#edd29b]/50"
        >
          <span>Lanjut ke Botol Harapan & Cita-Cita 🍾</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
