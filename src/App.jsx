import React, { useState } from 'react';
import Header from './components/Header';
import IndicatorBar from './components/IndicatorBar';
import Card from './components/Card';
import ConsequenceModal from './components/ConsequenceModal';
import EndScreen from './components/EndScreen';
import IntroScreen from './components/IntroScreen';
import HandbookModal from './components/HandbookModal';
import LeaderboardRoom from './components/LeaderboardRoom';
import ConfirmModal from './components/ConfirmModal';

import { DILEMMAS, getShuffledDilemmas } from './data/dilemmas';
import { ENDINGS, getTitleByPerformance } from './data/endings';

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

  // Dilemmas with balanced & randomized A/B options
  const [dilemmas, setDilemmas] = useState(() => getShuffledDilemmas());

  // Modals & settings
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConfirmHomeOpen, setIsConfirmHomeOpen] = useState(false);

  // Multiplayer session context (if joined a room)
  const [multiplayerContext, setMultiplayerContext] = useState(null); // { session, playerId, playerName, roomCode }
  const [isSessionEndedByHost, setIsSessionEndedByHost] = useState(false);

  // Restart / Reset with fresh or seeded dilemmas
  const handleRestart = (seed = null) => {
    const activeSeed = seed !== undefined && seed !== null ? seed : (multiplayerContext?.roomCode || null);
    setDilemmas(getShuffledDilemmas(activeSeed));
    setStats(INITIAL_STATS);
    setCurrentQuarter(1);
    setCurrentResult(null);
    setActiveEnding(null);
    setGameStatus('playing');
  };

  // Start game from intro (solo mode)
  const handleStart = () => {
    setMultiplayerContext(null);
    setIsSessionEndedByHost(false);
    handleRestart(null);
  };

  // Start game triggered from joined multiplayer room
  const handleStartSoloWithSession = (sessionData) => {
    setMultiplayerContext(sessionData);
    setIsSessionEndedByHost(false);
    setIsLeaderboardOpen(false);

    // Listen for Host end session signal
    sessionData.session.onMessage((data) => {
      if (data.type === 'SESSION_END') {
        setIsSessionEndedByHost(true);
      }
    });

    handleRestart(sessionData.roomCode);
  };

  // Leave multiplayer session and return to solo
  const handleLeaveMultiplayer = () => {
    if (multiplayerContext?.session) {
      multiplayerContext.session.close();
    }
    setMultiplayerContext(null);
    setIsSessionEndedByHost(false);
    handleRestart(null);
  };

  // Request go home (prompts confirmation if active)
  const handleRequestGoHome = () => {
    if (gameStatus === 'intro') return;
    setIsConfirmHomeOpen(true);
  };

  // Confirm go home
  const handleConfirmGoHome = () => {
    if (multiplayerContext?.session) {
      multiplayerContext.session.close();
    }
    setMultiplayerContext(null);
    setIsSessionEndedByHost(false);
    setDilemmas(getShuffledDilemmas(null));
    setCurrentQuarter(1);
    setStats(INITIAL_STATS);
    setCurrentResult(null);
    setActiveEnding(null);
    setGameStatus('intro');
    setIsConfirmHomeOpen(false);
  };

  // Calculate new stats and check game over
  const handleMakeChoice = (choiceKey) => {
    const dilemma = dilemmas[currentQuarter - 1] || dilemmas[0];
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
    } else if (currentQuarter >= dilemmas.length) {
      triggeredEnding = ENDINGS.VICTORY;
    }

    const avgScore = Math.round((newStats.people + newStats.law + newStats.integrity + newStats.reform) / 4);
    const rankInfo = getTitleByPerformance(newStats, currentQuarter);

    // If connected to multiplayer room, broadcast live progress to Host screen
    if (multiplayerContext?.session) {
      if (triggeredEnding) {
        multiplayerContext.session.broadcast({
          type: 'PLAYER_FINISH',
          playerId: multiplayerContext.playerId,
          name: multiplayerContext.playerName,
          quartersSurvived: currentQuarter,
          stats: newStats,
          score: avgScore,
          rankTitle: rankInfo.title
        });
      } else {
        multiplayerContext.session.broadcast({
          type: 'PLAYER_PROGRESS',
          playerId: multiplayerContext.playerId,
          name: multiplayerContext.playerName,
          quarter: currentQuarter + 1,
          stats: newStats,
          status: 'playing',
          score: avgScore,
          rankTitle: rankInfo.title
        });
      }
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

  const currentDilemma = dilemmas[currentQuarter - 1] || dilemmas[0];

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between p-3 sm:p-5 relative overflow-x-hidden">
      {/* Main Container: Expanded to max-w-7xl for wide spacious 3-column cockpit layout */}
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between relative z-10">
        {gameStatus === 'intro' ? (
          <div className="my-auto max-w-lg mx-auto w-full">
            <IntroScreen 
              onStart={handleStart}
              onOpenHandbook={() => setIsHandbookOpen(true)}
              onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            />
          </div>
        ) : gameStatus === 'ended' && activeEnding ? (
          <div className="my-auto max-w-lg mx-auto w-full">
            <EndScreen
              ending={activeEnding}
              stats={stats}
              quartersSurvived={currentQuarter}
              onRestart={handleRestart}
              isMultiplayerSession={Boolean(multiplayerContext)}
              roomCode={multiplayerContext?.roomCode}
              playerName={multiplayerContext?.playerName}
              isSessionEndedByHost={isSessionEndedByHost}
              onLeaveMultiplayer={handleLeaveMultiplayer}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between py-2">
            {/* Top Area: Header & Indicator Bars (Centered) */}
            <div className="space-y-2.5 max-w-2xl mx-auto w-full">
              <Header
                currentQuarter={currentQuarter}
                totalQuarters={dilemmas.length}
                onOpenHandbook={() => setIsHandbookOpen(true)}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onRestart={handleRestart}
                onGoHome={handleRequestGoHome}
                multiplayerContext={multiplayerContext}
              />

              <IndicatorBar
                stats={stats}
              />
            </div>

            {/* Middle Area: 3-Column Split Card Playground */}
            <main className="my-auto py-2 w-full">
              <Card
                dilemma={currentDilemma}
                onMakeChoice={handleMakeChoice}
              />
            </main>

            {/* Bottom Tip for classroom */}
            <footer className="text-center text-xs text-amber-200/90 py-1.5 flex items-center justify-center gap-2 font-medium">
              {multiplayerContext ? (
                <span className="bg-amber-400/20 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-400/30 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Đang thi đấu phòng [{multiplayerContext.roomCode}] • Thí sinh: {multiplayerContext.playerName}</span>
                </span>
              ) : (
                <span className="bg-red-950/40 px-3.5 py-1 rounded-full border border-red-800/40 text-[11px] text-amber-100/80">
                  Giáo trình Tư tưởng Hồ Chí Minh: Chương 4 • Môn học Chính trị Đại học
                </span>
              )}
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

      {/* Classroom Leaderboard & Real-time Session Modal */}
      <LeaderboardRoom
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentQuarter={currentQuarter}
        stats={stats}
        onStartSoloWithSession={handleStartSoloWithSession}
      />

      {/* Navigation Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmHomeOpen}
        title="Quay Về Trang Chủ?"
        message={
          multiplayerContext
            ? `Bạn đang tham gia phòng thi đấu [${multiplayerContext.roomCode}] với tư cách là thí sinh "${multiplayerContext.playerName}". Rời phòng sẽ kết thúc phiên thi đấu này.`
            : `Bạn có chắc chắn muốn quay về màn hình giới thiệu không? Tiến trình nhiệm kỳ hiện tại (Quý ${currentQuarter}/16) sẽ được cài đặt lại từ đầu.`
        }
        confirmText={multiplayerContext ? "Rời phòng & Về trang chủ" : "Về trang chủ"}
        cancelText="Tiếp tục công vụ"
        isDanger={Boolean(multiplayerContext)}
        onConfirm={handleConfirmGoHome}
        onCancel={() => setIsConfirmHomeOpen(false)}
      />
    </div>
  );
}
