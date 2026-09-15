import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';
import { Gift, Sparkles } from 'lucide-react';
import yubiSharkImg from '../../assets/images/yubi_tiny_shark_1789457830939.jpg';

interface IntroPageProps {
  onOpenGift: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onOpenGift }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [yubiWiggle, setYubiWiggle] = useState(false);

  const handleYubiTap = () => {
    soundEngine.playBubblePop();
    setYubiWiggle(true);
    setTimeout(() => setYubiWiggle(false), 600);
  };

  const handleGiftClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    soundEngine.playGiftUnwrap();

    // Celebratory sea-themed confetti burst
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#dfb16e', '#38bdf8', '#fb7185', '#ffffff', '#2dd4bf'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#dfb16e', '#fef08a', '#38bdf8'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#dfb16e', '#fef08a', '#fb7185'],
      });
    }, 250);

    setTimeout(() => {
      onOpenGift();
    }, 1100);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 select-none overflow-hidden">
      {/* Subtle deep ocean ambient background tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#062029]/70 via-[#07242e]/60 to-[#04161d]/90 pointer-events-none" />

      {/* Top Center Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center pt-2 sm:pt-4"
      >
        <p className="text-[#a4cbd4] text-xs sm:text-sm md:text-base font-medium tracking-wide">
          Ada hadiah kecil yang berenang jauh untuk sampai ke sini.
        </p>
      </motion.div>

      {/* Main Two-Column Content Area */}
      <div className="relative z-20 flex-1 flex items-center justify-center my-auto py-6">
        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          
          {/* Left Column: Circular Portrait of Yubi */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative flex flex-col items-center flex-shrink-0"
          >
            {/* Outer Circular Frame */}
            <motion.div
              animate={
                isOpening
                  ? { scale: [1, 1.08, 0.95, 1.05], rotate: [0, -3, 3, 0] }
                  : yubiWiggle
                  ? { rotate: [0, -6, 6, -3, 3, 0], scale: 1.04 }
                  : { y: [0, -8, 0] }
              }
              transition={{
                duration: isOpening ? 1 : yubiWiggle ? 0.6 : 5,
                repeat: isOpening || yubiWiggle ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              onClick={handleYubiTap}
              className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-92 md:h-92 rounded-full p-1.5 border-[4px] border-[#397d8b]/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-pointer group bg-[#072732]"
              title="Yubi the tiny shark (Klik untuk menyapa!)"
            >
              {/* Inner Circular Mask with Image */}
              <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner bg-[#0b3340]">
                <img
                  src={yubiSharkImg}
                  alt="Yubi the tiny shark"
                  className="w-full h-full object-cover pointer-events-none transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle light caustics overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07242e]/30 via-transparent to-white/10 pointer-events-none" />

                {/* Opening Celebration Glow */}
                <AnimatePresence>
                  {isOpening && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-tr from-amber-300/40 via-pink-400/30 to-cyan-300/40 mix-blend-screen"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Overlapping Badge at Bottom Center */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 px-6 py-2 rounded-xl bg-[#dfb16e] text-[#07252f] text-center shadow-xl border border-[#edd29b]/40 pointer-events-none min-w-[140px]">
                <div className="text-xs sm:text-sm font-extrabold tracking-[0.28em] uppercase leading-none">
                  Y U B I
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-[#07252f]/90 mt-0.5 tracking-wide">
                  the tiny shark
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Floating Letter Text & Action Button */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg lg:max-w-xl"
          >
            {/* Category Tag */}
            <div className="flex items-center gap-2 text-[#dfb16e] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-4">
              <span className="text-sm">★</span>
              <span>SURAT TERAPUNG</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-[#f2f7f7] font-medium leading-[1.22] tracking-tight mb-5">
              “Qiya, aku menemukan sesuatu untukmu.”
            </h1>

            {/* Instruction Body Paragraph */}
            <p className="text-[#a5ced6] text-base sm:text-lg leading-relaxed font-normal mb-8 max-w-md">
              Sentuh hadiah di siripku. Katanya, hadiah ini hanya mau terbuka untuk Qiya.
            </p>

            {/* Action Button */}
            <motion.button
              id="intro-open-gift-btn"
              onClick={handleGiftClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={isOpening}
              className="inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-xl bg-[#dfb16e] hover:bg-[#eac47e] text-[#07252f] font-bold text-base sm:text-lg shadow-[0_10px_25px_rgba(223,177,110,0.3)] transition-all cursor-pointer border border-[#edd29b]/50"
            >
              <Gift className="w-5 h-5 text-[#07252f]" />
              <span>{isOpening ? 'Membuka Hadiah...' : 'Buka hadiah rahasia'}</span>
              {isOpening && <Sparkles className="w-4 h-4 text-[#07252f] animate-spin" />}
            </motion.button>
          </motion.div>

        </div>
      </div>

      {/* Bottom Subtle Padding / Hint */}
      <div className="relative z-20 text-center pb-2 text-[11px] text-[#78a4ad]/60">
        Sentuh Yubi atau klik tombol untuk membuka hadiah
      </div>
    </div>
  );
};
