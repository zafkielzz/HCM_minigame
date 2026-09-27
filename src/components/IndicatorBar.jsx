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
      textColor: 'text-amber-600',
      borderColor: 'border-slate-200'
    },
    {
      key: 'law',
      name: 'Pháp Quyền',
      fullName: 'Kỷ Cương Pháp Luật',
      icon: Scale,
      value: stats.law,
      barColor: 'bg-purple-600',
      textColor: 'text-purple-600',
      borderColor: 'border-slate-200'
    },
    {
      key: 'integrity',
      name: 'Liêm Chính',
      fullName: 'Chống Tham Ô & Tiết Kiệm Công Quỹ',
      icon: ShieldCheck,
      value: stats.integrity,
      barColor: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      borderColor: 'border-slate-200'
    },
    {
      key: 'reform',
      name: 'Cải Cách',
      fullName: 'Hiệu Năng & Chuyển Đổi Số',
      icon: Zap,
      value: stats.reform,
      barColor: 'bg-blue-600',
      textColor: 'text-blue-600',
      borderColor: 'border-slate-200'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        {indicators.map((ind) => {
          const Icon = ind.icon;
          const isDanger = ind.value <= 20;
          const isWarning = ind.value <= 35;

          return (
            <div 
              key={ind.key}
              className={`flex flex-col items-center p-2.5 sm:p-3 rounded-xl border bg-slate-50/70 transition-all ${
                isDanger ? 'border-red-400 bg-red-50 ring-1 ring-red-400/50' : ind.borderColor
              }`}
              title={`${ind.fullName}: ${ind.value}/100`}
            >
              {/* Icon & Name */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${ind.textColor}`} />
                <span className="text-xs sm:text-sm font-bold text-slate-800 hidden sm:inline">
                  {ind.name}
                </span>
              </div>

              {/* Value */}
              <div className="text-sm sm:text-base font-black tracking-tight mb-1.5">
                <span className={isDanger ? 'text-red-600 font-black' : isWarning ? 'text-amber-600 font-bold' : 'text-slate-900 font-black'}>
                  {ind.value}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">/100</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isDanger ? 'bg-red-600' : ind.barColor
                  }`}
                  style={{ width: `${Math.max(2, Math.min(100, ind.value))}%` }}
                />
              </div>

              {/* Mobile label */}
              <span className="text-[10px] font-semibold text-slate-600 sm:hidden mt-1">
                {ind.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
