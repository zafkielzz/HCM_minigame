import React from 'react';
import { AlertCircle, LogOut, ArrowLeft } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function ConfirmModal({ 
  isOpen, 
  title = "Xác nhận quay về Trang chủ", 
  message, 
  confirmText = "Xác nhận rời", 
  cancelText = "Tiếp tục công vụ",
  isDanger = false,
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-2xl animate-scaleUp">
        <div className="flex items-start gap-3.5 mb-4">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
            isDanger ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-amber-100 text-amber-700 border-amber-300'
          }`}>
            <AlertCircle className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
              {message}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 mt-2">
          <button
            onClick={() => {
              playSound('select');
              onCancel();
            }}
            className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{cancelText}</span>
          </button>

          <button
            onClick={() => {
              playSound('select');
              onConfirm();
            }}
            className={`py-2.5 px-4 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5 ${
              isDanger 
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' 
                : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
