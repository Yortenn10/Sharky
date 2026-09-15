/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageStage } from './types';
import { OceanBackground } from './components/OceanBackground';
import { AudioController } from './components/AudioController';
import { IntroPage } from './components/pages/IntroPage';
import { MainPage } from './components/pages/MainPage';
import { MemoryPage } from './components/pages/MemoryPage';
import { AffirmationPage } from './components/pages/AffirmationPage';
import { WishesPage } from './components/pages/WishesPage';

export default function App() {
  const [currentStage, setCurrentStage] = useState<PageStage>('intro');

  // Automatically scroll to the very top whenever the page/stage changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentStage]);

  return (
    <div className="relative min-h-screen text-slate-100 bg-[#061e27] overflow-x-hidden font-quicksand">
      {/* Dynamic Underwater Ambient Background */}
      <OceanBackground />

      {/* Floating Audio Controller (Ombak, Instrumen Tenang, Baby Shark, Mute Button) */}
      <AudioController />

      {/* Stage Routing with Motion Animations */}
      <main className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {currentStage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <IntroPage onOpenGift={() => setCurrentStage('main')} />
            </motion.div>
          )}

          {currentStage === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.5 }}
            >
              <MainPage onGoToMemories={() => setCurrentStage('memories')} />
            </motion.div>
          )}

          {currentStage === 'memories' && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.5 }}
            >
              <MemoryPage onGoToAffirmation={() => setCurrentStage('affirmation')} />
            </motion.div>
          )}

          {currentStage === 'affirmation' && (
            <motion.div
              key="affirmation"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.5 }}
            >
              <AffirmationPage onGoToWishes={() => setCurrentStage('wishes')} />
            </motion.div>
          )}

          {currentStage === 'wishes' && (
            <motion.div
              key="wishes"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.5 }}
            >
              <WishesPage onRestartExperience={() => setCurrentStage('intro')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

