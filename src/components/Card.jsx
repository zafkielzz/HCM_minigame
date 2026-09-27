import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Info, Check } from 'lucide-react';
import { playSound } from '../utils/sound';
import AvatarVector from './AvatarVector';

export default function Card({ dilemma, onMakeChoice }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeChoice, setActiveChoice] = useState(null); // 'left' | 'right' | null
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const SWIPE_THRESHOLD = 75; // Pixels to trigger swipe

  // Pointer drag handling
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    startPos.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const deltaX = clientX - startPos.current.x;
    const deltaY = (clientY - startPos.current.y) * 0.15;

    setDragOffset({ x: deltaX, y: deltaY });

    if (deltaX < -25) {
      setActiveChoice('left');
    } else if (deltaX > 25) {
      setActiveChoice('right');
    } else {
      setActiveChoice(null);
    }
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x <= -SWIPE_THRESHOLD) {
      playSound('stamp');
      onMakeChoice('left');
    } else if (dragOffset.x >= SWIPE_THRESHOLD) {
      playSound('stamp');
      onMakeChoice('right');
    }

    setDragOffset({ x: 0, y: 0 });
    setActiveChoice(null);
  };

  // Keyboard navigation
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

  const rotation = dragOffset.x * 0.05;

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      {/* Clear Guidance Banner */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 mb-2">
        <span className="flex items-center gap-1.5 font-medium text-slate-300">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>Đọc sự vụ và chọn 1 trong 2 phương án bên dưới</span>
        </span>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Dùng phím mũi tên ← hoặc →
        </span>
      </div>

      {/* Main Situation Card */}
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
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        className="w-full cursor-grab active:cursor-grabbing relative select-none rounded-2xl bg-slate-900 border border-slate-700 shadow-lg p-5 overflow-hidden flex flex-col justify-between min-h-[360px]"
      >
        {/* Simple Administrative Stamps on Swipe */}
        {dragOffset.x < -30 && (
          <div className="absolute top-6 right-5 rotate-6 border-2 border-emerald-500 text-emerald-400 bg-slate-950 font-bold text-xs uppercase px-2.5 py-1 rounded shadow z-30 pointer-events-none">
            CHỌN PHƯƠNG ÁN A
          </div>
        )}
        {dragOffset.x > 30 && (
          <div className="absolute top-6 left-5 -rotate-6 border-2 border-blue-500 text-blue-400 bg-slate-950 font-bold text-xs uppercase px-2.5 py-1 rounded shadow z-30 pointer-events-none">
            CHỌN PHƯƠNG ÁN B
          </div>
        )}

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
            {dilemma.quarter}
          </span>
          <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-800">
            {dilemma.category}
          </span>
        </div>

        {/* Character Portrait & Role */}
        <div className="flex flex-col items-center justify-center my-auto py-2">
          <AvatarVector
            id={dilemma.character.avatarId}
            size="w-20 h-20 sm:w-24 sm:h-24"
            className="border border-slate-700 shadow-md mb-2.5"
          />

          <h3 className="font-bold text-base text-slate-100 text-center">
            {dilemma.character.name}
          </h3>
          <span className="text-xs text-amber-400/90 font-medium mb-3">
            {dilemma.character.role}
          </span>

          {/* Dialogue text in readable serif */}
          <p className="font-serif text-slate-200 text-sm sm:text-base leading-relaxed text-center px-1">
            "{dilemma.situation}"
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Hồ Chí Minh: Chương 4</span>
          <span>Sự vụ #{dilemma.id}/16</span>
        </div>
      </div>

      {/* Prominently Displayed Choices Below Card (Always Visible & Directly Clickable) */}
      <div className="w-full grid grid-cols-2 gap-2.5 mt-3">
        {/* Choice A */}
        <button
          onClick={() => {
            playSound('stamp');
            onMakeChoice('left');
          }}
          onMouseEnter={() => setActiveChoice('left')}
          onMouseLeave={() => setActiveChoice(null)}
          className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors relative ${
            activeChoice === 'left'
              ? 'bg-emerald-950/40 border-emerald-500 text-slate-100 ring-1 ring-emerald-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase text-emerald-400 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Phương án A (Vuốt Trái)</span>
          </div>
          <p className="text-xs sm:text-[13px] font-medium leading-snug">
            {dilemma.leftChoice.text}
          </p>
        </button>

        {/* Choice B */}
        <button
          onClick={() => {
            playSound('stamp');
            onMakeChoice('right');
          }}
          onMouseEnter={() => setActiveChoice('right')}
          onMouseLeave={() => setActiveChoice(null)}
          className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors relative ${
            activeChoice === 'right'
              ? 'bg-blue-950/40 border-blue-500 text-slate-100 ring-1 ring-blue-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between w-full text-[11px] font-bold uppercase text-blue-400 mb-1">
            <span>Phương án B (Vuốt Phải)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs sm:text-[13px] font-medium leading-snug">
            {dilemma.rightChoice.text}
          </p>
        </button>
      </div>
    </div>
  );
}
