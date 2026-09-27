import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Users, Play, StopCircle, RefreshCw, X, Check, Copy, 
  Crown, AlertCircle, ArrowRight, ArrowLeft, UserCheck, Flame, ClipboardList,
  Eye, EyeOff, Lock, LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  MultiplayerSession, 
  DEFAULT_HOST_ROOM_CODE,
  generateRoomCode, 
  verifyRoom, 
  registerHostRoom, 
  updateHostRoomStatus, 
  unregisterHostRoom 
} from '../utils/multiplayer';
import { playSound } from '../utils/sound';

export default function LeaderboardRoom({ 
  isOpen, 
  onClose, 
  onStartSoloWithSession,
  multiplayerContext,
  isSessionEndedByHost = false,
  syncedPlayersList = [],
  onLeaveMultiplayer
}) {
  const ADMIN_PASSWORD = 'namngo001';
  const [mode, setMode] = useState('select'); // 'select' | 'host' | 'join' | 'summary'
  const [roomCode, setRoomCode] = useState(() => multiplayerContext?.roomCode || '');
  const [playerName, setPlayerName] = useState(() => {
    if (multiplayerContext?.playerName) return multiplayerContext.playerName;
    try {
      return localStorage.getItem('hcm_player_name') || '';
    } catch (e) {
      return '';
    }
  });
  const [playerId] = useState(() => {
    if (multiplayerContext?.playerId) return multiplayerContext.playerId;
    try {
      let id = localStorage.getItem('hcm_player_id');
      if (!id) {
        id = 'p_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('hcm_player_id', id);
      }
      return id;
    } catch (e) {
      return 'p_' + Math.random().toString(36).substring(2, 9);
    }
  });
  
  // Admin Host Authentication
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(null);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Host state
  const [hostPhase, setHostPhase] = useState('lobby'); // 'lobby' | 'live' | 'summary'
  const [players, setPlayers] = useState({}); // { [playerId]: { name, quarter, stats, status, score, rankTitle } }
  
  // Client synchronized state
  const [externalPlayersList, setExternalPlayersList] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [isVerifyingRoom, setIsVerifyingRoom] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedRankingReport, setCopiedRankingReport] = useState(false);
  const sessionRef = useRef(null);

  // Auto-switch to summary when host ends session
  useEffect(() => {
    if (isSessionEndedByHost || (syncedPlayersList && syncedPlayersList.length > 0)) {
      setMode('summary');
    }
  }, [isSessionEndedByHost, syncedPlayersList]);

  // Clean up session on close
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.close();
      }
    };
  }, []);

  // Announce and refresh presence for student while in lobby waiting
  useEffect(() => {
    let joinHeartbeat = null;
    if (mode === 'join' && !sessionStarted && sessionRef.current) {
      joinHeartbeat = setInterval(() => {
        if (sessionRef.current && mode === 'join' && !sessionStarted) {
          sessionRef.current.broadcast({
            type: 'PLAYER_JOIN',
            playerId,
            name: playerName.trim()
          });
        }
      }, 2500);
    }
    return () => {
      if (joinHeartbeat) clearInterval(joinHeartbeat);
    };
  }, [mode, sessionStarted, playerId, playerName]);

  // Auto-send PLAYER_LEAVE if student closes or reloads browser while waiting in lobby
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (mode === 'join' && !sessionStarted && sessionRef.current) {
        sessionRef.current.broadcast({
          type: 'PLAYER_LEAVE',
          playerId,
          name: playerName.trim()
        });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mode, sessionStarted, playerId, playerName]);

  // Host automatically prunes disconnected players in lobby who haven't sent a heartbeat for > 15s
  useEffect(() => {
    let pruneTimer = null;
    if (mode === 'host' && hostPhase === 'lobby') {
      pruneTimer = setInterval(() => {
        const now = Date.now();
        setPlayers((prev) => {
          let changed = false;
          const next = {};
          for (const [id, p] of Object.entries(prev)) {
            // Heartbeat is sent every 2.5s. If no heartbeat for > 15s, player closed tab / disconnected
            if (p.lastSeen && (now - p.lastSeen > 15000)) {
              changed = true;
            } else {
              next[id] = p;
            }
          }
          return changed ? next : prev;
        });
      }, 3000);
    }
    return () => {
      if (pruneTimer) clearInterval(pruneTimer);
    };
  }, [mode, hostPhase]);

  // Admin Host form submit
  const handleCreateHostSubmit = (e) => {
    e.preventDefault();
    setAdminError(null);

    if (adminPassword.trim() !== ADMIN_PASSWORD) {
      playSound('stamp');
      setAdminError('Mật khẩu Admin không chính xác!');
      return;
    }

    handleCreateHost();
  };

  // Initialize Host Room
  const handleCreateHost = () => {
    if (adminPassword.trim() !== ADMIN_PASSWORD) {
      playSound('stamp');
      setAdminError('Mật khẩu Admin không chính xác!');
      return;
    }

    const code = generateRoomCode();
    setRoomCode(code);
    setMode('host');
    setHostPhase('lobby');
    setPlayers({});

    registerHostRoom(code, 'lobby');

    const session = new MultiplayerSession(code, true);
    session.setStatus('lobby');
    sessionRef.current = session;

    session.onMessage((data) => {
      if (data.type === 'PLAYER_JOIN') {
        // Strict lock: Reject if host already started or ended session
        if (sessionRef.current?.status !== 'lobby') {
          return;
        }
        const trimmedName = (data.name || '').trim();
        if (!trimmedName || !data.playerId) return;

        setPlayers((prev) => {
          const next = {};
          let isBrandNew = true;
          const targetLower = trimmedName.toLowerCase();

          for (const [id, p] of Object.entries(prev)) {
            const matchId = id === data.playerId;
            const matchName = p.name && p.name.trim().toLowerCase() === targetLower;

            if (matchId || matchName) {
              // Existing player rejoining or heartbeat! Do NOT duplicate!
              isBrandNew = false;
              // Drop old key if ID changed, will re-insert with data.playerId below
            } else {
              next[id] = p;
            }
          }

          next[data.playerId] = {
            name: trimmedName,
            quarter: 1,
            stats: { people: 60, law: 60, integrity: 60, reform: 60 },
            status: 'waiting',
            score: 60,
            rankTitle: 'Ứng viên',
            lastSeen: Date.now()
          };

          if (isBrandNew) {
            playSound('select');
          }
          return next;
        });
      } else if (data.type === 'PLAYER_LEAVE') {
        const targetId = data.playerId;
        const targetName = (data.name || '').trim().toLowerCase();

        setPlayers((prev) => {
          const next = {};
          for (const [id, p] of Object.entries(prev)) {
            const matchId = id === targetId;
            const matchName = targetName && p.name && p.name.trim().toLowerCase() === targetName;
            if (sessionRef.current?.status === 'lobby') {
              // In lobby, completely remove leaving player
              if (!matchId && !matchName) {
                next[id] = p;
              }
            } else {
              // In live / summary, mark status as 'left'
              if (matchId || matchName) {
                next[id] = { ...p, status: 'left' };
              } else {
                next[id] = p;
              }
            }
          }
          return next;
        });
      } else if (data.type === 'PLAYER_PROGRESS') {
        setPlayers((prev) => ({
          ...prev,
          [data.playerId]: {
            ...(prev[data.playerId] || {}),
            name: data.name,
            quarter: data.quarter,
            stats: data.stats,
            status: data.status,
            score: data.score || 60,
            rankTitle: data.rankTitle || 'Cán bộ'
          }
        }));
      } else if (data.type === 'PLAYER_FINISH') {
        setPlayers((prev) => ({
          ...prev,
          [data.playerId]: {
            ...(prev[data.playerId] || {}),
            name: data.name,
            quarter: data.quartersSurvived,
            stats: data.stats,
            status: data.quartersSurvived >= 16 ? 'finished' : 'failed',
            score: data.score,
            rankTitle: data.rankTitle
          }
        }));
      }
    });
  };

  // Host starts the session & automatically locks the room to latecomers
  const handleHostStart = () => {
    if (sessionRef.current) {
      sessionRef.current.setStatus('live');
      sessionRef.current.broadcast({ 
        type: 'SESSION_START',
        roomCode,
        status: 'live',
        hostTime: Date.now()
      });
      setHostPhase('live');
      playSound('select');
    }
  };

  // Host ends and summarizes the session (broadcasts full synchronized leaderboard)
  const handleHostEnd = () => {
    if (sessionRef.current) {
      sessionRef.current.setStatus('summary');
      const sorted = Object.entries(players)
        .map(([id, p]) => ({ id, ...p }))
        .sort((a, b) => {
          if (b.quarter !== a.quarter) return b.quarter - a.quarter;
          return (b.score || 0) - (a.score || 0);
        });

      const playersList = sorted.map((p, idx) => ({
        id: p.id,
        name: p.name,
        quarter: p.quarter,
        score: p.score,
        status: p.status,
        rankTitle: p.rankTitle || 'Cán bộ',
        rank: idx + 1
      }));

      sessionRef.current.broadcast({ 
        type: 'SESSION_END',
        roomCode,
        status: 'summary',
        playersList,
        hostTime: Date.now()
      });
      setHostPhase('summary');
      playSound('victory');
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  };

  // Student joins a room with verification
  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setJoinError(null);
    const trimmedName = playerName.trim();
    const trimmedCode = roomCode.trim().toUpperCase();

    if (!trimmedName) {
      setJoinError('Vui lòng nhập Nickname.');
      return;
    }
    if (!trimmedCode) {
      setJoinError('Vui lòng nhập Mã phòng.');
      return;
    }

    setIsVerifyingRoom(true);

    try {
      const check = await verifyRoom(trimmedCode);
      if (!check.valid) {
        playSound('stamp');
        setJoinError(check.message);
        setIsVerifyingRoom(false);
        return;
      }

      const activeCode = check.code || trimmedCode;
      setRoomCode(activeCode);
      setMode('join');
      playSound('select');

      const session = new MultiplayerSession(activeCode, false, check.sessionId);
      sessionRef.current = session;

      try {
        localStorage.setItem('hcm_player_name', trimmedName);
      } catch (err) {}

      // Send join message
      session.broadcast({
        type: 'PLAYER_JOIN',
        playerId,
        name: trimmedName,
        sessionId: check.sessionId
      });

      // Listen for Host signals
      let sessionStartHandled = false;
      session.onMessage((data) => {
        if (data.type === 'SESSION_START' && !sessionStartHandled) {
          sessionStartHandled = true;
          setSessionStarted(true);
          playSound('select');
          onClose(); // Auto-close modal immediately so the question card is displayed!
          if (onStartSoloWithSession) {
            onStartSoloWithSession({
              session,
              playerId,
              playerName: trimmedName,
              roomCode: activeCode,
              sessionId: data.sessionId || check.sessionId
            });
          }
        } else if (data.type === 'SESSION_END') {
          if (data.playersList) {
            setExternalPlayersList(data.playersList);
          }
          setMode('summary');
          playSound('victory');
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 }
          });
        }
      });
    } catch (err) {
      setJoinError('Không thể kết nối đến phòng thi đấu.');
    } finally {
      setIsVerifyingRoom(false);
    }
  };

  // Sort host players for lobby & live views
  const hostPlayersList = Object.entries(players)
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => {
      if (b.quarter !== a.quarter) return b.quarter - a.quarter;
      return (b.score || 0) - (a.score || 0);
    });

  // Explicit sortedPlayers reference ensures host lobby & live table NEVER crash
  const sortedPlayers = hostPlayersList;

  // Sort players for leaderboard:
  // Priority: 1. syncedPlayersList from props | 2. externalPlayersList from SSE | 3. host local players
  const rawList = (syncedPlayersList && syncedPlayersList.length > 0)
    ? syncedPlayersList
    : (externalPlayersList && externalPlayersList.length > 0)
      ? externalPlayersList
      : hostPlayersList;

  const effectivePlayersList = (syncedPlayersList && syncedPlayersList.length > 0) || (externalPlayersList && externalPlayersList.length > 0)
    ? [...rawList].sort((a, b) => {
        if (b.quarter !== a.quarter) return b.quarter - a.quarter;
        return (b.score || 0) - (a.score || 0);
      })
    : hostPlayersList;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy full summary report for professor / submission
  const handleCopyRankingReport = () => {
    const activeCode = roomCode || multiplayerContext?.roomCode || DEFAULT_HOST_ROOM_CODE;
    let report = `🇻🇳 [BẢNG TỔNG KẾT ĐẤU PHÒNG - MÔN TƯ TƯỞNG HỒ CHÍ MINH]\n`;
    report += `Phòng thi đấu: ${activeCode} | Tổng số thí sinh: ${effectivePlayersList.length}\n`;
    report += `------------------------------------------------------\n`;

    effectivePlayersList.forEach((p, idx) => {
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
      const statusText = p.status === 'finished' || p.quarter >= 16 
        ? 'Hoàn thành 16 Quý' 
        : `Bãi miễn tại Quý ${p.quarter}/16`;
      report += `${medal} ${p.name} | ${statusText} | Điểm: ${p.score}đ | Danh hiệu: ${p.rankTitle || 'Cán bộ'}\n`;
    });

    navigator.clipboard.writeText(report);
    setCopiedRankingReport(true);
    setTimeout(() => setCopiedRankingReport(false), 2500);
  };

  // Check personal student rank for spotlight
  const currentMyName = multiplayerContext?.playerName || playerName;
  const currentMyId = multiplayerContext?.playerId || playerId;
  const myRankIndex = effectivePlayersList.findIndex(
    p => (currentMyId && p.id === currentMyId) || (currentMyName && p.name === currentMyName)
  );
  const myRankInfo = myRankIndex !== -1 
    ? { ...effectivePlayersList[myRankIndex], calculatedRank: myRankIndex + 1 }
    : null;

  const isSummaryView = mode === 'summary' || isSessionEndedByHost || (mode === 'host' && hostPhase === 'summary');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col justify-between my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            {mode !== 'select' && !isSessionEndedByHost && mode !== 'summary' && (
              <button
                onClick={() => {
                  if (sessionRef.current) {
                    if (mode === 'join') {
                      sessionRef.current.broadcast({
                        type: 'PLAYER_LEAVE',
                        playerId,
                        name: playerName.trim()
                      });
                    }
                    sessionRef.current.close();
                    sessionRef.current = null;
                  }
                  setMode('select');
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors mr-0.5"
                title="Quay lại"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="title-1st text-slate-900 text-base sm:text-lg">
              {isSummaryView ? 'KẾT QUẢ ĐẤU PHÒNG LỚP HỌC' : 'ĐẤU PHÒNG LỚP HỌC'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIEW 1: SUMMARY / SYNCHRONIZED LEADERBOARD (Available for both Host and Student) */}
        {isSummaryView ? (
          <div className="py-4 space-y-4 overflow-y-auto">
            {/* Summary Top Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-0.5">
                  Phòng thi đấu:
                </span>
                <div className="flex items-center gap-2">
                  <span className="title-2nd text-red-600 tracking-wider">
                    {roomCode || multiplayerContext?.roomCode || DEFAULT_HOST_ROOM_CODE}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-300 text-blue-800 text-[11px] font-bold">
                    <span>🏁 PHIÊN ĐÃ KẾT THÚC</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyRankingReport}
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-300 shadow-sm w-full sm:w-auto"
                >
                  {copiedRankingReport ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedRankingReport ? 'Đã sao chép!' : 'Sao chép bảng điểm'}</span>
                </button>

                {mode === 'host' && (
                  <button
                    onClick={() => {
                      setHostPhase('lobby');
                      setPlayers({});
                      if (sessionRef.current) {
                        sessionRef.current.resetSession();
                      }
                    }}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md w-full sm:w-auto shrink-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Mở Lượt Chơi Mới</span>
                  </button>
                )}
              </div>
            </div>

            {/* Personal Result Spotlight (For Student Phone) */}
            {myRankInfo && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm animate-fadeIn">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md shrink-0">
                    {myRankInfo.calculatedRank === 1 ? '🥇' : myRankInfo.calculatedRank === 2 ? '🥈' : myRankInfo.calculatedRank === 3 ? '🥉' : `#${myRankInfo.calculatedRank}`}
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                      <span>{myRankInfo.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold uppercase">Bạn</span>
                    </div>
                    <div className="text-slate-600 text-xs mt-0.5">
                      Hạng <strong>#{myRankInfo.calculatedRank}</strong> / {effectivePlayersList.length} thí sinh • Quý <strong>{myRankInfo.quarter}/16</strong> • Danh hiệu: <strong className="text-amber-700">{myRankInfo.rankTitle || 'Cán bộ'}</strong>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-200">
                  <div className="text-lg font-black text-amber-800 font-mono">{myRankInfo.score} đ</div>
                  <div className="text-[10px] text-slate-500">Điểm cân bằng</div>
                </div>
              </div>
            )}

            {/* Podium Top 3 */}
            <div className="grid grid-cols-3 gap-2 text-center py-4 bg-slate-50 rounded-2xl border border-slate-200">
              {/* Rank 2 */}
              <div className="flex flex-col items-center justify-end p-2">
                <span className="text-3xl mb-1">🥈</span>
                <span className="text-xs font-bold text-slate-800 truncate max-w-[90px]">
                  {effectivePlayersList[1]?.name || '---'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {effectivePlayersList[1] ? `Quý ${effectivePlayersList[1].quarter}/16 • ${effectivePlayersList[1].score}đ` : ''}
                </span>
                <div className="w-full h-16 bg-slate-200 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-700 text-sm">
                  #2
                </div>
              </div>

              {/* Rank 1 (Crown) */}
              <div className="flex flex-col items-center justify-end p-2 -translate-y-2">
                <span className="text-4xl mb-1 animate-bounce">👑</span>
                <span className="text-sm font-black text-amber-800 truncate max-w-[110px]">
                  {effectivePlayersList[0]?.name || '---'}
                </span>
                <span className="text-xs text-amber-700 font-mono font-bold">
                  {effectivePlayersList[0] ? `Quý ${effectivePlayersList[0].quarter}/16 • ${effectivePlayersList[0].score}đ` : ''}
                </span>
                <div className="w-full h-24 bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-amber-500/20">
                  QUÁN QUÂN
                </div>
              </div>

              {/* Rank 3 */}
              <div className="flex flex-col items-center justify-end p-2">
                <span className="text-3xl mb-1">🥉</span>
                <span className="text-xs font-bold text-slate-800 truncate max-w-[90px]">
                  {effectivePlayersList[2]?.name || '---'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {effectivePlayersList[2] ? `Quý ${effectivePlayersList[2].quarter}/16 • ${effectivePlayersList[2].score}đ` : ''}
                </span>
                <div className="w-full h-12 bg-slate-200 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-700 text-sm">
                  #3
                </div>
              </div>
            </div>

            {/* FULL RANKING TABLE */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-800">
                  <ClipboardList className="w-4 h-4 text-amber-600" />
                  <span>Bảng Điểm Toàn Bộ Thí Sinh ({effectivePlayersList.length})</span>
                </div>
              </div>

              <div className="max-h-64 sm:max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0 backdrop-blur-sm">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">Hạng</th>
                      <th className="py-2.5 px-3">Nickname</th>
                      <th className="py-2.5 px-3 text-center">Số Kỳ Đã Trải Qua</th>
                      <th className="py-2.5 px-3 text-center">Kết Quả Nhiệm Kỳ</th>
                      <th className="py-2.5 px-3 text-right">Điểm Số</th>
                      <th className="py-2.5 px-3 text-left hidden sm:table-cell">Danh Hiệu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {effectivePlayersList.map((p, idx) => {
                      const isMe = (currentMyId && p.id === currentMyId) || (currentMyName && p.name === currentMyName);
                      return (
                        <tr 
                          key={p.id || idx} 
                          className={isMe ? "bg-amber-100/70 border-l-4 border-amber-500 font-bold" : "hover:bg-slate-50"}
                        >
                          <td className="py-2.5 px-3 text-center font-black">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {isMe && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                                Bạn
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-700">
                            {p.quarter} / 16 Quý
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {p.status === 'finished' || p.quarter >= 16 ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                                🏆 Hoàn thành 16 Quý
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                                🛑 Bãi miễn tại Quý {p.quarter}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900">
                            {p.score} đ
                          </td>
                          <td className="py-2.5 px-3 text-left text-slate-500 text-[11px] hidden sm:table-cell">
                            {p.rankTitle || 'Cán bộ'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions for student */}
            {mode !== 'host' && (
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Xem Lại Báo Cáo Nhiệm Kỳ Cá Nhân
                </button>
                {onLeaveMultiplayer && (
                  <button
                    onClick={() => {
                      onLeaveMultiplayer();
                      onClose();
                    }}
                    className="w-full sm:w-auto py-2.5 px-4 bg-white hover:bg-slate-50 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Rời phòng & Về trang chủ</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : mode === 'select' ? (
          /* Mode 1: Select Screen */
          <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Host Card (Protected with Admin Password) */}
            <div className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 border border-amber-200">
                  <Crown className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="title-1st text-lg text-slate-900">
                    TẠO PHÒNG
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                    ADMIN
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  Dành riêng cho nhóm thuyết trình. Nhập mật khẩu Admin để mở phòng thi đấu.
                </p>
              </div>

              <form onSubmit={handleCreateHostSubmit} className="space-y-2.5">
                <div className="relative">
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    placeholder="Mật khẩu Admin"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (adminError) setAdminError(null);
                    }}
                    className="w-full px-3.5 py-2.5 pr-10 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    title={showAdminPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {adminError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span className="font-semibold">{adminError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Xác thực & Tạo phòng</span>
                </button>
              </form>
            </div>

            {/* Join Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 border border-blue-200">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="title-1st text-lg text-slate-900 mb-1">
                  JOIN PHÒNG
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  Dành cho các bạn sinh viên trong lớp tham gia phiên thi đấu.
                </p>
              </div>

              <form onSubmit={handleJoinRoom} className="space-y-2.5">
                <input
                  type="text"
                  placeholder="Nickname"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    if (joinError) setJoinError(null);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Mã phòng"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value);
                    if (joinError) setJoinError(null);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 placeholder:normal-case uppercase tracking-widest font-mono focus:outline-none focus:border-blue-500"
                  required
                />

                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  Phòng chỉ mở khi nhóm thuyết trình bấm <strong>"Tạo phòng"</strong>. Khi bắt đầu thi đấu, phòng sẽ tự động khoá.
                </p>

                {joinError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span className="font-semibold">{joinError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifyingRoom}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isVerifyingRoom ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang kiểm tra phòng...</span>
                    </>
                  ) : (
                    <>
                      <span>Vào phòng</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : mode === 'host' ? (
          /* Mode 2: HOST Screen (Lobby & Live) */
          <div className="py-4 space-y-4 overflow-y-auto">
            {/* Host Banner & PIN */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-0.5">
                  Mã phòng:
                </span>
                <div className="flex items-center gap-2">
                  <span className="title-2nd text-red-600 tracking-wider">
                    {roomCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs transition-colors shadow-sm"
                    title="Sao chép mã phòng"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Visual Room Lifecycle Badge */}
                {hostPhase === 'lobby' ? (
                  <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold w-fit shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>🟢 ĐANG MỞ NHẬN NGƯỜI CHƠI</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-bold w-fit shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>🔒 ĐÃ KHOÁ PHÒNG (ĐANG THI ĐẤU)</span>
                  </div>
                )}
              </div>

              {/* Action Buttons depending on phase */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {hostPhase === 'lobby' ? (
                  <button
                    onClick={handleHostStart}
                    disabled={sortedPlayers.length === 0}
                    className="w-full sm:w-auto py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Bắt Đầu Phiên Thi Đấu ({sortedPlayers.length})</span>
                  </button>
                ) : (
                  <button
                    onClick={handleHostEnd}
                    className="w-full sm:w-auto py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>Kết Thúc Phiên & Tổng Kết</span>
                  </button>
                )}
              </div>
            </div>

            {/* Host Phase 1: LOBBY */}
            {hostPhase === 'lobby' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-2 text-sm font-bold text-slate-800">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Danh sách người tham gia ({sortedPlayers.length}):</span>
                </div>

                {sortedPlayers.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-6">
                    Đang đợi người chơi vào phòng {roomCode}...
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 justify-center max-h-56 overflow-y-auto py-2">
                    {sortedPlayers.map((p) => (
                      <span
                        key={p.id}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <span>{p.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Host Phase 2: LIVE LEADERBOARD */}
            {hostPhase === 'live' && (
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>BẢNG XẾP HẠNG THỜI GIAN THỰC</span>
                  <span className="text-amber-700 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>Đang thi đấu...</span>
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 w-12 text-center">#</th>
                        <th className="py-2.5 px-3">Nickname</th>
                        <th className="py-2.5 px-3 text-center">Số Kỳ Đã Qua</th>
                        <th className="py-2.5 px-3 text-center">Tình Trạng</th>
                        <th className="py-2.5 px-3 text-right">Điểm Cân Bằng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedPlayers.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-center font-black">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {p.name}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-amber-700 font-bold">
                            Quý {p.quarter}/16
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {p.status === 'finished' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                                🏆 Hoàn thành
                              </span>
                            ) : p.status === 'failed' ? (
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                                🛑 Bãi miễn tại Quý {p.quarter}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-300">
                                🟢 Đang tại vị
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900">
                            {p.score} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mode 3: JOIN (Student Waiting Screen) */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto border border-blue-200">
              <Users className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-1">
                Nickname: <strong className="text-slate-900">{playerName}</strong>
              </span>
              <h3 className="text-xl font-black text-slate-900">
                ĐÃ VÀO PHÒNG: <span className="font-mono text-red-600">{roomCode}</span>
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-xs text-slate-700 leading-relaxed">
              {sessionStarted ? (
                <div className="text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Phiên thi đấu đã bắt đầu! Đang tải màn chơi...</span>
                </div>
              ) : (
                <p>
                  ⏳ Đã vào phòng thành công! Hãy nhìn lên màn hình máy chiếu và chờ bắt đầu...
                </p>
              )}
            </div>

            {sessionStarted ? (
              <button
                onClick={onClose}
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Vào Bàn Làm Việc (Bắt Đầu Vuốt)
              </button>
            ) : (
              <button
                onClick={() => {
                  if (sessionRef.current) {
                    sessionRef.current.broadcast({
                      type: 'PLAYER_LEAVE',
                      playerId,
                      name: playerName.trim()
                    });
                    sessionRef.current.close();
                    sessionRef.current = null;
                  }
                  setMode('select');
                }}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 transition-all flex items-center justify-center gap-1.5 mx-auto shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Rời phòng chờ</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
