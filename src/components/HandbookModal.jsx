import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, Scale, Users, ShieldAlert, Sparkles } from 'lucide-react';

export default function HandbookModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('dan');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center border border-red-200">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Sổ Tay Lý Luận: Chương 4 - Tư Tưởng Hồ Chí Minh
              </h3>
              <p className="text-[11px] text-slate-500">
                Giáo trình Tư tưởng Hồ Chí Minh (Bộ Giáo dục & Đào tạo)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-4 gap-1.5 my-3 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('dan')}
            className={`py-2 px-2 rounded-lg transition-all text-center truncate ${
              activeTab === 'dan' ? 'bg-red-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Của - Do - Vì Dân
          </button>
          <button
            onClick={() => setActiveTab('phapquyen')}
            className={`py-2 px-2 rounded-lg transition-all text-center truncate ${
              activeTab === 'phapquyen' ? 'bg-purple-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pháp Quyền
          </button>
          <button
            onClick={() => setActiveTab('liemchinh')}
            className={`py-2 px-2 rounded-lg transition-all text-center truncate ${
              activeTab === 'liemchinh' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trong Sạch
          </button>
          <button
            onClick={() => setActiveTab('caicach')}
            className={`py-2 px-2 rounded-lg transition-all text-center truncate ${
              activeTab === 'caicach' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cải Cách Hiện Nay
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 text-xs sm:text-sm text-slate-700 space-y-4">
          {activeTab === 'dan' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                <h4 className="font-extrabold text-amber-900 text-sm mb-1">
                  1. Bản chất Nhà nước của dân, do dân, vì dân
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  • <strong>Nhà nước CỦA dân:</strong> Mọi quyền lực trong nước và xã hội đều thuộc về nhân dân. Nhân dân là người chủ tối cao. Quyền bầu cử và bãi miễn các cơ quan quyền lực nhà nước là quyền căn bản của nhân dân.<br />
                  • <strong>Nhà nước DO dân:</strong> Do nhân dân cử ra, tổ chức nên, nuôi dưỡng và bảo vệ. Nhân dân có quyền và nghĩa vụ tham gia quản lý nhà nước và giám sát cán bộ.<br />
                  • <strong>Nhà nước VÌ dân:</strong> Mọi hoạt động của chính quyền đều vì hạnh phúc và lợi ích chính đáng của quần chúng. Cán bộ từ trung ương đến địa phương đều là <em>"công bộc của dân"</em>, không phải <em>"quan cách mạng"</em>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-200">
                <span className="text-xs font-bold text-amber-800 block mb-1">Trích dẫn Hồ Chí Minh tiêu biểu:</span>
                <p className="font-serif italic text-slate-700 text-xs">
                  "Việc gì lợi cho dân, ta phải hết sức làm. Việc gì hại đến dân, ta phải hết sức tránh. Cán bộ là đầy tớ của nhân dân, phải chăm lo đời sống cho dân." (1945)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'phapquyen' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200">
                <h4 className="font-extrabold text-purple-900 text-sm mb-1">
                  2. Nhà nước pháp quyền có hiệu lực pháp lý mạnh mẽ
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  • <strong>Hợp hiến & Hợp pháp:</strong> Ngay sau khi thành lập nước, Bác ký Sắc lệnh Tổng tuyển cử và soạn thảo Hiến pháp 1946 để bộ máy có tính pháp lý vững chắc.<br />
                  • <strong>"Thần linh pháp quyền":</strong> Thượng tôn Hiến pháp và pháp luật. Quản lý xã hội bằng luật pháp dân chủ, minh bạch, công bằng.<br />
                  • <strong>Kết hợp Đức trị & Pháp trị:</strong> Pháp luật nghiêm minh không có vùng cấm, nhưng luôn gắn chặt với giáo dục đạo đức cách mạng, khoan dung nhân ái, cứu người giúp đời.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-purple-200">
                <span className="text-xs font-bold text-purple-800 block mb-1">Trích dẫn Hồ Chí Minh tiêu biểu:</span>
                <p className="font-serif italic text-slate-700 text-xs">
                  "Bảy xin hiến pháp ban hành / Trăm điều phải có thần linh pháp quyền." (Yêu sách của nhân dân An Nam, 1919)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'liemchinh' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <h4 className="font-extrabold text-emerald-900 text-sm mb-1">
                  3. Xây dựng Nhà nước trong sạch, vững mạnh
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  • <strong>Tiêu trừ 3 thứ giặc nội xâm:</strong> <em>Tham ô, Lãng phí, Quan liêu</em>. Người chỉ rõ đây là căn bệnh nguy hại nhất làm ruỗng nát bộ máy.<br />
                  • <strong>Chống các tệ nạn trong bộ máy:</strong> Đặc quyền đặc lợi, tư túng (kéo bè kéo cánh người nhà), chia rẽ, kiêu ngạo, hách dịch với dân.<br />
                  • <strong>Kiểm soát quyền lực:</strong> Quyền lực phải được giám sát nghiêm ngặt từ nhân dân và tổ chức, tránh nguy cơ tha hóa quyền lực công thành tư.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 block mb-1">Trích dẫn Hồ Chí Minh tiêu biểu:</span>
                <p className="font-serif italic text-slate-700 text-xs">
                  "Tham ô, lãng phí và bệnh quan liêu là thứ giặc ở trong lòng... Nó phá hoại đạo đức cách mạng, chẳng khác gì giặc ngoại xâm." (1952)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'caicach' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200">
                <h4 className="font-extrabold text-blue-900 text-sm mb-1">
                  4. Vận dụng vào Cải cách hành chính & Chuyển đổi số hiện nay
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  • <strong>Tinh gọn bộ máy (Nghị quyết 18-NQ/TW):</strong> Tinh giản biên chế, xóa bỏ trung gian chồng chéo, bộ máy hoạt động hiệu lực, hiệu quả.<br />
                  • <strong>Cải cách thủ tục hành chính & Một cửa:</strong> Bãi bỏ các "giấy phép con", chuyển từ cơ chế 'xin - cho' sang nền hành chính phục vụ.<br />
                  • <strong>Chuyển đổi số & Dịch vụ công quốc gia:</strong> Khai thác cơ sở dữ liệu quốc gia (VNeID, Đề án 06), xóa bỏ xuất trình giấy tờ trùng lặp.<br />
                  • <strong>Khắc phục bệnh sợ trách nhiệm:</strong> Kiên quyết chống đùn đẩy, né tránh, bảo vệ cán bộ năng động sáng tạo dám nghĩ dám làm vì lợi ích chung.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-blue-200">
                <span className="text-xs font-bold text-blue-800 block mb-1">Liên hệ Nghị quyết Đại hội XIII của Đảng:</span>
                <p className="font-serif italic text-slate-700 text-xs">
                  "Xây dựng nền hành chính nhà nước phục vụ nhân dân, dân chủ, pháp quyền, chuyên nghiệp, hiện đại, trong sạch, vững mạnh, công khai, minh bạch."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tài liệu phục vụ học tập & thi cử</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all"
          >
            Đã hiểu, quay lại trò chơi
          </button>
        </div>
      </div>
    </div>
  );
}
