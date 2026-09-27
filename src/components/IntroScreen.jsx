import React from 'react';
import { Play, BookOpen, AlertTriangle, Trophy, CheckCircle, Scale, Users, ShieldCheck, Zap } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function IntroScreen({ onStart, onOpenHandbook }) {
  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl animate-fadeIn flex flex-col justify-between">
      <div>
        {/* Emblem & Header */}
        <div className="text-center mb-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-red-700 text-yellow-300 flex items-center justify-center text-2xl font-black shadow-md border border-yellow-500/50 mb-2.5">
            ★
          </div>
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-800/60 inline-block mb-1">
            Môn học Tư tưởng Hồ Chí Minh
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            GHẾ CÔNG BỘC
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chương 4: Nhà nước của dân, do dân, vì dân & Cải cách hành chính
          </p>
        </div>

        {/* Story Intro */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          <p className="mb-1.5">
            🏛️ <strong>Bối cảnh:</strong> Bạn được tín nhiệm bầu làm người đứng đầu chính quyền địa phương nhiệm kỳ 4 năm (16 Quý).
          </p>
          <p>
            Mỗi quý, bạn phải giải quyết 1 sự vụ thực tế. Lựa chọn của bạn sẽ tác động trực tiếp đến 4 cán cân: <strong>Lòng Dân, Pháp Quyền, Liêm Chính</strong> và <strong>Cải Cách Hành Chính</strong>.
          </p>
        </div>

        {/* End Game Rules Clarification Box */}
        <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/30 mb-5 text-xs text-slate-300 space-y-2.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs uppercase tracking-wide">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Quy luật Thắng / Thua (Cơ chế End Game)</span>
          </div>

          <div className="space-y-1.5 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓ Điều kiện Thắng:</span>
              <span>
                <strong>Trụ vững qua trọn vẹn 16 Quý (4 năm nhiệm kỳ)</strong> mà không để bất kỳ chỉ số nào rơi về 0. 
                <em> (Không cần phải đạt 100 điểm tất cả, cốt lõi là giữ vững sự cân bằng, hài hòa giữa các cán cân).</em>
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕ Điều kiện Thua:</span>
              <span>
                Bị cách chức hoặc bãi miễn ngay lập tức khi <strong>bất kỳ chỉ số nào chạm mức 0 điểm</strong>, hoặc mắc phải bẫy tư tưởng cực đoan (Bệnh "Mị dân" hay "Quan cách mạng").
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold shrink-0">ℹ️ Cách chơi:</span>
              <span>
                Đọc sự vụ → Chọn Phương án A hoặc B bằng cách bấm nút trực tiếp, dùng phím mũi tên hoặc quẹt thẻ. 
                <strong> Chỉ số tăng/giảm sẽ được chấm điểm và hiển thị ngay sau khi bạn chốt quyết định!</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Indicators Mini Preview */}
        <div className="grid grid-cols-2 gap-2 text-left mb-5 text-xs">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-medium">Lòng Dân (Vì dân)</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-slate-300 font-medium">Pháp Quyền (Kỷ cương)</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">Liêm Chính (Chống tham nhũng)</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-slate-300 font-medium">Cải Cách (Một cửa, VNeID)</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => {
            playSound('select');
            onStart();
          }}
          className="w-full py-3.5 px-5 rounded-xl font-bold text-sm uppercase tracking-wide bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md flex items-center justify-center gap-2 transition-colors"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Bắt đầu nhậm chức (Vào chơi)</span>
        </button>

        <button
          onClick={onOpenHandbook}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Tra cứu Sổ tay Lý luận Chương 4</span>
        </button>
      </div>
    </div>
  );
}
