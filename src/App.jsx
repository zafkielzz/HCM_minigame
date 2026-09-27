import React, { useState } from 'react';
import Header from './components/Header';
import IndicatorBar from './components/IndicatorBar';
import Card from './components/Card';
import ConsequenceModal from './components/ConsequenceModal';
import EndScreen from './components/EndScreen';
import IntroScreen from './components/IntroScreen';
import HandbookModal from './components/HandbookModal';
import PresentationMode from './components/PresentationMode';

import { DILEMMAS } from './data/dilemmas';
import { ENDINGS } from './data/endings';

const INITIAL_STATS = {
  people: 60,
  law: 60,
  integrity: 60,
  reform: 60
};

export default function App() {
  const [gameStatus, setGameStatus] = useState('intro'); // 'intro' | 'playing' | 'ended'
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [currentResult, setCurrentResult] = useState(null);
  const [activeEnding, setActiveEnding] = useState(null);

  // Modals & settings
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Restart / Reset
  const handleRestart = () => {
    setStats(INITIAL_STATS);
    setCurrentQuarter(1);
    setCurrentResult(null);
    setActiveEnding(null);
    setGameStatus('playing');
  };

  // Start game from intro
  const handleStart = () => {
    handleRestart();
  };

  // Calculate new stats and check game over
  const handleMakeChoice = (choiceKey) => {
    const dilemma = DILEMMAS[currentQuarter - 1];
    const choice = choiceKey === 'left' ? dilemma.leftChoice : dilemma.rightChoice;
    const impact = choice.impact;

    const newStats = {
      people: Math.max(0, Math.min(100, stats.people + (impact.people || 0))),
      law: Math.max(0, Math.min(100, stats.law + (impact.law || 0))),
      integrity: Math.max(0, Math.min(100, stats.integrity + (impact.integrity || 0))),
      reform: Math.max(0, Math.min(100, stats.reform + (impact.reform || 0)))
    };

    setStats(newStats);

    // Check game over triggers
    let triggeredEnding = null;
    if (newStats.people <= 0) {
      triggeredEnding = ENDINGS.PEOPLE_ZERO;
    } else if (newStats.law <= 0) {
      triggeredEnding = ENDINGS.LAW_ZERO;
    } else if (newStats.integrity <= 0) {
      triggeredEnding = ENDINGS.INTEGRITY_ZERO;
    } else if (newStats.reform <= 0) {
      triggeredEnding = ENDINGS.REFORM_ZERO;
    } else if (newStats.people >= 90 && newStats.law <= 20) {
      triggeredEnding = ENDINGS.POPULISM_TRAP;
    } else if (newStats.law >= 90 && newStats.people <= 20) {
      triggeredEnding = ENDINGS.AUTHORITARIAN_TRAP;
    } else if (currentQuarter >= DILEMMAS.length) {
      triggeredEnding = ENDINGS.VICTORY;
    }

    // Set result to show consequence modal
    setCurrentResult({
      choiceKey,
      choice,
      dilemma,
      impact,
      nextEnding: triggeredEnding
    });
  };

  // Continue to next round after modal feedback
  const handleContinueAfterResult = () => {
    if (!currentResult) return;

    if (currentResult.nextEnding) {
      setActiveEnding(currentResult.nextEnding);
      setGameStatus('ended');
    } else {
      setCurrentQuarter((prev) => prev + 1);
    }

    setCurrentResult(null);
  };

  const currentDilemma = DILEMMAS[currentQuarter - 1] || DILEMMAS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-3 sm:p-5 relative overflow-x-hidden">
      {/* Main Container */}
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-between relative z-10">
        {gameStatus === 'intro' ? (
          <div className="my-auto">
            <IntroScreen 
              onStart={handleStart}
              onOpenHandbook={() => setIsHandbookOpen(true)}
            />
          </div>
        ) : gameStatus === 'ended' && activeEnding ? (
          <div className="my-auto">
            <EndScreen
              ending={activeEnding}
              stats={stats}
              quartersSurvived={currentQuarter}
              onRestart={handleRestart}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between py-2">
            {/* Top Area: Header & Indicator Bars */}
            <div className="space-y-2.5">
              <Header
                currentQuarter={currentQuarter}
                totalQuarters={DILEMMAS.length}
                onOpenHandbook={() => setIsHandbookOpen(true)}
                onOpenPresentation={() => setIsPresentationOpen(true)}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onRestart={handleRestart}
              />

              <IndicatorBar
                stats={stats}
              />
            </div>

            {/* Middle Area: Situation Card */}
            <main className="my-auto py-2">
              <Card
                dilemma={currentDilemma}
                onMakeChoice={handleMakeChoice}
              />
            </main>

            {/* Bottom Tip for classroom */}
            <footer className="text-center text-[11px] text-slate-500 py-1">
              Nhấn <strong className="text-amber-400">"Thuyết trình"</strong> ở trên nếu đang trình chiếu trên màn hình lớp học
            </footer>
          </div>
        )}
      </div>

      {/* Feedback Consequence Modal */}
      <ConsequenceModal
        result={currentResult}
        onContinue={handleContinueAfterResult}
      />

      {/* Curriculum Reference Handbook Modal */}
      <HandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      {/* Classroom Presentation Mode Modal */}
      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        currentDilemma={currentDilemma}
        onMakeChoice={handleMakeChoice}
      />
    </div>
  );
}
