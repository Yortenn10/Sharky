import React from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../utils/audio';

interface SharkYubiProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pose?: 'swimming' | 'givingGift' | 'happy' | 'waving';
  showPartyHat?: boolean;
  showGift?: boolean;
  onGiftClick?: () => void;
  className?: string;
  speechBubble?: string;
}

export const SharkYubi: React.FC<SharkYubiProps> = ({
  size = 'md',
  pose = 'swimming',
  showPartyHat = true,
  showGift = false,
  onGiftClick,
  className = '',
  speechBubble,
}) => {
  const [clicked, setClicked] = React.useState(false);

  const scaleMap = {
    sm: 'w-24 h-24 sm:w-28 sm:h-28',
    md: 'w-44 h-44 sm:w-52 sm:h-52',
    lg: 'w-64 h-64 sm:w-72 sm:h-72',
    xl: 'w-80 h-80 sm:w-96 sm:h-96',
  };

  const handleYubiClick = () => {
    soundEngine.playBubblePop();
    setClicked(true);
    setTimeout(() => setClicked(false), 800);
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble if present */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-3 z-30 max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl bg-white/95 text-slate-800 text-sm sm:text-base font-medium shadow-xl border border-sky-100 backdrop-blur-sm text-center font-quicksand"
        >
          <span className="font-bold text-sky-800 font-serif-display text-base">Yubi: </span>
          <span>{speechBubble}</span>
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
        </motion.div>
      )}

      {/* Main Shark Container */}
      <motion.div
        animate={
          clicked
            ? { rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.12, 1] }
            : pose === 'givingGift'
            ? { y: [0, -8, 0], rotate: [0, -1, 1, 0] }
            : pose === 'happy'
            ? { y: [0, -15, 0], rotate: [-2, 2, -2] }
            : { y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] }
        }
        transition={{
          repeat: clicked ? 0 : Infinity,
          duration: pose === 'happy' ? 2 : 4,
          ease: 'easeInOut',
        }}
        onClick={handleYubiClick}
        className={`relative cursor-pointer ${scaleMap[size]}`}
        title="Hiu Yubi! Klik aku!"
      >
        <svg
          viewBox="0 0 320 260"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Shark Body Gradient */}
            <linearGradient id="sharkSkin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Belly Gradient */}
            <linearGradient id="sharkBelly" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>

            {/* Gift Box Gradient */}
            <linearGradient id="giftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>

            {/* Ribbon Gradient */}
            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="yubiGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Tail Fin (Back with wave animation) */}
          <motion.g
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            style={{ transformOrigin: '70px 130px' }}
          >
            <path
              d="M75 130 C45 95 10 70 5 85 C2 95 25 125 45 130 C20 135 2 165 5 175 C10 188 45 165 75 130 Z"
              fill="url(#sharkSkin)"
            />
          </motion.g>

          {/* Left Pectoral Fin (Behind) */}
          <path
            d="M130 155 C120 185 105 200 95 195 C85 190 95 170 115 150 Z"
            fill="#0284c7"
          />

          {/* Main Shark Body */}
          <path
            d="M60 130 C70 95 120 65 180 65 C240 65 295 95 305 130 C308 145 295 175 250 185 C190 198 115 190 60 130 Z"
            fill="url(#sharkSkin)"
          />

          {/* Dorsal Fin (Top) */}
          <path
            d="M165 67 C175 30 200 15 210 22 C216 26 210 50 205 67 Z"
            fill="#0284c7"
          />

          {/* Belly (Cute Cream White) */}
          <path
            d="M110 155 C150 160 210 160 260 145 C275 152 280 160 250 178 C200 192 140 185 110 155 Z"
            fill="url(#sharkBelly)"
          />

          {/* Gill Marks (3 cute subtle curved stripes) */}
          <g stroke="#0369a1" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
            <path d="M195 115 C198 123 198 132 195 140" />
            <path d="M202 117 C205 124 205 131 202 138" />
            <path d="M209 119 C212 125 212 130 209 136" />
          </g>

          {/* Eye - Big, Cute, Sparkly */}
          <g transform="translate(240, 108)">
            {/* Eye socket / white */}
            <circle cx="0" cy="0" r="16" fill="#ffffff" />
            {/* Iris / Pupil */}
            <circle cx="2" cy="0" r="12" fill="#0f172a" />
            {/* Big Sparkle Highlight */}
            <circle cx="5" cy="-3" r="5" fill="#ffffff" />
            <circle cx="-1" cy="4" r="2.5" fill="#ffffff" />
            {/* Sweet curved eyelid/brow */}
            <path
              d="M-14 -12 C-6 -18 10 -15 16 -10"
              fill="none"
              stroke="#0369a1"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* Blushing Cheeks */}
          <ellipse
            cx="260"
            cy="135"
            rx="9"
            ry="6"
            fill="#fb7185"
            opacity="0.75"
          />

          {/* Smiling Mouth */}
          <g transform="translate(262, 142)">
            <path
              d="M-5 0 C5 14 22 14 28 -2"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Tiny cute sharp tooth */}
            <polygon points="10,5 15,12 18,5" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
          </g>

          {/* Front Right Pectoral Fin (Flapping) */}
          <motion.g
            animate={
              pose === 'waving'
                ? { rotate: [-15, 25, -15] }
                : { rotate: [-5, 10, -5] }
            }
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{ transformOrigin: '175px 155px' }}
          >
            <path
              d="M175 150 C180 185 165 215 150 210 C140 205 145 175 165 148 Z"
              fill="url(#sharkSkin)"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
          </motion.g>

          {/* Birthday Party Hat */}
          {showPartyHat && (
            <g transform="translate(195, 30) rotate(12)">
              {/* Hat Cone */}
              <polygon points="0,0 24,-55 48,0" fill="#f43f5e" />
              {/* Colorful stripes */}
              <polygon points="6,-14 24,-55 42,-14" fill="#fbbf24" />
              <polygon points="12,-28 24,-55 36,-28" fill="#38bdf8" />
              <polygon points="18,-42 24,-55 30,-42" fill="#a855f7" />
              {/* Fluffy Pom-Pom on Top */}
              <circle cx="24" cy="-58" r="8" fill="#fef08a" />
              {/* Hat rim sparkles */}
              <ellipse cx="24" cy="0" rx="25" ry="4" fill="#fb7185" />
            </g>
          )}

          {/* Little Floating Heart when clicked */}
          {clicked && (
            <motion.g
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <path
                d="M260 70 C260 60 250 55 242 62 C234 55 224 60 224 70 C224 85 242 98 242 98 C242 98 260 85 260 70 Z"
                fill="#f43f5e"
              />
            </motion.g>
          )}
        </svg>

        {/* Interactive Glowing Gift Box (if showGift is true) */}
        {showGift && (
          <motion.div
            id="yubi-gift-box"
            animate={{
              scale: [1, 1.08, 1],
              y: [0, -6, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            onClick={(e) => {
              e.stopPropagation();
              onGiftClick?.();
            }}
            className="absolute -right-2 bottom-4 sm:right-2 sm:bottom-6 cursor-pointer group z-20"
            title="Klik Kado Ini untuk Qiya!"
          >
            {/* Glowing aura */}
            <div className="absolute inset-0 bg-pink-400 rounded-2xl filter blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />

            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 rounded-2xl shadow-2xl border-2 border-pink-200 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
              {/* Ribbon Vertical */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-400 shadow-sm" />
              {/* Ribbon Horizontal */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-sm" />

              {/* Big Ribbon Bow on Top */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-amber-300 border-2 border-yellow-100 shadow-md animate-bounce" />
                <div className="absolute -left-2 w-4 h-3 rounded-full bg-amber-400 rotate-[-30deg]" />
                <div className="absolute -right-2 w-4 h-3 rounded-full bg-amber-400 rotate-[30deg]" />
              </div>

              {/* Sparkle badge */}
              <div className="relative z-10 text-[10px] sm:text-xs font-bold font-quicksand bg-white/95 text-[#07252f] px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap animate-pulse border border-[#dfb16e]">
                🎁 Buka Kado!
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
