import React from 'react';
import { Play, BookOpen, ShieldAlert, Sparkles, Scale, Users, ShieldCheck, Zap } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function IntroScreen({ onStart, onOpenHandbook }) {
  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/95 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn text-center flex flex-col justify-between">
      <div>
        {/* Emblem */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-4xl shadow-xl shadow-red-600/30 border-2 border-yellow-400 mb-4 animate-bounce">
          ⭐
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-950 text-red-300 border border-red-800/50 inline-block mb-2">
          Mini Game Môn Tư Tưởng Hồ Chí Minh
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight leading-tight">
          GHẾ CÔNG BỘC
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 mb-5">
          Chủ đề 4: Xây Dựng Nhà Nước Của Dân, Do Dân, Vì Dân & Cải Cách Hành Chính
        </p>

        {/* Story Intro */}
        <div className="text-left bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 space-y-2">
          <p>
            🇻🇳 <strong>Nhiệm vụ của bạn:</strong> Bạn vừa được nhân dân tín nhiệm bầu vào cương vị người đứng đầu chính quyền địa phương nhiệm kỳ 4 năm (16 Quý).
          </p>
          <p>
            Đối mặt với hàng loạt sự vụ hóc búa, bạn phải đưa ra các quyết sách bản lĩnh, thấm nhuần lời Bác: <em className="text-amber-300 font-serif">"Lãnh đạo là công bộc của dân, không phải là quan cách mạng"</em>.
          </p>
        </div>

        {/* 4 Pillars Overview */}
        <div className="grid grid-cols-2 gap-2 text-left mb-6 text-xs">
          <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/40 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-extrabold text-amber-300 block">Lòng Dân</span>
              <span className="text-[10px] text-slate-400">Vì dân, gần dân</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/40 flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <span className="font-extrabold text-purple-300 block">Pháp Quyền</span>
              <span className="text-[10px] text-slate-400">Thần linh pháp quyền</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-extrabold text-emerald-300 block">Liêm Chính</span>
              <span className="text-[10px] text-slate-400">Chống lãng phí, tham ô</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-900/40 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <span className="font-extrabold text-blue-300 block">Cải Cách</span>
              <span className="text-[10px] text-slate-400">Một cửa & Số hóa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={() => {
            playSound('select');
            onStart();
          }}
          className="w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-slate-950 shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Bắt đầu nhậm chức (Vào chơi)</span>
        </button>

        <button
          onClick={onOpenHandbook}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-300 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center gap-1.5 transition-all"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Tra cứu Sổ tay Lý luận Chương 4</span>
        </button>
      </div>
    </div>
  );
}
