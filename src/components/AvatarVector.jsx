import React from 'react';

// Bộ sưu tập Avatar phong cách Minimalist Vector / Silhouette (Phong cách chuẩn của game Reigns)
// Tối giản, hình khối sắc nét, kết hợp nhận diện công chức, nhân dân, doanh nghiệp Việt Nam

const AvatarVector = React.memo(function AvatarVector({ id, size = "w-20 h-20", className = "" }) {
  const getAvatarSvg = () => {
    switch (id) {
      // 1. Bác Ba Nông Dân (Nón lá, áo nâu chân chất, râu tóc bạc phơ)
      case 'farmer':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#78350F" />
            <path d="M50 8 L92 38 L8 38 Z" fill="#D97706" />
            <path d="M50 8 L8 38 L50 34 Z" fill="#B45309" />
            <circle cx="50" cy="52" r="18" fill="#FDE68A" />
            <path d="M42 56 Q50 64 58 56" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="43" cy="50" r="2" fill="#78350F" />
            <circle cx="57" cy="50" r="2" fill="#78350F" />
            <path d="M44 63 L50 75 L56 63 Z" fill="#FEF3C7" />
            <path d="M22 100 C22 75 35 70 50 70 C65 70 78 75 78 100 Z" fill="#92400E" />
            <path d="M44 70 L50 85 L56 70" stroke="#78350F" strokeWidth="2" fill="none" />
          </svg>
        );

      // 2. Chị Thu Hà - Cán bộ một cửa (Sơ mi trắng, cà vạt/nơ xanh, thẻ công chức)
      case 'civil_servant':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#1E3A8A" />
            <path d="M30 35 C30 20 70 20 70 35 C75 52 70 65 50 65 C30 65 25 52 30 35 Z" fill="#172554" />
            <circle cx="50" cy="46" r="16" fill="#FED7AA" />
            <path d="M34 38 Q50 42 66 38" stroke="#172554" strokeWidth="6" strokeLinecap="round" />
            <circle cx="43" cy="45" r="2" fill="#1E293B" />
            <circle cx="57" cy="45" r="2" fill="#1E293B" />
            <path d="M46 53 Q50 56 54 53" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 100 C20 75 32 70 50 70 C68 70 80 75 80 100 Z" fill="#F8FAFC" />
            <path d="M44 70 L50 82 L56 70 Z" fill="#2563EB" />
            <rect x="42" y="85" width="16" height="12" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
            <rect x="45" y="88" width="10" height="2" fill="#DBEAFE" />
          </svg>
        );

      // 3. Trưởng phòng Tài chính (Kính cận trí thức, âu phục nghiêm túc)
      case 'finance':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#064E3B" />
            <path d="M32 30 C32 18 68 18 68 30 C72 32 68 45 68 45 L32 45 Z" fill="#022C22" />
            <circle cx="50" cy="48" r="17" fill="#FDE68A" />
            <rect x="37" y="44" width="11" height="7" rx="2" stroke="#047857" strokeWidth="2" fill="none" />
            <rect x="52" y="44" width="11" height="7" rx="2" stroke="#047857" strokeWidth="2" fill="none" />
            <path d="M48 47 L52 47" stroke="#047857" strokeWidth="2" />
            <path d="M46 56 H54" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 100 C18 76 32 69 50 69 C68 69 82 76 82 100 Z" fill="#0F172A" />
            <path d="M42 69 L50 80 L58 69 Z" fill="#F8FAFC" />
            <path d="M47 75 L50 98 L53 75 Z" fill="#059669" />
          </svg>
        );

      // 4. Ông Vĩnh Hưng - Doanh nhân họ hàng (Ria mép doanh nhân, vest tím than)
      case 'business_relative':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#4C1D95" />
            <path d="M30 32 C30 18 70 18 70 32 L70 42 L30 42 Z" fill="#312E81" />
            <circle cx="50" cy="48" r="17" fill="#FED7AA" />
            <circle cx="43" cy="45" r="2.5" fill="#1E1B4B" />
            <circle cx="57" cy="45" r="2.5" fill="#1E1B4B" />
            <path d="M40 54 Q50 51 60 54 Q50 58 40 54 Z" fill="#312E81" />
            <path d="M16 100 C16 75 32 68 50 68 C68 68 84 75 84 100 Z" fill="#3730A3" />
            <path d="M40 68 L50 82 L60 68 Z" fill="#F8FAFC" />
            <path d="M47 78 L50 96 L53 78 Z" fill="#D97706" />
            <circle cx="68" cy="85" r="3" fill="#F59E0B" />
          </svg>
        );

      // 5. Trưởng ban Tổ chức - Đổi mới bộ máy (Huy hiệu sao vàng)
      case 'organizer':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#1E293B" />
            <path d="M30 32 C30 18 70 18 70 32 L68 45 L32 45 Z" fill="#0F172A" />
            <circle cx="50" cy="48" r="17" fill="#FDE68A" />
            <circle cx="42" cy="46" r="2" fill="#0F172A" />
            <circle cx="58" cy="46" r="2" fill="#0F172A" />
            <path d="M45 56 H55" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 100 C16 75 32 68 50 68 C68 68 84 75 84 100 Z" fill="#334155" />
            <path d="M42 68 L50 82 L58 68 Z" fill="#FFFFFF" />
            <path d="M47 78 L50 98 L53 78 Z" fill="#DC2626" />
            <circle cx="35" cy="82" r="4" fill="#EAB308" />
            <polygon points="35,80 36,83 39,83 37,84 38,87 35,85 32,87 33,84 31,83 34,83" fill="#DC2626" />
          </svg>
        );

      // 6. Bà Hai Cử Tri (Khăn vấn, vẻ đẹp phụ nữ nông thôn truyền thống)
      case 'elderly_voter':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#831843" />
            <ellipse cx="50" cy="30" rx="22" ry="12" fill="#0F172A" />
            <circle cx="50" cy="50" r="17" fill="#FDE68A" />
            <path d="M32 36 C35 48 35 60 38 68" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
            <path d="M68 36 C65 48 65 60 62 68" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
            <circle cx="43" cy="48" r="2" fill="#451A03" />
            <circle cx="57" cy="48" r="2" fill="#451A03" />
            <path d="M44 58 Q50 62 56 58" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 100 C20 76 34 70 50 70 C66 70 80 76 80 100 Z" fill="#9D174D" />
            <path d="M42 70 L50 82 L58 70" stroke="#FDE68A" strokeWidth="3" fill="none" />
          </svg>
        );

      // 7. Chánh Thanh Tra (Sắc sảo, quân hàm thanh tra sao cành tùng)
      case 'inspector':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#14532D" />
            <path d="M30 30 C30 18 70 18 70 30 L68 42 L32 42 Z" fill="#052E16" />
            <circle cx="50" cy="47" r="16" fill="#FEF08A" />
            <circle cx="42" cy="45" r="2" fill="#052E16" />
            <circle cx="58" cy="45" r="2" fill="#052E16" />
            <path d="M45 55 H55" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 100 C16 75 32 68 50 68 C68 68 84 75 84 100 Z" fill="#15803D" />
            <path d="M42 68 L50 80 L58 68 Z" fill="#FFFFFF" />
            <path d="M47 76 L50 96 L53 76 Z" fill="#166534" />
            <rect x="24" y="74" width="12" height="6" rx="2" fill="#EAB308" />
            <rect x="64" y="74" width="12" height="6" rx="2" fill="#EAB308" />
          </svg>
        );

      // 8. Kỹ sư Chuyển đổi số Minh (Trẻ trung, kính thông minh, tai nghe hiện đại)
      case 'tech_dev':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#0F766E" />
            <path d="M32 30 C32 18 68 18 68 30 C72 32 68 44 68 44 L32 44 Z" fill="#115E59" />
            <path d="M28 42 C28 32 72 32 72 42" stroke="#0D9488" strokeWidth="4" fill="none" />
            <circle cx="28" cy="48" r="5" fill="#14B8A6" />
            <circle cx="72" cy="48" r="5" fill="#14B8A6" />
            <circle cx="50" cy="48" r="16" fill="#FED7AA" />
            <rect x="38" y="44" width="10" height="6" rx="1" stroke="#042F2E" strokeWidth="2" fill="none" />
            <rect x="52" y="44" width="10" height="6" rx="1" stroke="#042F2E" strokeWidth="2" fill="none" />
            <path d="M48 46 L52 46" stroke="#042F2E" strokeWidth="2" />
            <path d="M46 56 Q50 59 54 56" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 100 C18 76 34 70 50 70 C66 70 82 76 82 100 Z" fill="#042F2E" />
            <path d="M45 70 L50 82 L55 70" stroke="#14B8A6" strokeWidth="2.5" fill="none" />
          </svg>
        );

      // 9. Cụ Tám Bán Rong (Khăn rằn, nón lá nghiêng)
      case 'street_vendor':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#713F12" />
            <path d="M20 30 L80 18 L60 38 Z" fill="#A16207" />
            <circle cx="50" cy="50" r="17" fill="#FDE68A" />
            <circle cx="43" cy="48" r="2" fill="#451A03" />
            <circle cx="57" cy="48" r="2" fill="#451A03" />
            <path d="M44 58 Q50 62 56 58" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 100 C20 76 34 70 50 70 C66 70 80 76 80 100 Z" fill="#854D0E" />
            <path d="M35 70 L65 70" stroke="#FEF08A" strokeWidth="3" />
          </svg>
        );

      // 10. Giám đốc Nhà thầu xây dựng (Mũ bảo hộ vàng)
      case 'contractor':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#1E293B" />
            <path d="M30 34 C30 18 70 18 70 34 Z" fill="#EAB308" />
            <rect x="24" y="32" width="52" height="6" rx="3" fill="#CA8A04" />
            <circle cx="50" cy="49" r="16" fill="#FED7AA" />
            <circle cx="42" cy="47" r="2" fill="#0F172A" />
            <circle cx="58" cy="47" r="2" fill="#0F172A" />
            <path d="M44 56 H56" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 100 C16 75 32 68 50 68 C68 68 84 75 84 100 Z" fill="#EA580C" />
            <path d="M35 75 L65 75" stroke="#FFFFFF" strokeWidth="3" />
          </svg>
        );

      // 11. Giám đốc Ban QLDA (Âu phục kỹ thuật, cặp táp)
      case 'pmu_director':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#1E3A8A" />
            <path d="M32 30 C32 18 68 18 68 30 L68 42 L32 42 Z" fill="#172554" />
            <circle cx="50" cy="47" r="16" fill="#FDE68A" />
            <circle cx="42" cy="45" r="2" fill="#172554" />
            <circle cx="58" cy="45" r="2" fill="#172554" />
            <path d="M44 55 H56" stroke="#854D0E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M18 100 C18 76 34 70 50 70 C66 70 82 76 82 100 Z" fill="#1E40AF" />
            <path d="M44 70 L50 82 L56 70" stroke="#FDE68A" strokeWidth="2.5" fill="none" />
          </svg>
        );

      // 12. Bí thư Đoàn thanh niên (Áo xanh thanh niên Việt Nam)
      case 'youth_leader':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#1D4ED8" />
            <path d="M32 30 C32 18 68 18 68 30 L68 40 L32 40 Z" fill="#1E1B4B" />
            <circle cx="50" cy="46" r="16" fill="#FED7AA" />
            <circle cx="43" cy="44" r="2.5" fill="#1E1B4B" />
            <circle cx="57" cy="44" r="2.5" fill="#1E1B4B" />
            <path d="M44 54 Q50 58 56 54" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 100 C18 75 34 68 50 68 C66 68 82 75 82 100 Z" fill="#0284C7" />
            <path d="M44 68 L50 80 L56 68 Z" fill="#FFFFFF" />
            <circle cx="34" cy="80" r="4" fill="#DC2626" />
            <polygon points="34,78 35,80 37,80 35.5,81 36,83 34,82 32,83 32.5,81 31,80 33,80" fill="#FACC15" />
          </svg>
        );

      // 13. Ủy ban Kiểm tra (Kính cận, sơ mi chỉn chu)
      case 'exam_officer':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#047857" />
            <path d="M32 30 C32 18 68 18 68 30 L68 42 L32 42 Z" fill="#064E3B" />
            <circle cx="50" cy="47" r="16" fill="#FDE68A" />
            <rect x="38" y="43" width="9" height="6" rx="1" stroke="#064E3B" strokeWidth="2" fill="none" />
            <rect x="53" y="43" width="9" height="6" rx="1" stroke="#064E3B" strokeWidth="2" fill="none" />
            <path d="M47 46 L53 46" stroke="#064E3B" strokeWidth="2" />
            <path d="M45 55 H55" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 100 C18 76 34 70 50 70 C66 70 82 76 82 100 Z" fill="#065F46" />
            <path d="M44 70 L50 82 L56 70 Z" fill="#FFFFFF" />
            <path d="M48 76 L50 96 L52 76 Z" fill="#DC2626" />
          </svg>
        );

      // 14. Nhà báo Điều tra (Máy ảnh đeo cổ, vẻ mặt cương trực)
      case 'journalist':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#581C87" />
            <path d="M32 32 C32 18 68 18 68 32 L68 42 L32 42 Z" fill="#3B0764" />
            <circle cx="50" cy="47" r="16" fill="#FED7AA" />
            <circle cx="43" cy="45" r="2.5" fill="#3B0764" />
            <circle cx="57" cy="45" r="2.5" fill="#3B0764" />
            <path d="M45 55 H55" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 100 C18 76 34 70 50 70 C66 70 82 76 82 100 Z" fill="#475569" />
            {/* Camera */}
            <rect x="42" y="78" width="16" height="12" rx="2" fill="#0F172A" />
            <circle cx="50" cy="84" r="4" fill="#38BDF8" />
          </svg>
        );

      // 15. Chị Thảo Khảo Sát SIPAS (Kẹp hồ sơ báo cáo)
      case 'surveyor':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#0284C7" />
            <path d="M30 35 C30 20 70 20 70 35 C75 52 70 65 50 65 C30 65 25 52 30 35 Z" fill="#075985" />
            <circle cx="50" cy="46" r="16" fill="#FED7AA" />
            <circle cx="43" cy="45" r="2" fill="#0C4A6E" />
            <circle cx="57" cy="45" r="2" fill="#0C4A6E" />
            <path d="M46 54 Q50 57 54 54" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 100 C20 75 32 70 50 70 C68 70 80 75 80 100 Z" fill="#E0F2FE" />
            <path d="M45 70 L50 82 L55 70" stroke="#0284C7" strokeWidth="2" fill="none" />
          </svg>
        );

      // 16. Bác Mặt Trận Tổ Quốc (Kỷ niệm chương đỏ, tóc hoa râm danh kính)
      case 'front_president':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="#991B1B" />
            <path d="M30 32 C30 18 70 18 70 32 L68 45 L32 45 Z" fill="#7F1D1D" />
            <circle cx="50" cy="48" r="17" fill="#FEF08A" />
            <circle cx="42" cy="46" r="2.5" fill="#450A0A" />
            <circle cx="58" cy="46" r="2.5" fill="#450A0A" />
            <path d="M44 58 Q50 62 56 58" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 100 C16 75 32 68 50 68 C68 68 84 75 84 100 Z" fill="#1E293B" />
            <path d="M42 68 L50 82 L58 68 Z" fill="#FFFFFF" />
            <path d="M47 78 L50 98 L53 78 Z" fill="#DC2626" />
            <circle cx="34" cy="80" r="4" fill="#EAB308" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative shrink-0 overflow-hidden shadow-md rounded-2xl ${size} ${className}`}>
      {getAvatarSvg()}
    </div>
  );
});

export default AvatarVector;
