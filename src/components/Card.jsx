import React, { useState, useRef, useEffect } from 'react';
import { playSound } from '../utils/sound';
import AvatarVector from './AvatarVector';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function Card({ dilemma, onMakeChoice }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const SWIPE_THRESHOLD = 85; // Distance to commit decision

  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        playSound('stamp');
        onMakeChoice('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        playSound('stamp');
        onMakeChoice('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMakeChoice]);

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
    <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center select-none px-2 sm:px-4">
      {/* Mobile Top Active Banner (shown on mobile when dragging) */}
      <div className="md:hidden w-full h-20 flex items-center justify-center mb-2 text-center">
        {isLeft ? (
          <div className="w-full bg-emerald-50 border-2 border-emerald-600 text-emerald-950 text-xs sm:text-sm font-semibold py-2 px-3 rounded-xl shadow-md text-left transition-all">
            <span className="text-emerald-700 font-bold block text-[10px] uppercase tracking-wider mb-0.5">
              ← Phương án A
            </span>
            <span className="leading-snug">{dilemma.leftChoice.text}</span>
          </div>
        ) : isRight ? (
          <div className="w-full bg-blue-50 border-2 border-blue-600 text-blue-950 text-xs sm:text-sm font-semibold py-2 px-3 rounded-xl shadow-md text-right transition-all">
            <span className="text-blue-700 font-bold block text-[10px] uppercase tracking-wider mb-0.5">
              Phương án B →
            </span>
            <span className="leading-snug">{dilemma.rightChoice.text}</span>
          </div>
        ) : (
          <div className="text-amber-100/90 text-xs tracking-wide bg-red-950/40 px-3 py-1.5 rounded-full border border-red-800/40">
            ← Vuốt thẻ sang trái (A) hoặc sang phải (B) →
          </div>
        )}
      </div>

      {/* Main 3-Column Split Cockpit: Bright Civic Palette with Wide Center Card */}
      <div className="w-full flex items-center justify-between gap-5 lg:gap-8">
        
        {/* LEFT PANEL: PHƯƠNG ÁN A (Spacious, Clickable, Emerald Highlight) */}
        <div 
          onClick={() => {
            playSound('stamp');
            onMakeChoice('left');
          }}
          className={`hidden md:flex flex-1 flex-col justify-between p-6 lg:p-8 xl:p-9 rounded-3xl border-2 transition-all duration-200 min-h-[480px] sm:min-h-[520px] text-left cursor-pointer group ${
            isLeft 
              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 scale-[1.02] shadow-2xl ring-4 ring-emerald-500/30 opacity-100 translate-x-1'
              : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-xl shadow-md'
          }`}
          title="Bấm vào đây hoặc nhấn phím ← để chốt Phương án A"
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-200">
              <span className={`text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5 ${isLeft ? 'text-emerald-700' : 'text-emerald-600'}`}>
                <span>← PHƯƠNG ÁN A</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                Phím [←]
              </span>
            </div>

            <p className={`text-base sm:text-lg xl:text-xl font-bold leading-relaxed transition-colors ${
              isLeft ? 'text-emerald-950' : 'text-slate-800 group-hover:text-emerald-950'
            }`}>
              "{dilemma.leftChoice.text}"
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSound('stamp');
                onMakeChoice('left');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:bg-emerald-700 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Chốt Phương Án A</span>
            </button>
          </div>
        </div>

        {/* CENTER: WIDER PHYSICAL EVENT CARD (Expanded width, bright white paper aesthetic) */}
        <div className="w-full max-w-[420px] sm:max-w-[460px] shrink-0">
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            className="w-full cursor-grab active:cursor-grabbing relative select-none rounded-3xl bg-white border-2 border-slate-200/90 shadow-2xl p-7 sm:p-8 overflow-hidden flex flex-col justify-between min-h-[480px] sm:min-h-[520px]"
          >
            {/* Crisp Decision Stamps */}
            {dragOffset.x < -30 && (
              <div className="absolute top-10 right-8 rotate-6 border-3 border-emerald-600 text-emerald-700 bg-white font-black text-xs sm:text-sm uppercase px-4 py-2 rounded-xl shadow-lg pointer-events-none z-20">
                PHƯƠNG ÁN A
              </div>
            )}
            {dragOffset.x > 30 && (
              <div className="absolute top-10 left-8 -rotate-6 border-3 border-blue-600 text-blue-700 bg-white font-black text-xs sm:text-sm uppercase px-4 py-2 rounded-xl shadow-lg pointer-events-none z-20">
                PHƯƠNG ÁN B
              </div>
            )}

            {/* Card Header: Quarter & Category */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
              <span className="text-xs sm:text-sm font-black text-red-700 uppercase tracking-wide">
                {dilemma.quarter}
              </span>
              <span className="text-xs font-semibold text-slate-700 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 truncate max-w-[210px]">
                {dilemma.category}
              </span>
            </div>

            {/* Card Character Avatar & Portrait */}
            <div className="flex flex-col items-center justify-center my-auto py-3">
              <AvatarVector
                id={dilemma.character.avatarId}
                size="w-28 h-28 sm:w-36 sm:h-36"
                className="border-2 border-slate-200 shadow-md mb-3.5 bg-slate-50"
              />

              <h3 className="font-black text-lg sm:text-xl text-slate-900 text-center tracking-tight">
                {dilemma.character.name}
              </h3>
              <span className="text-xs sm:text-sm text-amber-700 font-bold mb-3">
                {dilemma.character.role}
              </span>

              {/* Dialogue / Situation text */}
              <p className="font-serif text-slate-800 text-base sm:text-lg leading-relaxed text-center px-1">
                "{dilemma.situation}"
              </p>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-500">Tư tưởng Hồ Chí Minh: Chương 4</span>
              <span>Sự vụ #{dilemma.id}/16</span>
            </div>
          </div>

          {/* Mobile Direct Action Buttons below the card */}
          <div className="md:hidden grid grid-cols-2 gap-2.5 w-full mt-3">
            <button
              onClick={() => {
                playSound('stamp');
                onMakeChoice('left');
              }}
              className="p-3 bg-emerald-600 active:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-lg flex flex-col items-center justify-center text-center gap-1 transition-transform active:scale-95"
            >
              <span className="text-[10px] uppercase font-black bg-emerald-800/60 px-2 py-0.5 rounded">
                ← Chọn Phương án A
              </span>
              <span className="line-clamp-2 text-[11px] font-normal leading-snug">
                {dilemma.leftChoice.text}
              </span>
            </button>

            <button
              onClick={() => {
                playSound('stamp');
                onMakeChoice('right');
              }}
              className="p-3 bg-blue-600 active:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-lg flex flex-col items-center justify-center text-center gap-1 transition-transform active:scale-95"
            >
              <span className="text-[10px] uppercase font-black bg-blue-800/60 px-2 py-0.5 rounded">
                Chọn Phương án B →
              </span>
              <span className="line-clamp-2 text-[11px] font-normal leading-snug">
                {dilemma.rightChoice.text}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: PHƯƠNG ÁN B (Spacious, Clickable, Blue Highlight) */}
        <div 
          onClick={() => {
            playSound('stamp');
            onMakeChoice('right');
          }}
          className={`hidden md:flex flex-1 flex-col justify-between p-6 lg:p-8 xl:p-9 rounded-3xl border-2 transition-all duration-200 min-h-[480px] sm:min-h-[520px] text-right cursor-pointer group ${
            isRight 
              ? 'bg-blue-50 border-blue-600 text-blue-950 scale-[1.02] shadow-2xl ring-4 ring-blue-500/30 opacity-100 -translate-x-1'
              : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-xl shadow-md'
          }`}
          title="Bấm vào đây hoặc nhấn phím → để chốt Phương án B"
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-200">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                Phím [→]
              </span>
              <span className={`text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5 ${isRight ? 'text-blue-700' : 'text-blue-600'}`}>
                <span>PHƯƠNG ÁN B →</span>
              </span>
            </div>

            <p className={`text-base sm:text-lg xl:text-xl font-bold leading-relaxed transition-colors ${
              isRight ? 'text-blue-950' : 'text-slate-800 group-hover:text-blue-950'
            }`}>
              "{dilemma.rightChoice.text}"
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSound('stamp');
                onMakeChoice('right');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:bg-blue-700 cursor-pointer"
            >
              <span>Chốt Phương Án B</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

      </div>

      {/* Desktop Keyboard hint & helper footer */}
      <div className="hidden md:flex items-center justify-center gap-4 text-xs text-amber-200/90 font-medium mt-3 bg-red-950/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-red-800/40">
        <span>⌨️ <strong>Phím tắt:</strong> [← hoặc A]: Chọn Phương án A</span>
        <span>•</span>
        <span>[→ hoặc D]: Chọn Phương án B</span>
        <span>•</span>
        <span>Hoặc kéo chuột / bấm trực tiếp vào 2 khối</span>
      </div>
    </div>
  );
}
