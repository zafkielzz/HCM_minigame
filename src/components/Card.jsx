import React, { useState, useRef, useEffect } from 'react';
import { playSound } from '../utils/sound';
import AvatarVector from './AvatarVector';
import { Hand } from 'lucide-react';

export default function Card({ dilemma, onMakeChoice }) {
  // Only maintain discrete visual zone in React state ('none' | 'left' | 'right' | 'commit-left' | 'commit-right')
  // This eliminates 60-120 full React re-renders per second down to ONLY 2-3 state updates per swipe!
  const [dragZone, setDragZone] = useState('none');
  const [isDragging, setIsDragging] = useState(false);

  const cardRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const currentZone = useRef('none');
  const rafPending = useRef(false);

  const SWIPE_THRESHOLD = 85; // Distance in px to commit decision

  const handleStart = (clientX, clientY) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
    currentPos.current = { x: 0, y: 0 };
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
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
      if (!isDraggingRef.current) return;
      const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      const deltaX = clientX - startPos.current.x;
      const deltaY = (clientY - startPos.current.y) * 0.15;
      currentPos.current = { x: deltaX, y: deltaY };

      // Discrete zone calculation (only re-renders React when zone changes!)
      let newZone = 'none';
      if (deltaX <= -SWIPE_THRESHOLD) newZone = 'commit-left';
      else if (deltaX >= SWIPE_THRESHOLD) newZone = 'commit-right';
      else if (deltaX < -22) newZone = 'left';
      else if (deltaX > 22) newZone = 'right';

      if (newZone !== currentZone.current) {
        currentZone.current = newZone;
        setDragZone(newZone);
      }

      // Hardware-accelerated 60/120 FPS card movement directly on compositor
      if (!rafPending.current) {
        rafPending.current = true;
        requestAnimationFrame(() => {
          rafPending.current = false;
          if (cardRef.current && isDraggingRef.current) {
            const rot = currentPos.current.x * 0.055;
            cardRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0px) rotate(${rot}deg)`;
          }
        });
      }
    };

    const handleEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      const finalX = currentPos.current.x;
      currentZone.current = 'none';
      setDragZone('none');

      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        cardRef.current.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
      }

      if (finalX <= -SWIPE_THRESHOLD) {
        playSound('stamp');
        onMakeChoice('left');
      } else if (finalX >= SWIPE_THRESHOLD) {
        playSound('stamp');
        onMakeChoice('right');
      }

      currentPos.current = { x: 0, y: 0 };
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove, { passive: true });
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: true });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, onMakeChoice]);

  const isLeft = dragZone === 'left' || dragZone === 'commit-left';
  const isRight = dragZone === 'right' || dragZone === 'commit-right';
  const isCommitReadyLeft = dragZone === 'commit-left';
  const isCommitReadyRight = dragZone === 'commit-right';

  return (
    <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center select-none px-2 sm:px-4">
      {/* Mobile Top Active Banner (shown on mobile when dragging) */}
      <div className="md:hidden w-full h-20 flex items-center justify-center mb-2 text-center">
        {isLeft ? (
          <div className={`w-full border-2 text-xs sm:text-sm py-2 px-3 rounded-xl shadow-md text-left transition-colors duration-150 ${
            isCommitReadyLeft ? 'bg-emerald-100 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500' : 'bg-emerald-50 border-emerald-500 text-emerald-950'
          }`}>
            <span className="title-1st text-emerald-700 block text-xs tracking-wider mb-0.5">
              ← {isCommitReadyLeft ? '✓ THẢ TAY ĐỂ CHỌN PHƯƠNG ÁN A' : 'PHƯƠNG ÁN A'}
            </span>
            <span className="font-typewriter leading-snug text-xs sm:text-sm font-semibold">{dilemma.leftChoice.text}</span>
          </div>
        ) : isRight ? (
          <div className={`w-full border-2 text-xs sm:text-sm py-2 px-3 rounded-xl shadow-md text-right transition-colors duration-150 ${
            isCommitReadyRight ? 'bg-blue-100 border-blue-600 text-blue-950 ring-2 ring-blue-500' : 'bg-blue-50 border-blue-500 text-blue-950'
          }`}>
            <span className="title-1st text-blue-700 block text-xs tracking-wider mb-0.5">
              {isCommitReadyRight ? '✓ THẢ TAY ĐỂ CHỌN PHƯƠNG ÁN B' : 'PHƯƠNG ÁN B'} →
            </span>
            <span className="font-typewriter leading-snug text-xs sm:text-sm font-semibold">{dilemma.rightChoice.text}</span>
          </div>
        ) : (
          <div className="text-amber-100/90 text-xs tracking-wide bg-red-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-red-800/60 flex items-center gap-1.5 shadow-md">
            <Hand className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span>Kéo thẻ sang trái (A) hoặc sang phải (B) rồi thả tay</span>
          </div>
        )}
      </div>

      {/* Main 3-Column Split Cockpit: Pure Swipe/Drag Interactive Layout */}
      <div className="w-full flex items-center justify-between gap-5 lg:gap-8">
        
        {/* LEFT PANEL: PHƯƠNG ÁN A */}
        <div 
          className={`hidden md:flex flex-1 flex-col justify-between p-7 lg:p-8 xl:p-9 rounded-3xl border-2 transition-colors duration-150 min-h-[480px] sm:min-h-[520px] text-left select-none pointer-events-none ${
            isLeft 
              ? isCommitReadyLeft
                ? 'bg-emerald-100 border-emerald-600 text-emerald-950 shadow-xl ring-2 ring-emerald-500/50 opacity-100'
                : 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-lg ring-1 ring-emerald-400/30 opacity-95'
              : 'bg-white/95 border-slate-200 text-slate-700 opacity-70 shadow-md'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-200">
              <span className={`title-1st tracking-wider flex items-center gap-1.5 ${isLeft ? 'text-emerald-700' : 'text-slate-500'}`}>
                <span>← PHƯƠNG ÁN A</span>
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded font-bold uppercase ${isLeft ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-500'}`}>
                Mục tiêu Trái
              </span>
            </div>

            <p className={`font-typewriter text-base sm:text-lg xl:text-xl leading-relaxed transition-colors ${
              isLeft ? 'text-emerald-950 font-bold' : 'text-slate-800'
            }`}>
              "{dilemma.leftChoice.text}"
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs sm:text-sm">
            {isCommitReadyLeft ? (
              <span className="text-emerald-700 font-black uppercase tracking-wide flex items-center gap-1.5 animate-pulse text-sm">
                ✓ Thả chuột để chốt Phương án A!
              </span>
            ) : isLeft ? (
              <span className="text-emerald-600 font-bold uppercase tracking-wide flex items-center gap-1.5">
                ← Kéo thêm một chút để chốt...
              </span>
            ) : (
              <span className="text-slate-400 italic">
                Kéo thẻ sang bên trái màn hình để chọn
              </span>
            )}
          </div>
        </div>

        {/* CENTER: PHYSICAL DRAGGABLE REIGNS EVENT CARD */}
        <div className="w-full max-w-[420px] sm:max-w-[460px] shrink-0">
          <div
            ref={cardRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              willChange: 'transform',
              touchAction: 'none'
            }}
            className="w-full cursor-grab active:cursor-grabbing relative select-none rounded-3xl bg-white border-2 border-slate-200/90 shadow-2xl p-7 sm:p-8 overflow-hidden flex flex-col justify-between min-h-[480px] sm:min-h-[520px] hover:shadow-3xl"
          >
            {/* Crisp Physical Stamps with Barber Fill Font */}
            {isLeft && (
              <div className={`absolute top-9 right-7 rotate-6 border-3 title-1st uppercase px-4 py-2 rounded-xl shadow-xl pointer-events-none z-20 transition-transform duration-100 ${
                isCommitReadyLeft 
                  ? 'border-emerald-600 text-emerald-800 bg-emerald-50 scale-110 ring-2 ring-emerald-500' 
                  : 'border-emerald-500 text-emerald-700 bg-white/95 opacity-90'
              }`}>
                PHƯƠNG ÁN A
              </div>
            )}
            {isRight && (
              <div className={`absolute top-9 left-7 -rotate-6 border-3 title-1st uppercase px-4 py-2 rounded-xl shadow-xl pointer-events-none z-20 transition-transform duration-100 ${
                isCommitReadyRight 
                  ? 'border-blue-600 text-blue-800 bg-blue-50 scale-110 ring-2 ring-blue-500' 
                  : 'border-blue-500 text-blue-700 bg-white/95 opacity-90'
              }`}>
                PHƯƠNG ÁN B
              </div>
            )}

            {/* Card Header: Quarter & Category */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
              <span className="title-1st text-red-700 tracking-wider text-sm sm:text-base">
                {dilemma.quarter}
              </span>
              <span className="text-xs font-semibold text-slate-700 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 truncate max-w-[210px]">
                {dilemma.category}
              </span>
            </div>

            {/* Card Character Avatar & Portrait */}
            <div className="flex flex-col items-center justify-center my-auto py-3 pointer-events-none">
              <AvatarVector
                id={dilemma.character.avatarId}
                size="w-28 h-28 sm:w-36 sm:h-36"
                className="border-2 border-slate-200 shadow-md mb-3 bg-slate-50"
              />

              <h3 className="title-1st text-slate-900 text-center tracking-wide text-lg sm:text-xl">
                {dilemma.character.name}
              </h3>
              <span className="text-xs sm:text-sm text-amber-700 font-bold mb-3">
                {dilemma.character.role}
              </span>

              {/* Dialogue / Situation text (Typewriter Font) */}
              <p className="font-typewriter text-slate-800 text-base sm:text-[18px] leading-relaxed text-center px-1 font-medium">
                "{dilemma.situation}"
              </p>
            </div>

            {/* Card Footer: Drag Indicator Hint */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 pointer-events-none">
              <span className="font-medium text-slate-500 flex items-center gap-1">
                <Hand className="w-3.5 h-3.5 text-amber-600" />
                <span>Kéo thẻ sang 2 bên</span>
              </span>
              <span>Sự vụ #{dilemma.id}/16</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: PHƯƠNG ÁN B */}
        <div 
          className={`hidden md:flex flex-1 flex-col justify-between p-7 lg:p-8 xl:p-9 rounded-3xl border-2 transition-colors duration-150 min-h-[480px] sm:min-h-[520px] text-right select-none pointer-events-none ${
            isRight 
              ? isCommitReadyRight
                ? 'bg-blue-100 border-blue-600 text-blue-950 shadow-xl ring-2 ring-blue-500/50 opacity-100'
                : 'bg-blue-50 border-blue-500 text-blue-950 shadow-lg ring-1 ring-blue-400/30 opacity-95'
              : 'bg-white/95 border-slate-200 text-slate-700 opacity-70 shadow-md'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-200">
              <span className={`text-[11px] px-2 py-0.5 rounded font-bold uppercase ${isRight ? 'bg-blue-200 text-blue-900' : 'bg-slate-100 text-slate-500'}`}>
                Mục tiêu Phải
              </span>
              <span className={`title-1st tracking-wider flex items-center gap-1.5 ${isRight ? 'text-blue-700' : 'text-slate-500'}`}>
                <span>PHƯƠNG ÁN B →</span>
              </span>
            </div>

            <p className={`font-typewriter text-base sm:text-lg xl:text-xl leading-relaxed transition-colors ${
              isRight ? 'text-blue-950 font-bold' : 'text-slate-800'
            }`}>
              "{dilemma.rightChoice.text}"
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs sm:text-sm">
            {isCommitReadyRight ? (
              <span className="text-blue-700 font-black uppercase tracking-wide flex items-center justify-end gap-1.5 animate-pulse text-sm">
                ✓ Thả chuột để chốt Phương án B!
              </span>
            ) : isRight ? (
              <span className="text-blue-600 font-bold uppercase tracking-wide flex items-center justify-end gap-1.5">
                Kéo thêm một chút để chốt... →
              </span>
            ) : (
              <span className="text-slate-400 italic">
                Kéo thẻ sang bên phải màn hình để chọn
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Guiding Footer Tip */}
      <div className="hidden md:flex items-center justify-center gap-2 text-xs text-amber-200/90 font-medium mt-3 bg-red-950/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-red-800/60 shadow-md">
        <Hand className="w-3.5 h-3.5 text-amber-300" />
        <span>Giữ chuột và kéo thẻ sang trái (Phương án A) hoặc sang phải (Phương án B) rồi thả tay để ra quyết định</span>
      </div>
    </div>
  );
}
