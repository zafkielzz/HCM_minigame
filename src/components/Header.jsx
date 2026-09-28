import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, Volume2, VolumeX, Home, Maximize, Minimize, UserCheck, Shield } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function Header({ 
  currentQuarter, 
  totalQuarters, 
  onOpenHandbook, 
  onOpenLeaderboard, 
  isMuted, 
  onToggleMute,
  onGoHome,
  multiplayerContext,
  playerName
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const year = Math.floor((currentQuarter - 1) / 4) + 1;
  const quarterInYear = ((currentQuarter - 1) % 4) + 1;
  const progressPercent = Math.round(((currentQuarter - 1) / (totalQuarters || 16)) * 100);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="w-full max-w-2xl mx-auto mb-3 flex flex-col gap-2.5">
      {/* Top Bar: Title, Player Badge & Toolbar */}
      <div className="flex items-center justify-between gap-2">
        {/* Clickable Logo & Game Title */}
        <div 
          onClick={onGoHome}
          title="Bấm để về Trang chủ"
          className="flex items-center gap-2.5 cursor-pointer group select-none transition-transform active:scale-95"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-yellow-300 font-black text-xl shadow-md border-2 border-yellow-400 shrink-0 group-hover:scale-105 transition-transform">
            ★
          </div>
          <div>
            <h1 className="title-1st text-amber-300 flex items-center gap-2 leading-none drop-shadow-md">
              <span>GHẾ CÔNG BỘC</span>
              <span className="text-[11px] font-sans font-black px-2 py-0.5 rounded bg-red-600 text-white shadow-sm border border-yellow-400/40">
                Chương 4
              </span>
            </h1>
            <p className="text-[11px] text-amber-200/90 font-medium mt-1 hidden sm:block">
              Tư tưởng Hồ Chí Minh: Nhà nước của dân, do dân, vì dân
            </p>
          </div>
        </div>

        {/* Right Toolbar Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Home Button */}
          {onGoHome && (
            <button
              onClick={() => {
                playSound('select');
                onGoHome();
              }}
              title="Về Trang chủ"
              className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all flex items-center gap-1 text-xs font-bold"
            >
              <Home className="w-4 h-4 text-red-600" />
              <span className="hidden md:inline">Trang chủ</span>
            </button>
          )}

          {/* Đấu Phòng Button */}
          <button
            onClick={() => {
              playSound('select');
              onOpenLeaderboard();
            }}
            title="Đấu phòng & Bảng xếp hạng lớp học"
            className="py-2 px-2.5 sm:px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-bold shadow-md"
          >
            <Trophy className="w-4 h-4 text-red-700 fill-red-700/20" />
            <span className="hidden sm:inline">Đấu Phòng</span>
          </button>

          {/* Sổ Tay Button */}
          <button
            onClick={() => {
              playSound('select');
              onOpenHandbook();
            }}
            title="Sổ tay lý luận Chương 4"
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
          </button>

          {/* Mute Audio Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình (Chiếu lớp)"}
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm transition-all hidden sm:flex"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-slate-700" /> : <Maximize className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Identity Badge & Milestone Progress Track */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-2.5 sm:px-4 sm:py-2.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between gap-2 text-xs flex-wrap sm:flex-nowrap">
          {/* Identity: Player Name or Free Mode */}
          {multiplayerContext ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0"></span>
              <span className="truncate max-w-[130px] sm:max-w-[200px]">
                Thí sinh: <strong className="text-red-700 font-extrabold">{multiplayerContext.playerName}</strong>
              </span>
              <span className="text-amber-400">|</span>
              <span className="font-mono text-slate-800">[{multiplayerContext.roomCode}]</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-[260px]">
                Cán bộ: <strong className="text-slate-900 font-bold">{playerName || "Nhiệm kỳ Tự do"}</strong>
              </span>
            </div>
          )}

          {/* Quarter Timeline */}
          <div className="flex items-center gap-2 font-bold text-slate-800 shrink-0 ml-auto">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-black text-xs">
              Năm {year}
            </span>
            <span>•</span>
            <span className="text-xs">Quý {quarterInYear}</span>
            <span className="text-slate-400 font-mono text-[11px]">
              ({currentQuarter}/{totalQuarters})
            </span>
          </div>
        </div>

        {/* 16-Quarter Segmented Progress Bar */}
        <div className="space-y-1">
          <div className="flex gap-1 w-full h-2">
            {Array.from({ length: totalQuarters || 16 }).map((_, idx) => {
              const qNum = idx + 1;
              const isPast = qNum < currentQuarter;
              const isCurrent = qNum === currentQuarter;
              const isYearEnd = qNum % 4 === 0;

              return (
                <div
                  key={idx}
                  title={`Quý ${qNum} (Năm ${Math.floor((qNum - 1) / 4) + 1})`}
                  className={`flex-1 h-full rounded-xs transition-all ${
                    isCurrent 
                      ? 'bg-amber-500 ring-2 ring-amber-400 shadow-sm animate-pulse z-10 scale-y-110' 
                      : isPast 
                        ? 'bg-red-600' 
                        : 'bg-slate-200'
                  } ${isYearEnd && !isPast && !isCurrent ? 'bg-slate-300' : ''}`}
                />
              );
            })}
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
            <span>Năm 1</span>
            <span>Năm 2</span>
            <span>Năm 3</span>
            <span>Năm 4 (Về đích)</span>
          </div>
        </div>
      </div>
    </header>
  );
}
