import React from 'react';
import { Play, BookOpen, Trophy, Users, Scale, ShieldCheck, Zap } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function IntroScreen({ onStart, onOpenHandbook, onOpenLeaderboard }) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl animate-fadeIn flex flex-col justify-between">
      <div>
        {/* Emblem & Header */}
        <div className="text-center mb-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-600 text-yellow-300 flex items-center justify-center text-3xl font-black shadow-lg shadow-red-200 border-2 border-yellow-400 mb-3">
            ★
          </div>
          <span className="title-1st text-red-700 tracking-wider block mb-1">
            TƯ TƯỞNG HỒ CHÍ MINH
          </span>
          <h1 className="title-2nd text-red-600 tracking-wider">
            GHẾ CÔNG BỘC
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Chương 4: Xây dựng Nhà nước của dân, do dân, vì dân & Cải cách hành chính
          </p>
        </div>

        {/* Story Intro */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-typewriter text-xs sm:text-sm text-slate-800 leading-relaxed mb-4">
          <p className="mb-2">
            🏛️ <strong>Bối cảnh:</strong> Bạn vừa được nhân dân tín nhiệm bầu vào cương vị người đứng đầu chính quyền địa phương nhiệm kỳ 4 năm (16 Quý).
          </p>
          <p>
            Mỗi quý, bạn phải giải quyết 1 sự vụ thực tế. Lựa chọn của bạn sẽ tác động trực tiếp đến 4 cán cân: <strong>Lòng Dân, Pháp Quyền, Liêm Chính</strong> và <strong>Cải Cách Hành Chính</strong>.
          </p>
        </div>

        {/* End Game Rules Clarification Box */}
        <div className="bg-amber-50/90 p-4 rounded-2xl border border-amber-200 mb-5 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-1.5 font-black text-amber-900 text-xs uppercase tracking-wide">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Quy luật Thắng / Thua (Cơ chế End Game)</span>
          </div>

          <div className="space-y-1.5 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold shrink-0">✓ Điều kiện Thắng:</span>
              <span>
                <strong>Trụ vững qua trọn vẹn 16 Quý (4 năm nhiệm kỳ)</strong> mà không để bất kỳ chỉ số nào rơi về 0.
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-red-700 font-bold shrink-0">✕ Điều kiện Thua:</span>
              <span>
                Bị cách chức hoặc bãi miễn ngay khi <strong>bất kỳ chỉ số nào chạm 0 điểm</strong>, hoặc mắc phải bẫy cực đoan (Bệnh "Mị dân" hay "Quan cách mạng").
              </span>
            </div>
          </div>
        </div>

        {/* 4 Indicators Mini Preview */}
        <div className="grid grid-cols-2 gap-2 text-left mb-5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-slate-800 font-bold">Lòng Dân</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="text-slate-800 font-bold">Pháp Quyền</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-800 font-bold">Liêm Chính</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-slate-800 font-bold">Cải Cách</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={() => {
            playSound('select');
            onStart();
          }}
          className="w-full py-3.5 px-5 rounded-xl font-bold text-sm uppercase tracking-wide bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-2 transition-colors"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Bắt đầu chơi cá nhân</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Trophy className="w-4 h-4 text-amber-700" />
          <span>🏆 Vào Đấu Phòng Lớp Học (Thi đấu tập thể)</span>
        </button>

        <button
          onClick={onOpenHandbook}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Tra cứu Sổ tay Lý luận Chương 4</span>
        </button>
      </div>
    </div>
  );
}
