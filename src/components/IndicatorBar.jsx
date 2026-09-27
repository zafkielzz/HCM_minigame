import React from 'react';
import { Users, Scale, ShieldCheck, Zap, ArrowUp, ArrowDown } from 'lucide-react';

export default function IndicatorBar({ stats, previewImpact }) {
  const indicators = [
    {
      key: 'people',
      name: 'Lòng Dân',
      fullName: 'Bản chất Dân chủ (Vì Dân)',
      icon: Users,
      value: stats.people,
      color: 'from-amber-500 to-yellow-400',
      bgColor: 'bg-amber-950/40',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400'
    },
    {
      key: 'law',
      name: 'Pháp Quyền',
      fullName: 'Kỷ Cương Pháp Luật',
      icon: Scale,
      value: stats.law,
      color: 'from-purple-500 to-indigo-400',
      bgColor: 'bg-purple-950/40',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400'
    },
    {
      key: 'integrity',
      name: 'Liêm Chính',
      fullName: 'Chống Tham Ô & Công Quỹ',
      icon: ShieldCheck,
      value: stats.integrity,
      color: 'from-emerald-500 to-teal-400',
      bgColor: 'bg-emerald-950/40',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400'
    },
    {
      key: 'reform',
      name: 'Cải Cách',
      fullName: 'Hiệu Lực & Số Hóa',
      icon: Zap,
      value: stats.reform,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-950/40',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400'
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-3 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {indicators.map((ind) => {
          const Icon = ind.icon;
          const impact = previewImpact ? previewImpact[ind.key] : 0;
          const isDanger = ind.value <= 25;
          const isWarning = ind.value <= 40;

          return (
            <div 
              key={ind.key}
              className={`relative flex flex-col items-center p-2 rounded-xl border transition-all duration-300 ${ind.bgColor} ${ind.borderColor} ${
                isDanger ? 'animate-pulse ring-2 ring-red-500/50' : ''
              }`}
              title={ind.fullName}
            >
              {/* Impact Indicator Dot / Arrow (Reigns style) */}
              {previewImpact && impact !== 0 && (
                <div className="absolute -top-2.5 right-1/2 translate-x-1/2 z-20 flex items-center justify-center">
                  {impact > 0 ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                      <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                      <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              )}

              {/* Icon & Label */}
              <div className="flex items-center gap-1 mb-1">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${ind.textColor}`} />
                <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-200 hidden sm:inline">
                  {ind.name}
                </span>
              </div>

              {/* Numerical Value */}
              <div className="text-xs sm:text-sm font-extrabold tracking-wide mb-1.5 flex items-baseline gap-0.5">
                <span className={isDanger ? 'text-red-400 font-black' : isWarning ? 'text-amber-300' : 'text-slate-100'}>
                  {ind.value}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">/100</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${ind.color} transition-all duration-500 ease-out`}
                  style={{ width: `${Math.max(4, Math.min(100, ind.value))}%` }}
                />
              </div>

              {/* Mobile label */}
              <span className="text-[9px] font-semibold text-slate-400 sm:hidden mt-0.5">
                {ind.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
