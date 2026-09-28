import React from 'react';
import { Play, BookOpen, Trophy, Users, Scale, ShieldCheck, Zap, Sparkles, AlertTriangle } from 'lucide-react';
import { playSound } from '../utils/sound';

export default function IntroScreen({ onStart, onOpenHandbook, onOpenLeaderboard }) {
  const [customName, setCustomName] = React.useState(() => {
    try {
      return sessionStorage.getItem('hcm_tab_player_name') || '';
    } catch (e) {
      return '';
    }
  });

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl animate-fadeIn">
      {/* Top Banner & Title */}
      <div className="text-center pb-6 mb-6 border-b border-slate-200">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-yellow-300 flex items-center justify-center text-2xl font-black shadow-lg shadow-red-200 border-2 border-yellow-400">
            ★
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-red-100 text-red-700 border border-red-200">
            Giáo trình Tư tưởng Hồ Chí Minh • Chương 4
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-600 tracking-tight font-serif uppercase">
          GHẾ CÔNG BỘC: CÁN CÂN QUYỀN LỰC
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1.5 font-medium max-w-2xl mx-auto">
          Mô phỏng nghệ thuật quản trị và ra quyết định chính sách theo tư tưởng: <span className="text-red-700 font-bold">"Xây dựng Nhà nước của dân, do dân, vì dân"</span>
        </p>
      </div>

      {/* Main Spacious Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Story & Rules (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Historical Roleplay Story */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 font-typewriter text-xs sm:text-sm text-slate-800 leading-relaxed shadow-xs">
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span>🏛️</span>
              <span className="font-sans font-bold uppercase tracking-wider text-xs text-slate-700">Bối cảnh đảm nhận trọng trách:</span>
            </div>
            <p className="mb-2">
              Bạn vừa được nhân dân và Hội đồng Nhân dân tín nhiệm bầu làm <strong>Chủ tịch Huyện</strong> trong nhiệm kỳ 4 năm (gồm <strong>16 Quý công tác</strong>).
            </p>
            <p>
              Mỗi quý, các đại biểu nhân dân, cơ quan thanh tra hay doanh nghiệp sẽ mang đến 1 vấn đề gai góc. Mỗi quyết sách bạn ký duyệt sẽ tác động trực tiếp đến sự hưng thịnh của địa phương và uy tín của chính quyền.
            </p>
          </div>

          {/* Strategic Balance & Rules */}
          <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/50 p-4 sm:p-5 rounded-2xl border-2 border-amber-300/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-black text-amber-900 text-xs sm:text-sm uppercase tracking-wide">
              <Scale className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Quy luật Cân bằng & Sống còn (Game Rules)</span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed">
              <div className="flex items-start gap-2.5 bg-white/85 p-3 rounded-xl border border-amber-200/90">
                <span className="text-amber-800 font-black text-base shrink-0">⚖️</span>
                <div>
                  <strong className="text-amber-950 block font-bold mb-0.5">Suy nghĩ cẩn trọng - Tránh để chỉ số chạm đáy:</strong>
                  <span className="text-slate-700">
                    Khi đưa ra quyết sách đúng đắn, các chỉ số sẽ được cộng thưởng điểm rõ rệt. Tuy nhiên, nếu quyết định sai lầm làm <strong>bất kỳ chỉ số nào rơi về 0 điểm</strong>, bạn sẽ bị cách chức và bãi miễn ngay lập tức!
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mục tiêu Hoàn thành:</span>
                  </div>
                  <span className="text-xs text-slate-700 leading-snug block">
                    Trụ vững trọn vẹn <strong>16 Quý</strong> và duy trì điểm số trung bình các chỉ số ở mức cao nhất.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5 text-xs mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Cảnh báo 2 Bẫy Cực đoan:</span>
                  </div>
                  <span className="text-xs text-slate-700 leading-snug block">
                    Tránh sa vào bệnh <strong>"Mị dân"</strong> (chiều dân phạm luật) hoặc <strong>"Quan cách mạng"</strong> (áp đặt máy móc, độc đoán xa dân).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Indicators & Action Buttons (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-200/90 space-y-5">
          {/* 4 Indicators Breakdown */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              4 Cán cân Quản trị Cốt lõi:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Lòng Dân</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Niềm tin, sự ấm no & đồng thuận của nhân dân</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Pháp Quyền</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Thượng tôn pháp luật, giữ nghiêm kỷ cương phép nước</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Liêm Chính</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Chí công vô tư, phòng chống tham ô & lợi ích nhóm</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Cải Cách</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Số hóa, tinh gọn bộ máy, dám đổi mới vì lợi ích chung</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Call-to-actions */}
          <div className="space-y-3 pt-2">
            {/* Optional Nickname input */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Họ tên / Biệt danh cán bộ:</span>
                <span className="text-[10px] text-slate-400 font-normal">Tùy chọn</span>
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value);
                  try {
                    sessionStorage.setItem('hcm_tab_player_name', e.target.value);
                  } catch (err) {}
                }}
                placeholder="VD: Nguyễn Văn A (hoặc để trống)"
                maxLength={25}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-slate-800 placeholder-slate-400 font-medium transition-all"
              />
            </div>

            <button
              onClick={() => {
                playSound('select');
                onStart(customName);
              }}
              className="w-full py-3.5 px-5 rounded-xl font-black text-sm uppercase tracking-wider bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white shadow-md shadow-red-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu chơi cá nhân</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-amber-950 hover:text-black bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 hover:from-amber-300 hover:to-yellow-400 border border-amber-400 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-900 shrink-0" />
              <span>🏆 Vào Đấu Phòng Lớp Học (Thi đấu tập thể)</span>
            </button>

            <button
              onClick={onOpenHandbook}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Tra cứu Sổ tay Lý luận Chương 4</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
