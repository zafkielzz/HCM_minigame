import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Users, Play, StopCircle, RefreshCw, X, Check, Copy, 
  Crown, Medal, Award, AlertCircle, ArrowRight, ArrowLeft, UserCheck, Flame, Share2, ClipboardList 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  MultiplayerSession, 
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
  currentQuarter, 
  stats, 
  onStartSoloWithSession 
}) {
  const [mode, setMode] = useState('select'); // 'select' | 'host' | 'join'
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerId] = useState(() => 'p_' + Math.random().toString(36).substring(2, 9));
  
  // Host state
  const [hostPhase, setHostPhase] = useState('lobby'); // 'lobby' | 'live' | 'summary'
  const [players, setPlayers] = useState({}); // { [playerId]: { name, quarter, stats, status, score, rankTitle } }
  
  // Client state
  const [isJoined, setIsJoined] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [isVerifyingRoom, setIsVerifyingRoom] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedRankingReport, setCopiedRankingReport] = useState(false);
  const sessionRef = useRef(null);

  // Clean up session on close
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.close();
      }
    };
  }, []);

  // Initialize Host Room
  const handleCreateHost = () => {
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
        setPlayers((prev) => ({
          ...prev,
          [data.playerId]: {
            name: data.name,
            quarter: 1,
            stats: { people: 60, law: 60, integrity: 60, reform: 60 },
            status: 'waiting',
            score: 60,
            rankTitle: 'Ứng viên'
          }
        }));
        playSound('select');
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

  // Host starts the session
  const handleHostStart = () => {
    if (sessionRef.current) {
      sessionRef.current.setStatus('live');
      sessionRef.current.broadcast({ type: 'SESSION_START' });
      setHostPhase('live');
      playSound('select');
    }
  };

  // Host ends and summarizes the session
  const handleHostEnd = () => {
    if (sessionRef.current) {
      sessionRef.current.setStatus('summary');
      sessionRef.current.broadcast({ type: 'SESSION_END' });
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
      const check = verifyRoom(trimmedCode);
      if (!check.valid) {
        playSound('stamp');
        setJoinError(check.message);
        setIsVerifyingRoom(false);
        return;
      }

      const activeCode = check.code || trimmedCode;
      setRoomCode(activeCode);
      setMode('join');
      setIsJoined(true);
      playSound('select');

      const session = new MultiplayerSession(activeCode, false);
      sessionRef.current = session;

      // Send join message
      session.broadcast({
        type: 'PLAYER_JOIN',
        playerId,
        name: trimmedName
      });

      // Listen for Host signals
      session.onMessage((data) => {
        if (data.type === 'SESSION_START') {
          setSessionStarted(true);
          playSound('select');
          if (onStartSoloWithSession) {
            onStartSoloWithSession({
              session,
              playerId,
              playerName: trimmedName,
              roomCode: trimmedCode
            });
          }
        }
      });
    } catch (err) {
      setJoinError('Không thể kết nối đến phòng thi đấu.');
    } finally {
      setIsVerifyingRoom(false);
    }
  };

  // Sort players for leaderboard:
  // Priority: 1. Quarter survived (desc) | 2. Score (desc)
  const sortedPlayers = Object.entries(players)
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => {
      if (b.quarter !== a.quarter) return b.quarter - a.quarter;
      return b.score - a.score;
    });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy full summary report for professor / submission
  const handleCopyRankingReport = () => {
    let report = `🇻🇳 [BẢNG TỔNG KẾT ĐẤU PHÒNG - MÔN TƯ TƯỞNG HỒ CHÍ MINH]\n`;
    report += `Phòng thi đấu: ${roomCode} | Tổng số thí sinh: ${sortedPlayers.length}\n`;
    report += `------------------------------------------------------\n`;

    sortedPlayers.forEach((p, idx) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col justify-between my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            {mode !== 'select' && (
              <button
                onClick={() => {
                  if (sessionRef.current) sessionRef.current.close();
                  setMode('select');
                  setIsJoined(false);
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
              ĐẤU PHÒNG LỚP HỌC
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode 1: Select Screen */}
        {mode === 'select' && (
          <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Host Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 border border-amber-200">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="title-1st text-lg text-slate-900 mb-1">
                  TẠO PHÒNG
                </h3>
              </div>

              <button
                onClick={handleCreateHost}
                className="mt-6 w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Tạo phòng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Join Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 border border-blue-200">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="title-1st text-lg text-slate-900 mb-1">
                  JOIN PHÒNG
                </h3>
              </div>

              <form onSubmit={handleJoinRoom} className="mt-4 space-y-2.5">
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
        )}

        {/* Mode 2: HOST Screen */}
        {mode === 'host' && (
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
                  {hostPhase === 'lobby' && (
                    <button
                      onClick={() => {
                        const nextCode = generateRoomCode(true);
                        setRoomCode(nextCode);
                        if (sessionRef.current) sessionRef.current.close();
                        const newSession = new MultiplayerSession(nextCode, true);
                        newSession.setStatus('lobby');
                        sessionRef.current = newSession;
                        setPlayers({});
                      }}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs transition-colors shadow-sm flex items-center gap-1 font-sans"
                      title="Đổi mã phòng khác (HCM24, HCM60, HCM88...)"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] font-bold">Đổi mã</span>
                    </button>
                  )}
                </div>
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
                ) : hostPhase === 'live' ? (
                  <button
                    onClick={handleHostEnd}
                    className="w-full sm:w-auto py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>Kết Thúc Phiên & Tổng Kết</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setHostPhase('lobby');
                      setPlayers({});
                      if (sessionRef.current) sessionRef.current.setStatus('lobby');
                    }}
                    className="w-full sm:w-auto py-3 px-5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Mở Lượt Chơi Mới</span>
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
                    {sortedPlayers.map((p, idx) => (
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

            {/* Host Phase 3: SUMMARY & PODIUM + FULL LEADERBOARD LIST */}
            {hostPhase === 'summary' && (
              <div className="space-y-4">
                {/* Podium Top 3 */}
                <div className="grid grid-cols-3 gap-2 text-center py-4 bg-slate-50 rounded-2xl border border-slate-200">
                  {/* Rank 2 */}
                  <div className="flex flex-col items-center justify-end p-2">
                    <span className="text-3xl mb-1">🥈</span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[90px]">
                      {sortedPlayers[1]?.name || '---'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {sortedPlayers[1] ? `Quý ${sortedPlayers[1].quarter}/16 • ${sortedPlayers[1].score}đ` : ''}
                    </span>
                    <div className="w-full h-16 bg-slate-200 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-700 text-sm">
                      #2
                    </div>
                  </div>

                  {/* Rank 1 (Crown) */}
                  <div className="flex flex-col items-center justify-end p-2 -translate-y-2">
                    <span className="text-4xl mb-1 animate-bounce">👑</span>
                    <span className="text-sm font-black text-amber-800 truncate max-w-[110px]">
                      {sortedPlayers[0]?.name || '---'}
                    </span>
                    <span className="text-xs text-amber-700 font-mono font-bold">
                      {sortedPlayers[0] ? `Quý ${sortedPlayers[0].quarter}/16 • ${sortedPlayers[0].score}đ` : ''}
                    </span>
                    <div className="w-full h-24 bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-amber-500/20">
                      QUÁN QUÂN
                    </div>
                  </div>

                  {/* Rank 3 */}
                  <div className="flex flex-col items-center justify-end p-2">
                    <span className="text-3xl mb-1">🥉</span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[90px]">
                      {sortedPlayers[2]?.name || '---'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {sortedPlayers[2] ? `Quý ${sortedPlayers[2].quarter}/16 • ${sortedPlayers[2].score}đ` : ''}
                    </span>
                    <div className="w-full h-12 bg-slate-200 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-700 text-sm">
                      #3
                    </div>
                  </div>
                </div>

                {/* FULL RANKING TABLE OF ALL PLAYERS (Under the Podium) */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                  <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-800">
                      <ClipboardList className="w-4 h-4 text-amber-600" />
                      <span>Bảng Điểm Toàn Bộ Thí Sinh ({sortedPlayers.length})</span>
                    </div>

                    <button
                      onClick={handleCopyRankingReport}
                      className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-300 shadow-sm"
                    >
                      {copiedRankingReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRankingReport ? 'Đã sao chép!' : 'Sao chép bảng điểm'}</span>
                    </button>
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
                        {sortedPlayers.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 text-center font-black">
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              {p.name}
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 text-center">
                  Chúc mừng các bạn sinh viên đã hoàn thành nhiệm kỳ xuất sắc với tinh thần phụng sự công bộc của Chủ tịch Hồ Chí Minh!
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 3: JOIN (Student Phone Screen) */}
        {mode === 'join' && (
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

            {sessionStarted && (
              <button
                onClick={onClose}
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Vào Bàn Làm Việc (Bắt Đầu Vuốt)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
