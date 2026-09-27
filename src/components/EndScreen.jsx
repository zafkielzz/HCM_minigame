import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, AlertTriangle, BookOpen, Share2, Check, Sparkles, Trophy, Lock, LogOut } from 'lucide-react';
import { playSound } from '../utils/sound';
import { getTitleByPerformance } from '../data/endings';

export default function EndScreen({ 
  ending, 
  stats, 
  quartersSurvived, 
  onRestart,
  isMultiplayerSession = false,
  roomCode = '',
  playerName = '',
  isSessionEndedByHost = false,
  onLeaveMultiplayer,
  onOpenLeaderboard
}) {
  const [copied, setCopied] = useState(false);
  const isVictory = ending.badge.includes("Mẫu Mực") || quartersSurvived >= 16;
  const rank = getTitleByPerformance(stats, quartersSurvived);

  useEffect(() => {
    if (isVictory) {
      playSound('victory');
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      playSound('gameover');
    }
  }, [isVictory]);

  const handleCopy = () => {
    const text = `🇻🇳 [GHẾ CÔNG BỘC - TƯ TƯỞNG HỒ CHÍ MINH]\n` +
      `Thí sinh: ${playerName || 'Cán bộ'}\n` +
      `Phòng thi: ${roomCode || 'Tự do'}\n` +
      `Kết quả: ${ending.title}\n` +
      `Danh hiệu: ${rank.title} (${rank.tier})\n` +
      `Thời gian tại vị: ${quartersSurvived}/16 Quý\n` +
      `Chỉ số cuối cùng: Lòng Dân: ${stats.people} | Pháp Quyền: ${stats.law} | Liêm Chính: ${stats.integrity} | Cải Cách: ${stats.reform}\n` +
      `Trích dẫn bài học: "${ending.quote}"`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl animate-fadeIn">
      {/* Top Banner & Avatar */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-5xl mb-3 shadow-inner">
          {ending.avatar}
        </div>

        <span className={`px-3 py-1 rounded-full title-1st text-xs tracking-wider mb-2 ${
          isVictory 
            ? 'bg-amber-100 text-amber-800 border border-amber-300' 
            : 'bg-rose-100 text-rose-800 border border-rose-300'
        }`}>
          {ending.badge}
        </span>

        <h2 className="title-2nd text-slate-900 tracking-wide leading-tight mt-1">
          {ending.title}
        </h2>

        {/* Assigned Rank / Title */}
        <div className="mt-2 flex items-center gap-1.5 text-sm font-extrabold">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span className="text-slate-500">Đánh giá phẩm chất:</span>
          <span className={rank.color}>{rank.title}</span>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-2 mb-3 border-b border-slate-200">
          <span>Thời gian phụng sự:</span>
          <span className="font-extrabold text-amber-700 text-sm">{quartersSurvived} / 16 Quý ({Math.floor(quartersSurvived / 4)} năm {quartersSurvived % 4} quý)</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-500">Lòng Dân:</span>
            <span className="font-bold text-amber-700">{stats.people}/100</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-500">Pháp Quyền:</span>
            <span className="font-bold text-purple-700">{stats.law}/100</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-500">Liêm Chính:</span>
            <span className="font-bold text-emerald-700">{stats.integrity}/100</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-500">Cải Cách:</span>
            <span className="font-bold text-blue-700">{stats.reform}/100</span>
          </div>
        </div>
      </div>

      {/* Cause of Ending / Reason */}
      <div className="mb-4 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-typewriter">
        <p className="font-medium text-slate-800">{ending.reason}</p>
      </div>

      {/* HCM Ideology Pedagogical Reflection */}
      <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 mb-5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 mb-1.5">
          <BookOpen className="w-4 h-4 text-red-600" />
          <span className="title-1st tracking-wide text-xs">Bài học Lý luận Tư tưởng Hồ Chí Minh:</span>
        </div>
        <p className="font-typewriter text-xs sm:text-sm text-slate-700 leading-relaxed mb-2">
          {ending.hcmLesson}
        </p>
        <p className="font-typewriter italic text-red-900 text-xs sm:text-sm border-t border-red-200 pt-2 font-medium">
          {ending.quote}
        </p>
      </div>

      {/* MULTIPLAYER LOCK OR SOLO RESTART */}
      {isMultiplayerSession ? (
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300 text-center space-y-2.5">
          <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>KẾT QUẢ ĐÃ ĐƯỢC KHÓA TRONG PHÒNG [{roomCode}]</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {quartersSurvived < 16 ? (
              <span>
                Thí sinh <strong>{playerName}</strong> đã dừng bước tại <strong>Quý {quartersSurvived}/16</strong>. 
                Để đảm bảo tính công bằng của kỳ thi đấu, <strong>bạn không thể chơi lại</strong>.
              </span>
            ) : (
              <span>
                Chúc mừng thí sinh <strong>{playerName}</strong> đã hoàn thành xuất sắc 16 Quý nhiệm kỳ!
              </span>
            )}
          </p>

          {!isSessionEndedByHost ? (
            <div className="p-2 rounded-xl bg-amber-100/80 border border-amber-300 text-[11px] text-amber-900 font-semibold animate-pulse">
              ⏳ Vui lòng giữ nguyên màn hình và theo dõi máy chiếu chờ Chủ phòng tổng kết phiên!
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold text-center">
                🏁 Phiên thi đấu đã kết thúc! Bảng xếp hạng toàn lớp đã được đồng bộ.
              </div>
              <button
                onClick={onOpenLeaderboard}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Trophy className="w-4 h-4" />
                <span>Xem Bảng Xếp Hạng Lớp Học (Đồng Bộ)</span>
              </button>
              <button
                onClick={onLeaveMultiplayer}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Rời phòng (Về chơi tự do)</span>
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs border border-slate-300 hover:bg-slate-50 bg-white text-slate-700 flex items-center justify-center gap-1.5 transition-all mt-2 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép kết quả!' : 'Sao chép kết quả để nộp bài'}</span>
          </button>
        </div>
      ) : (
        /* SOLO MODE ACTIONS */
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm border border-slate-300 hover:bg-slate-50 bg-white text-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép!' : 'Chia sẻ kết quả'}</span>
          </button>

          <button
            onClick={() => {
              playSound('select');
              onRestart();
            }}
            className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 transition-all"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Bắt đầu nhiệm kỳ mới</span>
          </button>
        </div>
      )}
    </div>
  );
}
