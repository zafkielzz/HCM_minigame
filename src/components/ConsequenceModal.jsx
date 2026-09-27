import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, AlertCircle, Quote } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function ConsequenceModal({ result, onContinue }) {
  if (!result) return null;

  const { choiceKey, choice, dilemma, impact } = result;
  const isLeft = choiceKey === 'left';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        <div>
          {/* Header Tag */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {dilemma.quarter} • Kết Quả Xử Lý Sự Vụ
            </span>
            <span className={`px-2.5 py-1 text-xs font-black uppercase rounded-lg ${
              isLeft ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' : 'bg-blue-950 text-blue-300 border border-blue-700/50'
            }`}>
              {isLeft ? 'Phương án A' : 'Phương án B'}
            </span>
          </div>

          {/* Chosen Decision Summary */}
          <div className="my-4 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <p className="text-sm sm:text-base font-semibold text-slate-200">
              "{choice.text}"
            </p>
          </div>

          {/* Impact Breakdown */}
          <div className="grid grid-cols-4 gap-2 mb-4 text-center">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Lòng Dân</span>
              <span className={`text-xs sm:text-sm font-black ${impact.people >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {impact.people >= 0 ? `+${impact.people}` : impact.people}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Pháp Quyền</span>
              <span className={`text-xs sm:text-sm font-black ${impact.law >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {impact.law >= 0 ? `+${impact.law}` : impact.law}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Liêm Chính</span>
              <span className={`text-xs sm:text-sm font-black ${impact.integrity >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {impact.integrity >= 0 ? `+${impact.integrity}` : impact.integrity}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Cải Cách</span>
              <span className={`text-xs sm:text-sm font-black ${impact.reform >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {impact.reform >= 0 ? `+${impact.reform}` : impact.reform}
              </span>
            </div>
          </div>

          {/* HCM Quotation Box */}
          <div className="relative p-4 rounded-2xl bg-gradient-to-r from-red-950/50 via-slate-800/60 to-red-950/30 border border-red-800/40 mb-4">
            <Quote className="absolute top-3 right-3 w-5 h-5 text-red-400/30" />
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
              ⭐ Lời Dạy Của Chủ Tịch Hồ Chí Minh:
            </span>
            <p className="font-serif italic text-sm sm:text-[15px] text-amber-100 leading-relaxed">
              {choice.quote}
            </p>
          </div>

          {/* Theoretical Rationale */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300">
            <span className="font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Soi chiếu Giáo trình Chương 4:
            </span>
            <p className="leading-relaxed text-slate-300">
              {choice.rationale}
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            playSound('select');
            onContinue();
          }}
          className="mt-5 w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group transition-all"
        >
          <span>Tiếp tục phiên công vụ</span>
          <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
