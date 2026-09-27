import React from 'react';
import { Users, Scale, ShieldCheck, Zap } from 'lucide-react';

export default function IndicatorBar({ stats }) {
  const indicators = [
    {
      key: 'people',
      name: 'Lòng Dân',
      fullName: 'Bản chất Dân chủ (Vì Dân)',
      icon: Users,
      value: stats.people,
      barColor: 'bg-amber-500',
      textColor: 'text-amber-400',
      borderColor: 'border-slate-800'
    },
    {
      key: 'law',
      name: 'Pháp Quyền',
      fullName: 'Kỷ Cương Pháp Luật',
      icon: Scale,
      value: stats.law,
      barColor: 'bg-purple-500',
      textColor: 'text-purple-400',
      borderColor: 'border-slate-800'
    },
    {
      key: 'integrity',
      name: 'Liêm Chính',
      fullName: 'Chống Tham Ô & Tiết Kiệm Công Quỹ',
      icon: ShieldCheck,
      value: stats.integrity,
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      borderColor: 'border-slate-800'
    },
    {
      key: 'reform',
      name: 'Cải Cách',
      fullName: 'Hiệu Năng & Chuyển Đổi Số',
      icon: Zap,
      value: stats.reform,
      barColor: 'bg-blue-500',
      textColor: 'text-blue-400',
      borderColor: 'border-slate-800'
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl shadow-sm">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {indicators.map((ind) => {
          const Icon = ind.icon;
          const isDanger = ind.value <= 20;
          const isWarning = ind.value <= 35;

          return (
            <div 
              key={ind.key}
              className={`flex flex-col items-center p-2 rounded-lg border bg-slate-950/60 ${
                isDanger ? 'border-red-500/80 bg-red-950/20' : ind.borderColor
              }`}
              title={`${ind.fullName}: ${ind.value}/100`}
            >
              {/* Icon & Name */}
              <div className="flex items-center gap-1 mb-1">
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ind.textColor}`} />
                <span className="text-[11px] sm:text-xs font-semibold text-slate-200 hidden sm:inline">
                  {ind.name}
                </span>
              </div>

              {/* Value */}
              <div className="text-xs sm:text-sm font-bold tracking-tight mb-1">
                <span className={isDanger ? 'text-red-400 font-extrabold' : isWarning ? 'text-amber-300' : 'text-slate-100'}>
                  {ind.value}
                </span>
                <span className="text-[10px] text-slate-500 font-normal">/100</span>
              </div>

              {/* Clean Linear Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isDanger ? 'bg-red-500' : ind.barColor
                  }`}
                  style={{ width: `${Math.max(2, Math.min(100, ind.value))}%` }}
                />
              </div>

              {/* Mobile label */}
              <span className="text-[9px] font-medium text-slate-400 sm:hidden mt-0.5">
                {ind.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
