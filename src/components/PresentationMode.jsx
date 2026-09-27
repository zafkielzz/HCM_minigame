import React, { useState } from 'react';
import { Presentation, Eye, EyeOff, MessageSquare, Sparkles, X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function PresentationMode({ isOpen, onClose, currentDilemma, onMakeChoice }) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (!isOpen || !currentDilemma) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-amber-400">
                CHẾ ĐỘ GIẢNG ĐƯỜNG • BÀN TRÒN TRANH LUẬN LỚP HỌC
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-100">
                Tình huống thực tế: {currentDilemma.quarter}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Situation Card */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{currentDilemma.character.avatar}</span>
            <div>
              <h4 className="font-extrabold text-slate-100 text-base">{currentDilemma.character.name}</h4>
              <span className="text-xs text-amber-400 font-medium">{currentDilemma.character.role}</span>
            </div>
          </div>
          <p className="font-serif text-slate-100 text-lg sm:text-xl leading-relaxed italic">
            "{currentDilemma.situation}"
          </p>
        </div>

        {/* Audience Prompt / Discussion Question */}
        <div className="mb-6 p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase text-blue-300 block mb-0.5">
              Câu hỏi thảo luận dành cho cả lớp:
            </span>
            <p className="text-sm text-slate-200">
              Nếu đứng ở cương vị người đứng đầu chính quyền, lớp mình sẽ giải quyết tình huống này ra sao? 
              Làm thế nào để vừa giữ nghiêm kỷ cương pháp luật mà không xa rời lòng dân?
            </p>
          </div>
        </div>

        {/* The Two Choices Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Option A */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-emerald-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                  Phương Án A
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  Dân chủ & Đổi mới
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-200 mb-3">
                {currentDilemma.leftChoice.text}
              </p>
            </div>

            {showAnalysis && (
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                <span className="font-bold text-amber-400 block">Soi chiếu lý luận:</span>
                <p className="italic font-serif text-slate-300">{currentDilemma.leftChoice.quote}</p>
                <p className="text-slate-400">{currentDilemma.leftChoice.rationale}</p>
              </div>
            )}

            <button
              onClick={() => {
                onMakeChoice('left');
                onClose();
              }}
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Cả lớp chọn Phương án A</span>
            </button>
          </div>

          {/* Option B */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-blue-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-blue-400 tracking-wider">
                  Phương Án B
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">
                  Thỏa hiệp / Tiêu chuẩn cũ
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-200 mb-3">
                {currentDilemma.rightChoice.text}
              </p>
            </div>

            {showAnalysis && (
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                <span className="font-bold text-rose-400 block">Nguy cơ sai lệch:</span>
                <p className="italic font-serif text-slate-300">{currentDilemma.rightChoice.quote}</p>
                <p className="text-slate-400">{currentDilemma.rightChoice.rationale}</p>
              </div>
            )}

            <button
              onClick={() => {
                onMakeChoice('right');
                onClose();
              }}
              className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
            >
              <span>Cả lớp chọn Phương án B</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Teacher / Facilitator Analysis Toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all"
          >
            {showAnalysis ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showAnalysis ? "Ẩn phân tích giáo trình" : "Hiện phân tích giáo trình (Dành cho Nhóm thuyết trình)"}</span>
          </button>

          <span className="text-xs text-slate-400">
            Dùng phím mũi tên ← A | B → để quyết định nhanh
          </span>
        </div>
      </div>
    </div>
  );
}
