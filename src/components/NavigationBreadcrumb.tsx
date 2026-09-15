import React from 'react';
import { PageStage } from '../types';
import { soundEngine } from '../utils/audio';

interface NavigationBreadcrumbProps {
  currentStage: PageStage;
  onSelectStage: (stage: PageStage) => void;
}

interface Step {
  stage: PageStage;
  label: string;
  icon: string;
}

const STEPS: Step[] = [
  { stage: 'intro', label: 'Intro Yubi', icon: '🦈' },
  { stage: 'main', label: 'Ucapan & Game', icon: '🎂' },
  { stage: 'memories', label: 'Memori', icon: '📸' },
  { stage: 'affirmation', label: 'Afirmasi', icon: '📜' },
  { stage: 'wishes', label: 'Harapan', icon: '🍾' },
];

export const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  currentStage,
  onSelectStage,
}) => {
  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-3 pointer-events-none">
      <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 rounded-full p-1.5 shadow-2xl flex items-center gap-1 sm:gap-2">
        {STEPS.map((step) => {
          const isActive = currentStage === step.stage;
          return (
            <button
              key={step.stage}
              id={`nav-step-${step.stage}`}
              onClick={() => {
                soundEngine.playBubblePop();
                onSelectStage(step.stage);
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-quicksand transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30 scale-105'
                  : 'text-slate-400 hover:text-cyan-200 hover:bg-white/5'
              }`}
            >
              <span className="text-sm">{step.icon}</span>
              <span className="hidden md:inline">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
