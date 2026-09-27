import React, { useState } from 'react';
import { Presentation, Eye, EyeOff, MessageSquare, X, ChevronRight, ChevronLeft } from 'lucide-react';
import AvatarVector from './AvatarVector';

export default function PresentationMode({ isOpen, onClose, currentDilemma, onMakeChoice }) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (!isOpen || !currentDilemma) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center border border-slate-700">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
                CHẾ ĐỘ GIẢNG ĐƯỜNG • BÀN TRÒN TRANH LUẬN LỚP HỌC
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">
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

        {/* Big Situation Card with Silhouette Avatar */}
        <div className="my-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <AvatarVector id={currentDilemma.character.avatarId} size="w-16 h-16 sm:w-20 sm:h-20" className="border border-slate-700" />
            <div>
              <h4 className="font-bold text-slate-100 text-lg sm:text-xl">{currentDilemma.character.name}</h4>
              <span className="text-xs sm:text-sm text-slate-400">{currentDilemma.character.role}</span>
            </div>
          </div>
          <p className="font-serif text-slate-100 text-lg sm:text-xl leading-relaxed italic border-t border-slate-800 pt-3">
            "{currentDilemma.situation}"
          </p>
        </div>

        {/* Audience Prompt / Discussion Question */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase text-slate-300 block mb-0.5">
              Câu hỏi thảo luận dành cho cả lớp:
            </span>
            <p className="text-sm text-slate-300">
              Nếu đứng ở cương vị người đứng đầu chính quyền địa phương, các bạn sẽ giải quyết sự vụ này như thế nào? 
              Làm sao để cân bằng giữa Lòng Dân, Kỷ Cương Pháp Luật, Liêm Chính và Cải Cách Hành Chính?
            </p>
          </div>
        </div>

        {/* The Two Choices Comparison - Pure Neutral Presentation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Option A */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                  Phương Án A
                </span>
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-200 mb-3">
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
              className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1 border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Biểu quyết Phương án A</span>
            </button>
          </div>

          {/* Option B */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                  Phương Án B
                </span>
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-200 mb-3">
                {currentDilemma.rightChoice.text}
              </p>
            </div>

            {showAnalysis && (
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                <span className="font-bold text-amber-400 block">Soi chiếu lý luận:</span>
                <p className="italic font-serif text-slate-300">{currentDilemma.rightChoice.quote}</p>
                <p className="text-slate-400">{currentDilemma.rightChoice.rationale}</p>
              </div>
            )}

            <button
              onClick={() => {
                onMakeChoice('right');
                onClose();
              }}
              className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1 border border-slate-700"
            >
              <span>Biểu quyết Phương án B</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Teacher / Facilitator Analysis Toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-amber-300 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
          >
            {showAnalysis ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showAnalysis ? "Ẩn phân tích giáo trình" : "Hiện phân tích giáo trình (Dành cho Nhóm thuyết trình)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
