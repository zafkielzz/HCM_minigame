import React from 'react';
import { BookOpen, Trophy, Volume2, VolumeX } from 'lucide-react';

export default function Header({ 
  currentQuarter, 
  totalQuarters, 
  onOpenHandbook, 
  onOpenLeaderboard, 
  isMuted, 
  onToggleMute 
}) {
  const year = Math.floor((currentQuarter - 1) / 4) + 1;
  const quarterInYear = ((currentQuarter - 1) % 4) + 1;

  return (
    <header className="w-full max-w-2xl mx-auto mb-3 flex flex-col gap-2.5">
      {/* Title & Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-red-600 flex items-center justify-center text-yellow-300 font-black text-xl shadow-md border-2 border-yellow-400 shrink-0">
            ★
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 flex items-center gap-2 leading-none">
              <span>GHẾ CÔNG BỘC</span>
              <span className="text-xs uppercase font-black px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                Chương 4
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Tư tưởng Hồ Chí Minh: Xây dựng Nhà nước & Cải cách hành chính
            </p>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLeaderboard}
            title="Đấu phòng & Bảng xếp hạng lớp học"
            className="py-2 px-3.5 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-900 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-bold shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Đấu Phòng Lớp Học</span>
          </button>

          <button
            onClick={onOpenHandbook}
            title="Sổ tay lý luận Chương 4"
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="flex items-center justify-between text-xs sm:text-sm px-3.5 py-1.5 text-slate-600 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-black text-red-700">Năm {year}</span>
          <span>•</span>
          <span className="font-bold text-slate-800">Quý {quarterInYear}</span>
          <span className="text-xs text-slate-400 font-mono">({currentQuarter}/{totalQuarters})</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-slate-500">Nhiệm kỳ: 4 năm (16 Quý)</span>
        </div>
      </div>
    </header>
  );
}
