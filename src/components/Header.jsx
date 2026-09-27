import React from 'react';
import { BookOpen, Presentation, Volume2, VolumeX, RotateCcw, Award } from 'lucide-react';

export default function Header({ 
  currentQuarter, 
  totalQuarters, 
  onOpenHandbook, 
  onOpenPresentation, 
  isMuted, 
  onToggleMute, 
  onRestart 
}) {
  const year = Math.floor((currentQuarter - 1) / 4) + 1;
  const quarterInYear = ((currentQuarter - 1) % 4) + 1;

  return (
    <header className="w-full max-w-xl mx-auto mb-3 flex flex-col gap-2">
      {/* Title & Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-yellow-300 font-black text-lg shadow-lg shadow-red-600/30 border border-yellow-400/40">
            ★
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-100 flex items-center gap-1.5 leading-none">
              <span>GHẾ CÔNG BỘC</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Chương 4
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Tư tưởng Hồ Chí Minh về Xây dựng Nhà nước & Cải cách hành chính
            </p>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenHandbook}
            title="Sổ tay kiến thức Chương 4"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Sổ tay</span>
          </button>

          <button
            onClick={onOpenPresentation}
            title="Chế độ Trình chiếu / Lớp học"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <Presentation className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Thuyết trình</span>
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="flex items-center justify-between text-xs px-1 text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-amber-400">Năm {year}</span>
          <span>•</span>
          <span className="font-semibold text-slate-200">Quý {quarterInYear}</span>
          <span className="text-[11px] text-slate-500 font-mono">({currentQuarter}/{totalQuarters})</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400">Nhiệm kỳ: 4 năm</span>
        </div>
      </div>
    </header>
  );
}
