import React, { useEffect } from 'react';
import { ArrowRight, BookOpen, Quote, CornerDownLeft } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function ConsequenceModal({ result, onContinue }) {
  // Support quick advance with Enter or Spacebar
  useEffect(() => {
    if (!result) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        playSound('select');
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [result, onContinue]);

  if (!result) return null;

  const { choiceKey, choice, dilemma, impact } = result;
  const isLeft = choiceKey === 'left';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between max-h-[90vh] overflow-y-auto animate-scaleUp">
        <div>
          {/* Header Tag */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {dilemma.quarter} • Kết Quả Xử Lý Sự Vụ
            </span>
            <span className={`px-2.5 py-1 text-xs font-black uppercase rounded-lg ${
              isLeft ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
            }`}>
              {isLeft ? 'Phương án A' : 'Phương án B'}
            </span>
          </div>

          {/* Chosen Decision Summary */}
          <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-sm sm:text-base font-semibold text-slate-800">
              "{choice.text}"
            </p>
          </div>

          {/* Impact Breakdown */}
          <div className="grid grid-cols-4 gap-2 mb-4 text-center">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-medium">Lòng Dân</span>
              <span className={`text-xs sm:text-sm font-black ${impact.people >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {impact.people >= 0 ? `+${impact.people}` : impact.people}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-medium">Pháp Quyền</span>
              <span className={`text-xs sm:text-sm font-black ${impact.law >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {impact.law >= 0 ? `+${impact.law}` : impact.law}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-medium">Liêm Chính</span>
              <span className={`text-xs sm:text-sm font-black ${impact.integrity >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {impact.integrity >= 0 ? `+${impact.integrity}` : impact.integrity}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-medium">Cải Cách</span>
              <span className={`text-xs sm:text-sm font-black ${impact.reform >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {impact.reform >= 0 ? `+${impact.reform}` : impact.reform}
              </span>
            </div>
          </div>

          {/* HCM Quotation Box */}
          <div className="relative p-4 rounded-2xl bg-red-50/70 border border-red-200 mb-4">
            <Quote className="absolute top-3 right-3 w-5 h-5 text-red-400/40" />
            <span className="text-xs font-bold text-red-800 flex items-center gap-1.5 mb-1">
              ⭐ Lời Dạy Của Chủ Tịch Hồ Chí Minh:
            </span>
            <p className="font-serif italic text-sm sm:text-[15px] text-red-950 leading-relaxed">
              {choice.quote}
            </p>
          </div>

          {/* Theoretical Rationale */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
            <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Soi chiếu Giáo trình Chương 4:
            </span>
            <p className="leading-relaxed text-slate-600">
              {choice.rationale}
            </p>
          </div>
        </div>

        {/* Continue Button with Keyboard hint */}
        <button
          onClick={() => {
            playSound('select');
            onContinue();
          }}
          className="mt-5 w-full py-3.5 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 flex items-center justify-center gap-2 group transition-all cursor-pointer"
        >
          <span>Tiếp tục phiên công vụ</span>
          <span className="text-[11px] font-mono opacity-80 flex items-center gap-0.5">
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>[Enter]</span>
          </span>
          <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform ml-1" />
        </button>
      </div>
    </div>
  );
}
