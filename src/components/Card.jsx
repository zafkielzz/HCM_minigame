import React, { useState, useRef, useEffect } from 'react';
import { playSound } from '../utils/sound';
import AvatarVector from './AvatarVector';

export default function Card({ dilemma, onMakeChoice }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const SWIPE_THRESHOLD = 85; // Distance to commit decision

  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMouseDown = (e) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      const deltaX = clientX - startPos.current.x;
      const deltaY = (clientY - startPos.current.y) * 0.15;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);

      const currentX = dragOffsetRef.current.x;
      if (currentX <= -SWIPE_THRESHOLD) {
        playSound('stamp');
        onMakeChoice('left');
      } else if (currentX >= SWIPE_THRESHOLD) {
        playSound('stamp');
        onMakeChoice('right');
      }

      setDragOffset({ x: 0, y: 0 });
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, onMakeChoice]);

  // Compute rotation angle
  const rotation = dragOffset.x * 0.05;
  const isLeft = dragOffset.x < -20;
  const isRight = dragOffset.x > 20;

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none px-2">
      {/* Mobile Top Active Banner (shown on mobile when dragging) */}
      <div className="md:hidden w-full h-20 flex items-center justify-center mb-2 text-center">
        {isLeft ? (
          <div className="w-full bg-emerald-950/95 border-2 border-emerald-500 text-emerald-100 text-xs sm:text-sm font-medium py-2 px-3 rounded-xl shadow-lg text-left transition-all">
            <span className="text-emerald-400 font-bold block text-[11px] uppercase tracking-wider mb-0.5">
              ← Phương án A
            </span>
            <span className="leading-snug">{dilemma.leftChoice.text}</span>
          </div>
        ) : isRight ? (
          <div className="w-full bg-blue-950/95 border-2 border-blue-500 text-blue-100 text-xs sm:text-sm font-medium py-2 px-3 rounded-xl shadow-lg text-right transition-all">
            <span className="text-blue-400 font-bold block text-[11px] uppercase tracking-wider mb-0.5">
              Phương án B →
            </span>
            <span className="leading-snug">{dilemma.rightChoice.text}</span>
          </div>
        ) : (
          <div className="text-slate-400 text-xs tracking-wide">
            ← Kéo sang trái (Phương án A) hoặc sang phải (Phương án B) →
          </div>
        )}
      </div>

      {/* Main 3-Column Split Layout: Option A on Left, Card in Center, Option B on Right */}
      <div className="w-full flex items-center justify-center gap-4 sm:gap-6">
        
        {/* LEFT PANEL: PHƯƠNG ÁN A (Xanh Lá Cây - Highlights when dragging Left) */}
        <div 
          className={`hidden md:flex flex-1 flex-col justify-between p-5 sm:p-6 rounded-3xl border-2 transition-all duration-200 min-h-[460px] sm:min-h-[500px] text-left shadow-lg ${
            isLeft 
              ? 'bg-emerald-950/95 border-emerald-400 text-emerald-100 scale-[1.03] shadow-emerald-950/80 ring-2 ring-emerald-500/40 opacity-100 translate-x-1'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/80">
              <span className={`text-xs font-black uppercase tracking-wider ${isLeft ? 'text-emerald-300' : 'text-slate-400'}`}>
                ← PHƯƠNG ÁN A
              </span>
            </div>

            <p className={`text-base sm:text-lg font-semibold leading-relaxed transition-colors ${
              isLeft ? 'text-emerald-100 font-bold' : 'text-slate-300'
            }`}>
              "{dilemma.leftChoice.text}"
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/60 text-xs">
            {isLeft ? (
              <span className="text-emerald-300 font-bold uppercase tracking-wide flex items-center gap-1.5 animate-pulse">
                ✓ Thả chuột để chốt Phương án A
              </span>
            ) : (
              <span className="text-slate-500 italic">
                Kéo thẻ sang trái màn hình để chọn
              </span>
            )}
          </div>
        </div>

        {/* CENTER: PHYSICAL REIGNS CARD */}
        <div className="w-full max-w-sm sm:max-w-md shrink-0">
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            className="w-full cursor-grab active:cursor-grabbing relative select-none rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-6 sm:p-7 overflow-hidden flex flex-col justify-between min-h-[460px] sm:min-h-[500px]"
          >
            {/* Crisp Stamps */}
            {dragOffset.x < -30 && (
              <div className="absolute top-9 right-6 rotate-6 border-3 border-emerald-400 text-emerald-300 bg-slate-950 font-black text-xs sm:text-sm uppercase px-3.5 py-1.5 rounded-xl shadow-lg pointer-events-none">
                PHƯƠNG ÁN A
              </div>
            )}
            {dragOffset.x > 30 && (
              <div className="absolute top-9 left-6 -rotate-6 border-3 border-blue-400 text-blue-300 bg-slate-950 font-black text-xs sm:text-sm uppercase px-3.5 py-1.5 rounded-xl shadow-lg pointer-events-none">
                PHƯƠNG ÁN B
              </div>
            )}

            {/* Card Header: Quarter & Category */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2">
              <span className="text-xs sm:text-sm font-black text-red-400 uppercase tracking-wide">
                {dilemma.quarter}
              </span>
              <span className="text-xs font-semibold text-slate-300 px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 truncate max-w-[200px]">
                {dilemma.category}
              </span>
            </div>

            {/* Card Character Avatar & Portrait */}
            <div className="flex flex-col items-center justify-center my-auto py-2">
              <AvatarVector
                id={dilemma.character.avatarId}
                size="w-28 h-28 sm:w-32 sm:h-32"
                className="border-2 border-slate-700 shadow-xl mb-3"
              />

              <h3 className="font-black text-lg sm:text-xl text-slate-100 text-center tracking-tight">
                {dilemma.character.name}
              </h3>
              <span className="text-xs sm:text-sm text-amber-400 font-semibold mb-3">
                {dilemma.character.role}
              </span>

              {/* Dialogue / Situation text */}
              <p className="font-serif text-slate-200 text-base sm:text-lg leading-relaxed text-center px-1">
                "{dilemma.situation}"
              </p>
            </div>

            {/* Card Footer */}
            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Chương 4: Tư tưởng Hồ Chí Minh</span>
              <span>Sự vụ #{dilemma.id}/16</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: PHƯƠNG ÁN B (Xanh Lam - Highlights when dragging Right) */}
        <div 
          className={`hidden md:flex flex-1 flex-col justify-between p-5 sm:p-6 rounded-3xl border-2 transition-all duration-200 min-h-[460px] sm:min-h-[500px] text-right shadow-lg ${
            isRight 
              ? 'bg-blue-950/95 border-blue-400 text-blue-100 scale-[1.03] shadow-blue-950/80 ring-2 ring-blue-500/40 opacity-100 -translate-x-1'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <div>
            <div className="flex items-center justify-end gap-2 mb-3 pb-2 border-b border-slate-800/80">
              <span className={`text-xs font-black uppercase tracking-wider ${isRight ? 'text-blue-300' : 'text-slate-400'}`}>
                PHƯƠNG ÁN B →
              </span>
            </div>

            <p className={`text-base sm:text-lg font-semibold leading-relaxed transition-colors ${
              isRight ? 'text-blue-100 font-bold' : 'text-slate-300'
            }`}>
              "{dilemma.rightChoice.text}"
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/60 text-xs">
            {isRight ? (
              <span className="text-blue-300 font-bold uppercase tracking-wide flex items-center justify-end gap-1.5 animate-pulse">
                ✓ Thả chuột để chốt Phương án B
              </span>
            ) : (
              <span className="text-slate-500 italic">
                Kéo thẻ sang phải màn hình để chọn
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
