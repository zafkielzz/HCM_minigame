import React from 'react';
import { Play, BookOpen, Trophy, Users, Scale, ShieldCheck, Zap } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function IntroScreen({ onStart, onOpenHandbook, onOpenLeaderboard }) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl animate-fadeIn flex flex-col justify-between my-auto max-h-[92vh] overflow-y-auto">
      <div>
        {/* Emblem & Header */}
        <div className="text-center mb-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-600 text-yellow-300 flex items-center justify-center text-3xl font-black shadow-lg shadow-red-200 border-2 border-yellow-400 mb-3">
            ★
          </div>
          <span className="title-1st text-red-700 tracking-wider block mb-1">
            TƯ TƯỞNG HỒ CHÍ MINH
          </span>
          <h1 className="title-2nd text-red-600 tracking-wider">
            GHẾ CÔNG BỘC
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Chương 4: Xây dựng Nhà nước của dân, do dân, vì dân & Cải cách hành chính
          </p>
        </div>

        {/* Story Intro */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-typewriter text-xs sm:text-sm text-slate-800 leading-relaxed mb-4">
          <p className="mb-2">
            🏛️ <strong>Bối cảnh:</strong> Bạn vừa được nhân dân tín nhiệm bầu vào cương vị người đứng đầu chính quyền địa phương nhiệm kỳ 4 năm (16 Quý).
          </p>
          <p>
            Mỗi quý, bạn phải giải quyết 1 đại sự vụ thực tế. Mỗi quyết sách đều có <strong>sự đánh đổi (Trade-off)</strong> tác động trực tiếp đến 4 cán cân quản trị quốc gia.
          </p>
        </div>

        {/* Strategic Balance & End Game Rules Box */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-2xl border-2 border-amber-300/80 mb-4 text-xs text-amber-950 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 font-black text-amber-900 text-xs uppercase tracking-wide">
            <Scale className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Quy luật Cân bằng & Sống còn (Game Rules)</span>
          </div>

          <div className="space-y-2 leading-relaxed">
            <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/80">
              <span className="text-amber-800 font-black text-sm shrink-0">⚖️</span>
              <div>
                <strong className="text-amber-900 block font-bold mb-0.5">Suy nghĩ kỹ để cân bằng - Tránh chạm đáy:</strong>
                <span className="text-slate-700">
                  Không có quyết sách nào toàn màu hồng! Chọn tăng chỉ số này có thể làm giảm chỉ số khác. Hãy luôn theo dõi 4 thanh chỉ số trên đỉnh màn hình: <strong>Bất kỳ chỉ số nào rơi về 0 điểm là bạn sẽ bị bãi miễn cách chức ngay lập tức!</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="font-bold text-emerald-800 block text-[11px] mb-0.5">✓ Mục tiêu Thắng:</span>
                <span className="text-[11px] text-slate-700 leading-tight block">
                  Trụ vững trọn vẹn <strong>16 Quý</strong> và giữ điểm trung bình các chỉ số ở mức cao nhất.
                </span>
              </div>

              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                <span className="font-bold text-rose-800 block text-[11px] mb-0.5">✕ Cảnh báo 2 Bẫy Cực đoan:</span>
                <span className="text-[11px] text-slate-700 leading-tight block">
                  Tránh bệnh <strong>"Mị dân"</strong> (quá chiều dân phá kỷ cương) hoặc <strong>"Quan cách mạng"</strong> (độc đoán xa dân).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Indicators Deep Meaning */}
        <div className="grid grid-cols-2 gap-2 text-left mb-5 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Lòng Dân</span>
            </div>
            <span className="text-slate-500 text-[10px] leading-tight">Lấy dân làm gốc, bảo đảm ấm no & niềm tin</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Scale className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Pháp Quyền</span>
            </div>
            <span className="text-slate-500 text-[10px] leading-tight">Thần linh pháp quyền, kỷ cương không ngoại lệ</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Liêm Chính</span>
            </div>
            <span className="text-slate-500 text-[10px] leading-tight">Cần kiệm liêm chính, quét sạch giặc nội xâm</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Zap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Cải Cách</span>
            </div>
            <span className="text-slate-500 text-[10px] leading-tight">Hiệu năng số hóa, phục vụ dân nhanh gọn</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={() => {
            playSound('select');
            onStart();
          }}
          className="w-full py-3.5 px-5 rounded-xl font-bold text-sm uppercase tracking-wide bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-2 transition-colors"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Bắt đầu chơi cá nhân</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Trophy className="w-4 h-4 text-amber-700" />
          <span>🏆 Vào Đấu Phòng Lớp Học (Thi đấu tập thể)</span>
        </button>

        <button
          onClick={onOpenHandbook}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Tra cứu Sổ tay Lý luận Chương 4</span>
        </button>
      </div>
    </div>
  );
}
