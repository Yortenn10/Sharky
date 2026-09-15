import React, { useEffect, useState } from 'react';
import { soundEngine } from '../utils/audio';

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}

export const OceanBackground: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate initial ambient bubbles
    const generated: Bubble[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 26) + 12,
      left: Math.random() * 96 + 2,
      duration: Math.random() * 9 + 8,
      delay: Math.random() * 7,
    }));
    setBubbles(generated);
  }, []);

  const popBubble = (id: number) => {
    soundEngine.playBubblePop();
    setBubbles((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              size: Math.floor(Math.random() * 26) + 12,
              left: Math.random() * 96 + 2,
              duration: Math.random() * 9 + 8,
              delay: 0,
            }
          : b
      )
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gradient-to-b from-[#021526] via-[#032b49] to-[#011425]">
      {/* Sunlight rays caustics penetrating from ocean surface */}
      <div className="absolute inset-0 ocean-caustics opacity-40 mix-blend-screen pointer-events-none" />

      {/* Sunbeams */}
      <div className="absolute top-0 left-1/4 w-36 h-full light-beam opacity-30 pointer-events-none rotate-6" />
      <div className="absolute top-0 right-1/4 w-48 h-full light-beam opacity-25 pointer-events-none -rotate-12" />
      <div className="absolute top-0 left-2/3 w-32 h-full light-beam opacity-20 pointer-events-none rotate-3" />

      {/* Ambient Rising Bubbles (Clickable!) */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          id={`bubble-${b.id}`}
          onClick={(e) => {
            e.stopPropagation();
            popBubble(b.id);
          }}
          className="bubble-particle pointer-events-auto cursor-pointer transition-transform hover:scale-125 active:scale-75"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
          title="Klik gelembung untuk meletupkan!"
        />
      ))}

      {/* Swaying Kelp / Seaweed at the bottom */}
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none flex justify-between items-end px-4 sm:px-12 opacity-40">
        {/* Kelp left */}
        <svg viewBox="0 0 120 180" className="w-24 sm:w-32 h-36 animate-[wave_6s_ease-in-out_infinite] origin-bottom">
          <path
            d="M50 180 Q30 130 65 90 Q30 50 60 10 Q70 50 45 90 Q80 130 60 180 Z"
            fill="#10b981"
            opacity="0.8"
          />
          <path
            d="M30 180 Q10 140 40 100 Q15 60 35 25 Q45 60 25 100 Q50 140 38 180 Z"
            fill="#059669"
            opacity="0.6"
          />
        </svg>

        {/* Coral Center-Right */}
        <svg viewBox="0 0 140 100" className="w-28 sm:w-36 h-28 opacity-60">
          <path
            d="M20 100 C20 70 30 50 45 55 C55 60 50 40 65 30 C75 20 85 35 85 50 C95 35 110 45 110 65 C115 55 125 60 125 100 Z"
            fill="#f43f5e"
          />
          <circle cx="95" cy="45" r="4" fill="#fb7185" />
          <circle cx="65" cy="55" r="3" fill="#fecdd3" />
        </svg>

        {/* Kelp right */}
        <svg viewBox="0 0 120 180" className="w-24 sm:w-32 h-40 animate-[wave_7s_ease-in-out_infinite_alternate] origin-bottom">
          <path
            d="M60 180 Q80 130 45 90 Q80 50 50 10 Q40 50 65 90 Q30 130 50 180 Z"
            fill="#0d9488"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Seabed Sandy Silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#02101e] to-transparent pointer-events-none" />
    </div>
  );
};
