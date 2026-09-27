import React, { useState, useRef, useEffect } from 'react';
import { playSound } from '../utils/sound';
import AvatarVector from './AvatarVector';

export default function Card({ dilemma, onMakeChoice }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const SWIPE_THRESHOLD = 80; // Distance to commit a decision

  // Keep ref in sync for window listeners
  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  // Handle drag start
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

  // Window-level move and end listeners so drag never drops when moving fast
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
  const rotation = dragOffset.x * 0.06;
  const isLeft = dragOffset.x < -25;
  const isRight = dragOffset.x > 25;

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center select-none">
      {/* Option Banner (Appears dynamically as user drags left or right - True Reigns style) */}
      <div className="w-full h-20 flex items-center justify-center px-2 mb-2 text-center">
        {isLeft ? (
          <div className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider mb-0.5">
              ← Phương án A
            </span>
            <span>{dilemma.leftChoice.text}</span>
          </div>
        ) : isRight ? (
          <div className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider mb-0.5">
              Phương án B →
            </span>
            <span>{dilemma.rightChoice.text}</span>
          </div>
        ) : (
          <div className="text-slate-500 text-xs italic tracking-wide">
            ← Kéo thẻ sang trái hoặc phải để xem phương án →
          </div>
        )}
      </div>

      {/* Reigns Central Physical Card */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        className="w-full cursor-grab active:cursor-grabbing relative select-none rounded-2xl bg-slate-900 border border-slate-700 shadow-xl p-6 overflow-hidden flex flex-col justify-between min-h-[420px]"
      >
        {/* Neutral Decision Stamp on Card during Swipe */}
        {dragOffset.x < -35 && (
          <div className="absolute top-8 right-6 rotate-6 border-2 border-slate-300 text-slate-200 bg-slate-950 font-bold text-xs uppercase px-3 py-1 rounded shadow-md pointer-events-none">
            PHƯƠNG ÁN A
          </div>
        )}
        {dragOffset.x > 35 && (
          <div className="absolute top-8 left-6 -rotate-6 border-2 border-slate-300 text-slate-200 bg-slate-950 font-bold text-xs uppercase px-3 py-1 rounded shadow-md pointer-events-none">
            PHƯƠNG ÁN B
          </div>
        )}

        {/* Card Header: Quarter & Category */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
            {dilemma.quarter}
          </span>
          <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-800/80">
            {dilemma.category}
          </span>
        </div>

        {/* Card Character Avatar & Portrait */}
        <div className="flex flex-col items-center justify-center my-auto py-2">
          <AvatarVector
            id={dilemma.character.avatarId}
            size="w-24 h-24 sm:w-28 sm:h-28"
            className="border border-slate-700 shadow-lg mb-3"
          />

          <h3 className="font-bold text-base text-slate-100 text-center tracking-tight">
            {dilemma.character.name}
          </h3>
          <span className="text-xs text-amber-400/90 font-medium mb-3">
            {dilemma.character.role}
          </span>

          {/* Dialogue / Situation */}
          <p className="font-serif text-slate-200 text-sm sm:text-base leading-relaxed text-center px-1">
            "{dilemma.situation}"
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tư tưởng Hồ Chí Minh</span>
          <span>Sự vụ #{dilemma.id}/16</span>
        </div>
      </div>
    </div>
  );
}
