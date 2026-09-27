import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { playSound } from '../utils/sound';
import AvatarVector from './AvatarVector';

export default function Card({ dilemma, onMakeChoice, onPreviewImpact }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredChoice, setHoveredChoice] = useState(null); // 'left' | 'right' | null
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const SWIPE_THRESHOLD = 85; // Pixels needed to commit a swipe

  // Handle pointer down (mouse or touch)
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    startPos.current = { x: clientX, y: clientY };
  };

  // Handle pointer move
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const deltaX = clientX - startPos.current.x;
    const deltaY = (clientY - startPos.current.y) * 0.25;

    setDragOffset({ x: deltaX, y: deltaY });

    if (deltaX < -30) {
      onPreviewImpact(dilemma.leftChoice.impact);
      setHoveredChoice('left');
    } else if (deltaX > 30) {
      onPreviewImpact(dilemma.rightChoice.impact);
      setHoveredChoice('right');
    } else {
      onPreviewImpact(null);
      setHoveredChoice(null);
    }
  };

  // Handle pointer up / cancel
  const handlePointerEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x <= -SWIPE_THRESHOLD) {
      // Swiped Left
      playSound('stamp');
      onMakeChoice('left');
    } else if (dragOffset.x >= SWIPE_THRESHOLD) {
      // Swiped Right
      playSound('stamp');
      onMakeChoice('right');
    }

    setDragOffset({ x: 0, y: 0 });
    setHoveredChoice(null);
    onPreviewImpact(null);
  };

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        playSound('stamp');
        onMakeChoice('left');
      } else if (e.key === 'ArrowRight') {
        playSound('stamp');
        onMakeChoice('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMakeChoice]);

  // Compute rotation angle based on drag x
  const rotation = dragOffset.x * 0.08;
  const isLeftActive = dragOffset.x < -30 || hoveredChoice === 'left';
  const isRightActive = dragOffset.x > 30 || hoveredChoice === 'right';

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      {/* Dynamic Choice Preview Banner */}
      <div className="h-16 w-full flex items-center justify-center px-2 mb-2">
        {isLeftActive ? (
          <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-bold py-2 px-4 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn text-center">
            <ChevronLeft className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{dilemma.leftChoice.text}</span>
          </div>
        ) : isRightActive ? (
          <div className="bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs sm:text-sm font-bold py-2 px-4 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn text-center">
            <span>{dilemma.rightChoice.text}</span>
            <ChevronRight className="w-4 h-4 shrink-0 text-blue-400" />
          </div>
        ) : (
          <div className="text-slate-400 text-xs flex items-center gap-1.5 opacity-80">
            <span>← Vuốt trái hoặc vuốt phải để chọn →</span>
          </div>
        )}
      </div>

      {/* The Physical Reigns-style Card */}
      <div
        ref={cardRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerEnd}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerEnd}
        style={{
          transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        className="w-full cursor-grab active:cursor-grabbing relative select-none rounded-3xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-5 sm:p-6 overflow-hidden flex flex-col justify-between min-h-[420px] sm:min-h-[450px]"
      >
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none text-9xl">
          ★
        </div>

        {/* Swipe Decision Stamps Overlay */}
        {dragOffset.x < -35 && (
          <div className="absolute top-10 right-6 rotate-12 border-4 border-emerald-500 text-emerald-400 bg-slate-950/95 font-black text-sm sm:text-base px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider z-30 pointer-events-none animate-pulse">
            PHƯƠNG ÁN A
          </div>
        )}
        {dragOffset.x > 35 && (
          <div className="absolute top-10 left-6 -rotate-12 border-4 border-blue-500 text-blue-400 bg-slate-950/95 font-black text-sm sm:text-base px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider z-30 pointer-events-none animate-pulse">
            PHƯƠNG ÁN B
          </div>
        )}

        {/* Top Header of Card: Category & Term */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-red-950/80 text-red-300 border border-red-800/40">
              {dilemma.quarter}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700 truncate max-w-[190px]">
              {dilemma.category}
            </span>
          </div>
        </div>

        {/* Central Reigns Character Vector & Identity */}
        <div className="flex flex-col items-center justify-center my-auto py-2">
          {/* Minimalist Vector Silhouette Portrait Frame */}
          <div className="relative p-1.5 rounded-3xl bg-gradient-to-b from-amber-500/20 via-slate-800 to-slate-900 border-2 border-slate-600/60 shadow-xl mb-3">
            <AvatarVector
              id={dilemma.character.avatarId}
              size="w-24 h-24 sm:w-28 sm:h-28"
            />
            {/* Small emblem pin */}
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-bold text-amber-300 shadow">
              {dilemma.character.role}
            </div>
          </div>

          <h3 className="font-extrabold text-base sm:text-lg text-slate-100 tracking-tight mt-1 text-center">
            {dilemma.character.name}
          </h3>

          {/* Dialogue / Situation */}
          <p className="font-serif text-slate-100 text-sm sm:text-base leading-relaxed italic text-center px-2 mt-2">
            "{dilemma.situation}"
          </p>
        </div>

        {/* Card Footer: Subtle Help & Hint */}
        <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tư tưởng HCM Chương 4</span>
          </span>
          <span>Thẻ #{dilemma.id}/16</span>
        </div>
      </div>

      {/* Accessible Action Buttons for Mouse / Presentation Click */}
      <div className="w-full grid grid-cols-2 gap-3 mt-4">
        {/* Left Choice Button */}
        <button
          onClick={() => {
            playSound('stamp');
            onMakeChoice('left');
          }}
          onMouseEnter={() => {
            onPreviewImpact(dilemma.leftChoice.impact);
            setHoveredChoice('left');
          }}
          onMouseLeave={() => {
            onPreviewImpact(null);
            setHoveredChoice(null);
          }}
          className={`flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 text-left relative overflow-hidden group shadow-lg ${
            hoveredChoice === 'left'
              ? 'bg-emerald-950/80 border-emerald-500 scale-[1.02] shadow-emerald-950/50'
              : 'bg-slate-900/90 border-slate-800 hover:border-emerald-600/60'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-400 mb-1">
            <ChevronLeft className="w-4 h-4 stroke-[3] group-hover:-translate-x-0.5 transition-transform" />
            <span>Phương án A</span>
          </div>
          <p className="text-xs sm:text-[13px] font-semibold text-slate-200 line-clamp-3 leading-snug">
            {dilemma.leftChoice.text}
          </p>
        </button>

        {/* Right Choice Button */}
        <button
          onClick={() => {
            playSound('stamp');
            onMakeChoice('right');
          }}
          onMouseEnter={() => {
            onPreviewImpact(dilemma.rightChoice.impact);
            setHoveredChoice('right');
          }}
          onMouseLeave={() => {
            onPreviewImpact(null);
            setHoveredChoice(null);
          }}
          className={`flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 text-left relative overflow-hidden group shadow-lg ${
            hoveredChoice === 'right'
              ? 'bg-blue-950/80 border-blue-500 scale-[1.02] shadow-blue-950/50'
              : 'bg-slate-900/90 border-slate-800 hover:border-blue-600/60'
          }`}
        >
          <div className="flex items-center justify-between w-full text-xs font-black uppercase text-blue-400 mb-1">
            <span>Phương án B</span>
            <ChevronRight className="w-4 h-4 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-xs sm:text-[13px] font-semibold text-slate-200 line-clamp-3 leading-snug">
            {dilemma.rightChoice.text}
          </p>
        </button>
      </div>
    </div>
  );
}
