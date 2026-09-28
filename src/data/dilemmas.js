// Bộ dữ liệu 16 tình huống hóc búa (Dilemmas) bám sát tuyệt đối Giáo trình Tư tưởng Hồ Chí Minh
// NXB Chính trị Quốc gia Sự thật (Hệ không chuyên) - Chương 4
// Thiết kế có độ khó cao, song đề quản trị thực tế (Trade-offs), loại bỏ hoàn toàn các lựa chọn ngây thơ, hiển nhiên.

export const CATEGORIES = {
  NHA_NUOC_DAN: "Nhà nước của dân, do dân, vì dân",
  PHAP_QUYEN: "Nhà nước pháp quyền & Thượng tôn pháp luật",
  LIEM_CHINH: "Xây dựng Nhà nước trong sạch, phòng chống tiêu cực",
  CAI_CACH: "Cải cách hành chính & Chuyển đổi số"
};

const RAW_DILEMMAS = [
  {
    id: 1,
    quarter: "Quý 1 - Năm thứ 1",
    category: CATEGORIES.NHA_NUOC_DAN,
    character: {
      name: "Bác Ba Nông Dân",
      role: "Đại diện các hộ dân vùng dự án cao tốc",
      avatarId: "farmer",
      tagColor: "amber"
    },
    situation: "Dự án đường cao tốc quốc gia đi qua huyện: Bà con yêu cầu nâng giá đền bù gấp đôi khung giá Nhà nước quy định thì mới chịu bàn giao mặt bằng, nếu không sẽ kiên quyết khiếu kiện kéo dài làm trễ tiến độ quốc gia.",
    correctChoice: {
      text: "Kiên quyết giữ đúng khung giá pháp định, nhưng đối thoại trực tiếp để bổ sung quỹ đất tái định cư tốt nhất và hỗ trợ học nghề, tạo sinh kế lâu dài cho bà con.",
      impact: { people: -5, law: 25, integrity: 15, reform: 5 },
      quote: "Hồ Chí Minh: 'Có khi làm những việc mới xem qua như là hại đến dân, nhưng thực chất là vì lợi ích toàn cục, vì lợi ích lâu dài của nhân dân.'",
      rationale: "Bảo đảm nguyên tắc thượng tôn pháp luật và lợi ích chiến lược toàn quốc; đồng thời chăm lo sinh kế thực chất thay vì thỏa hiệp xé rào khung giá."
    },
    flawedChoice: {
      text: "Linh động vận dụng 'chính sách đặc thù' để nâng giá đền bù tiệm cận yêu cầu của dân nhằm nhanh chóng lấy mặt bằng hoàn thành chỉ tiêu giải ngân.",
      impact: { people: 20, law: -30, integrity: -25, reform: -10 },
      quote: "Hồ Chí Minh: 'Lãnh đạo không được mị dân, không được tùy tiện phá vỡ phép nước để cầu lấy sự yên ổn nhất thời.'",
      rationale: "Rơi vào bẫy mị dân, phá vỡ tính thống nhất của hệ thống pháp luật bồi thường, tạo tiền lệ xấu khiếu kiện dây chuyền cho các địa phương lân cận."
    }
  },
  {
    id: 2,
    quarter: "Quý 2 - Năm thứ 1",
    category: CATEGORIES.CAI_CACH,
    character: {
      name: "Đồng chí Thu Hà",
      role: "Chuyên viên Bộ phận Một Cửa",
      avatarId: "civil_servant",
      tagColor: "blue"
    },
    situation: "Triển khai dịch vụ công trực tuyến VNeID: Một bộ phận người cao tuổi và lao động nghèo không có điện thoại thông minh, lúng túng khi làm thủ tục khai sinh, bảo hiểm. Cán bộ đề xuất tạm dừng nộp hồ sơ giấy đối với tất cả mọi người để đạt 100% chỉ tiêu số hóa của tỉnh.",
    correctChoice: {
      text: "Chưa cắt đứt nộp trực tiếp; thành lập 'Tổ công nghệ số cộng đồng' đến tận nhà hỗ trợ số hóa miễn phí, duy trì quầy Một Cửa hướng dẫn tận tình cho người yếu thế.",
      impact: { people: 20, law: 5, integrity: 5, reform: 15 },
      quote: "Hồ Chí Minh: 'Chính sách dù hiện đại đến đâu mà làm khổ người nghèo, người già neo đơn là đi ngược bản chất nhân văn của Nhà nước ta.'",
      rationale: "Hiện đại hóa hành chính gắn với bản chất Nhà nước vì dân, không chạy theo chỉ tiêu hình thức mà bỏ rơi đối tượng yếu thế trong xã hội."
    },
    flawedChoice: {
      text: "Kiên quyết từ chối nhận hồ sơ giấy 100%, yêu cầu công dân tự nhờ người thân làm qua mạng để huyện giữ vị trí dẫn đầu bảng xếp hạng chuyển đổi số.",
      impact: { people: -35, law: -10, integrity: -15, reform: 20 },
      quote: "Hồ Chí Minh: 'Cải cách mà quan liêu, mệnh lệnh, xa rời thực tế đời sống đồng bào thì cải cách đó đã biến chất.'",
      rationale: "Bệnh thành tích ảo, áp đặt hành chính máy móc, biến chuyển đổi số phục vụ nhân dân thành gánh nặng hành dân."
    }
  },
  {
    id: 3,
    quarter: "Quý 3 - Năm thứ 1",
    category: CATEGORIES.LIEM_CHINH,
    character: {
      name: "Đ/c Trưởng phòng Tài chính",
      role: "Ban Quản lý Ngân sách Huyện",
      avatarId: "finance",
      tagColor: "emerald"
    },
    situation: "Một tập đoàn lớn đề nghị tài trợ 100% kinh phí xây dựng một 'Quần thể biểu tượng quảng trường' hiện đại cho huyện, đổi lại huyện phải giao chỉ định khu đất công viên trung tâm cho họ làm trung tâm thương mại mà không qua đấu thầu công khai.",
    correctChoice: {
      text: "Từ chối giao đất chỉ định; yêu cầu đấu giá công khai quyền sử dụng đất theo đúng Luật Đất đai để tăng ngân sách đầu tư trường học và trạm y tế.",
      impact: { people: 5, law: 25, integrity: 25, reform: 10 },
      quote: "Hồ Chí Minh: 'Đất công, của công là tài sản của toàn dân. Lợi dụng danh nghĩa xã hội hóa để thâu tóm tài sản công là hành vi tinh vi của giặc nội xâm.'",
      rationale: "Chống cấu kết lợi ích nhóm, bảo vệ tài sản công và sự công bằng minh bạch của Nhà nước pháp quyền."
    },
    flawedChoice: {
      text: "Đồng ý giao đất để huyện có ngay công trình biểu tượng hoành tráng không tốn ngân sách, tạo cú hích diện mạo đô thị nhiệm kỳ mới.",
      impact: { people: 10, law: -35, integrity: -40, reform: -15 },
      quote: "Hồ Chí Minh: 'Không được vì cái lợi hào nhoáng trước mắt mà làm thất thoát mồ hôi nước mắt của đồng bào.'",
      rationale: "Vi phạm nghiêm trọng Luật Quản lý tài sản công, thỏa hiệp với lợi ích nhóm dưới vỏ bọc tài trợ xã hội hóa."
    }
  },
  {
    id: 4,
    quarter: "Quý 4 - Năm thứ 1",
    category: CATEGORIES.PHAP_QUYEN,
    character: {
      name: "Ông Vĩnh Hưng",
      role: "Chủ xưởng gỗ xuất khẩu kiêm người thân tín",
      avatarId: "business_relative",
      tagColor: "purple"
    },
    situation: "Xưởng gỗ giải quyết việc làm cho hơn 300 lao động địa phương chưa hoàn thiện hệ thống PCCC tự động. Đang có đơn hàng xuất khẩu lớn sang EU, nếu bị đình chỉ xưởng sẽ phá sản, công nhân mất việc làm cận Tết. Người quen đến xin bạn cam kết 'vừa sản xuất vừa hoàn thiện dần'.",
    correctChoice: {
      text: "Kiên quyết tạm dừng hoạt động các phân xưởng có nguy cơ cháy nổ cao, huy động lực lượng hỗ trợ doanh nghiệp khắc phục chuẩn PCCC nhanh nhất.",
      impact: { people: -15, law: 30, integrity: 20, reform: 5 },
      quote: "Hồ Chí Minh: 'Pháp luật phải có tính nghiêm minh... Không vì nể nang hay viện cớ khó khăn kinh tế mà xem nhẹ sinh mạng của nhân dân lao động.'",
      rationale: "Thượng tôn pháp luật, đặt an toàn tính mạng con người lên trên lợi nhuận; kiên quyết không dung dưỡng sai phạm tiềm ẩn thảm họa."
    },
    flawedChoice: {
      text: "Ký cho phép tiếp tục sản xuất tạm thời trong 3 tháng để cứu doanh nghiệp và bảo đảm việc làm, thu nhập Tết cho công nhân.",
      impact: { people: 15, law: -35, integrity: -30, reform: -15 },
      quote: "Hồ Chí Minh: 'Tư túng, dĩ hòa vi quý, 'để từ từ sửa' là mầm mống dẫn tới những tai họa khôn lường.'",
      rationale: "Vi phạm nguyên tắc pháp quyền xã hội chủ nghĩa, dung dưỡng tình cảm riêng lấn át phép nước, tiềm ẩn thảm họa cháy nổ."
    }
  },
  {
    id: 5,
    quarter: "Quý 1 - Năm thứ 2",
    category: CATEGORIES.CAI_CACH,
    character: {
      name: "Đồng chí Trưởng ban Tổ chức",
      role: "Ban Đổi mới sắp xếp bộ máy theo NQ 18",
      avatarId: "organizer",
      tagColor: "blue"
    },
    situation: "Thực hiện tinh giản biên chế và sắp xếp bộ máy theo Nghị quyết 18-NQ/TW: Có 2 phương án sáp nhập phòng ban. Hướng 1: Tinh gọn thực chất, giảm 30% đầu mối nhưng đụng chạm đến vị trí của nhiều cán bộ kỳ cựu có quan hệ rộng; Hướng 2: Sáp nhập cơ học theo hình thức, giữ nguyên các cấp phó để nội bộ êm thấm.",
    correctChoice: {
      text: "Quyết liệt tinh giản thực chất, tổ chức sát hạch vị trí việc làm công khai, minh bạch, bố trí chính sách hỗ trợ thỏa đáng cho người nghỉ dôi dư.",
      impact: { people: 5, law: 15, integrity: 20, reform: 30 },
      quote: "Hồ Chí Minh: 'Tổ chức bộ máy phải tinh gọn, thiết thực, có hiệu lực, tránh cồng kềnh, 'ăn lương mà không làm được việc'.'",
      rationale: "Cải cách thể chế thực chất, phá vỡ sức ỳ bảo thủ của bộ máy, thực hiện mục tiêu bộ máy phục vụ nhân dân."
    },
    flawedChoice: {
      text: "Sáp nhập cơ học hình thức để giữ ổn định tình hình chính trị nội bộ, tránh khiếu nại và bảo đảm sự ủng hộ của các cán bộ lão thành trong kỳ bỏ phiếu tín nhiệm.",
      impact: { people: -15, law: -20, integrity: -20, reform: -35 },
      quote: "Hồ Chí Minh: 'Sợ va chạm, cầu an, dĩ hòa vi quý là căn bệnh làm cho tổ chức mục ruỗng từ bên trong.'",
      rationale: "Bệnh né tránh trách nhiệm, duy trì bộ máy cồng kềnh ăn bám ngân sách, đi ngược tinh thần cải cách hành chính hiện nay."
    }
  },
  {
    id: 6,
    quarter: "Quý 2 - Năm thứ 2",
    category: CATEGORIES.NHA_NUOC_DAN,
    character: {
      name: "Bà Hai Cử Tri",
      role: "Đại biểu Hội đồng Nhân dân xã",
      avatarId: "elderly_voter",
      tagColor: "amber"
    },
    situation: "Khu vực dân cư đang bức xúc về dự án xử lý chất thải rắn công nghệ cao của tỉnh đặt tại địa bàn. Nhân dân kiên quyết biểu quyết phản đối vì sợ mùi hôi, yêu cầu dời đi nơi khác; trong khi các chuyên gia khoa học khẳng định công nghệ đạt chuẩn bảo vệ môi trường và nếu dời sẽ làm tê liệt rác thải toàn thành phố.",
    correctChoice: {
      text: "Không hủy dự án; tổ chức đoàn đại biểu nhân dân đi thị sát nhà máy tương tự, lập ban giám sát cộng đồng có quyền dừng nhà máy nếu có vi phạm xả thải.",
      impact: { people: 5, law: 20, integrity: 15, reform: 20 },
      quote: "Hồ Chí Minh: 'Dân chủ là dân làm chủ, nhưng người lãnh đạo phải biết giải thích, nâng cao năng lực làm chủ cho nhân dân, không thể theo đuôi quần chúng một cách mù quáng.'",
      rationale: "Vận dụng hài hòa giữa dân chủ và tập trung; kiên trì giáo dục, thuyết phục và trao quyền kiểm tra thực chất cho nhân dân thay vì thụ động."
    },
    flawedChoice: {
      text: "Ủng hộ biểu quyết của số đông nhân dân, kiến nghị cấp trên hủy bỏ dự án và chuyển sang địa phương lân cận để giải tỏa áp lực điểm nóng.",
      impact: { people: 20, law: -30, integrity: -20, reform: -30 },
      quote: "Hồ Chí Minh: 'Lãnh đạo mà sợ khó, đẩy việc khó cho nơi khác, chỉ lo cầu danh với dân mình là cục bộ, thiếu trách nhiệm toàn cục.'",
      rationale: "Bệnh dân túy cục bộ, né tránh trách nhiệm quy hoạch chung, gây tê liệt hệ thống hạ tầng xử lý rác toàn vùng."
    }
  },
  {
    id: 7,
    quarter: "Quý 3 - Năm thứ 2",
    category: CATEGORIES.LIEM_CHINH,
    character: {
      name: "Đồng chí Chánh Thanh tra",
      role: "Cơ quan Thanh tra Huyện",
      avatarId: "inspector",
      tagColor: "emerald"
    },
    situation: "Một Giám đốc Trung tâm Y tế huyện có nhiều thành tích cứu sống hàng nghìn bệnh nhân trong đợt dịch nhưng vừa bị phát hiện đã 'xé rào' quy trình đấu thầu để mua thuốc cấp cứu khẩn cấp, không có tư lợi cá nhân nhưng sai phạm về trình tự thủ tục tài chính theo luật cũ.",
    correctChoice: {
      text: "Áp dụng cơ chế bảo vệ cán bộ năng động, sáng tạo vì lợi ích chung (Kết luận 14-KL/TW); làm rõ không có tư lợi, miễn trừ trách nhiệm hình sự và yêu cầu hoàn thiện thủ tục hồi tố.",
      impact: { people: 25, law: 10, integrity: 20, reform: 25 },
      quote: "Hồ Chí Minh: 'Cán bộ chí công vô tư, vì dân mà làm việc khó thì Đảng và Chính phủ phải hết lòng bảo vệ, khuyến khích.'",
      rationale: "Vận dụng đúng đắn chủ trương bảo vệ cán bộ dám nghĩ dám làm vì lợi ích chung; phân định rạch ròi giữa sai sót do sáng tạo và hành vi tư lợi tham nhũng."
    },
    flawedChoice: {
      text: "Cứ theo câu chữ điều luật xử lý kỷ luật nghiêm khắc và chuyển cơ quan điều tra để bản thân an toàn tuyệt đối trước các đoàn thanh tra.",
      impact: { people: -35, law: 5, integrity: -20, reform: -35 },
      quote: "Hồ Chí Minh: 'Xử lý cán bộ một cách máy móc, vô cảm là làm thui chột tinh thần cống hiến, đẩy cán bộ vào căn bệnh sợ sai, sợ trách nhiệm.'",
      rationale: "Dập tắt động lực đổi mới sáng tạo, làm lây lan căn bệnh tê liệt sợ trách nhiệm trong toàn bộ đội ngũ y bác sĩ và công chức."
    }
  },
  {
    id: 8,
    quarter: "Quý 4 - Năm thứ 2",
    category: CATEGORIES.CAI_CACH,
    character: {
      name: "Kỹ sư Chuyển đổi số Minh",
      role: "Tổ Công nghệ Đổi mới Sáng tạo",
      avatarId: "tech_dev",
      tagColor: "blue"
    },
    situation: "Đề xuất triển khai 'Cổng cấp phép số liên thông': Rút ngắn 70% thời gian cấp phép xây dựng từ 20 ngày xuống 2 ngày nhờ thuật toán tự động đối soát bản đồ quy hoạch. Tuy nhiên, một số phòng ban e ngại thuật toán sẽ làm giảm 'quyền thẩm định trực tiếp' của cán bộ chuyên môn.",
    correctChoice: {
      text: "Phê duyệt triển khai rộng rãi, công khai toàn bộ dữ liệu quy hoạch lên mạng và quy định cán bộ chỉ hậu kiểm, không được giữ hồ sơ tiền kiểm.",
      impact: { people: 20, law: 15, integrity: 20, reform: 30 },
      quote: "Hồ Chí Minh: 'Công khai, minh bạch là liều thuốc hữu hiệu nhất để tiêu diệt mầm mống quan liêu, vòi vĩnh của cán bộ.'",
      rationale: "Triệt tiêu cơ chế 'xin - cho', xóa bỏ giấy phép con, xây dựng nền hành chính phục vụ hiện đại theo tư tưởng Hồ Chí Minh."
    },
    flawedChoice: {
      text: "Chỉ cho áp dụng thí điểm 10% hồ sơ đơn giản, giữ nguyên quyền xét duyệt thủ công cho cán bộ đối với 90% hồ sơ còn lại để 'tránh rủi ro pháp lý'.",
      impact: { people: -20, law: -15, integrity: -25, reform: -35 },
      quote: "Hồ Chí Minh: 'Nửa nạc nửa mỡ, cải cách nửa vời là hình thức bao che cho sự sách nhiễu của cấp dưới.'",
      rationale: "Bảo thủ, duy trì đặc quyền thẩm quyền con sâu mọt, làm mất đi ý nghĩa thực chất của chuyển đổi số quốc gia."
    }
  },
  {
    id: 9,
    quarter: "Quý 1 - Năm thứ 3",
    category: CATEGORIES.PHAP_QUYEN,
    character: {
      name: "Bà Cụ Tám Bán Rong",
      role: "Đại diện người lao động mưu sinh vỉa hè",
      avatarId: "street_vendor",
      tagColor: "purple"
    },
    situation: "Chỉnh trang trật tự đô thị tuyến phố trung tâm: Đội trật tự đô thị phản ánh nhiều người bán hàng rong tái lấn chiếm lòng lề đường gây cản trở giao thông sau các đợt ra quân nhắc nhở. Người dân trong phố bức xúc vì mất mỹ quan và an toàn đi lại.",
    correctChoice: {
      text: "Quy hoạch các tuyến phố đi bộ và chợ đêm ẩm thực sinh kế; ấn định khung giờ hoạt động trật tự cho người buôn gánh bán bưng; xử phạt nghiêm nếu vi phạm ngoài khung giờ.",
      impact: { people: 20, law: 15, integrity: 10, reform: 15 },
      quote: "Hồ Chí Minh: 'Pháp luật phải nghiêm minh nhưng luôn vì con người... Quản lý đô thị phải lo cho dân có chỗ kiếm cơm, chứ không thể chỉ biết cấm và phạt.'",
      rationale: "Kết hợp nhuần nhuyễn giữa 'Đức trị' và 'Pháp trị': giải quyết bài toán sinh kế từ gốc đi đôi với giữ nghiêm kỷ cương trật tự."
    },
    flawedChoice: {
      text: "Lắp camera phạt nguội và tịch thu toàn bộ phương tiện hành nghề không hoàn trả, áp dụng biện pháp mạnh nhất để quét sạch hàng rong trong 1 tuần.",
      impact: { people: -40, law: 15, integrity: -10, reform: -10 },
      quote: "Hồ Chí Minh: 'Mang thói hách dịch, máy móc, bức bách người nghèo vào chân tường là biểu hiện của quan cách mạng tha hóa.'",
      rationale: "Hành chính hóa bạo lực, xa rời bản chất Nhà nước của dân, do dân, vì dân, tạo hố sâu xung đột giữa chính quyền và nhân dân lao động."
    }
  },
  {
    id: 10,
    quarter: "Quý 2 - Năm thứ 3",
    category: CATEGORIES.LIEM_CHINH,
    character: {
      name: "Giám đốc Doanh nghiệp Xây dựng",
      role: "Nhà thầu uy tín đề xuất cơ chế đóng góp",
      avatarId: "contractor",
      tagColor: "emerald"
    },
    situation: "Dự án kiên cố hóa trường học vùng cao đang thiếu 10 tỷ đồng vốn đối ứng. Doanh nghiệp xây dựng đề xuất trúng thầu trọn gói với cam kết tự bỏ vốn thi công trước và ủng hộ 2 tỷ vào quỹ khuyến học huyện, với điều kiện huyện chỉ định thầu trực tiếp thay vì đấu thầu qua mạng.",
    correctChoice: {
      text: "Bác bỏ đề xuất chỉ định thầu; kiên quyết đấu thầu công khai 100% qua Mạng Đấu thầu Quốc gia; vận động xã hội hóa minh bạch riêng biệt.",
      impact: { people: -5, law: 30, integrity: 30, reform: 15 },
      quote: "Hồ Chí Minh: 'Của công là mồ hôi nước mắt của đồng bào. Không được lấy danh nghĩa làm từ thiện để đổi chác sự minh bạch của pháp luật.'",
      rationale: "Bảo đảm nguyên tắc thượng tôn pháp luật trong đầu tư công, triệt tiêu nguy cơ thông thầu và lợi ích nhóm núp bóng từ thiện."
    },
    flawedChoice: {
      text: "Chấp thuận chỉ định thầu để tranh thủ nguồn vốn xã hội hóa, giúp học sinh có trường mới trước năm học mới mà không phải chờ đợi ngân sách.",
      impact: { people: 15, law: -35, integrity: -40, reform: -20 },
      quote: "Hồ Chí Minh: 'Bắt đầu từ một sự thỏa hiệp nhỏ về nguyên tắc, cán bộ sẽ từng bước lún sâu vào sự tha hóa quyền lực.'",
      rationale: "Vi phạm Luật Đấu thầu, tạo tiền lệ xấu về việc dùng nguồn tài trợ can thiệp vào quy trình pháp lý của Nhà nước."
    }
  },
  {
    id: 11,
    quarter: "Quý 3 - Năm thứ 3",
    category: CATEGORIES.CAI_CACH,
    character: {
      name: "Đồng chí Giám đốc Ban QLDA",
      role: "Cán bộ phụ trách giải ngân vốn đầu tư công",
      avatarId: "pmu_director",
      tagColor: "blue"
    },
    situation: "Căn bệnh 'Sợ trách nhiệm, đùn đẩy': Dự án xây dựng trạm xử lý nước sạch cho 50.000 dân đã đủ điều kiện nghiệm thu kỹ thuật, nhưng do các đợt thanh tra vừa qua nên cấp phó và trưởng phòng không ai chịu ký xác nhận, liên tục làm văn bản xin ý kiến các Bộ ngành lòng vòng.",
    correctChoice: {
      text: "Tổ chức họp kiểm điểm trách nhiệm công vụ, quy định thời hạn 48 giờ ký hoàn tất nếu hồ sơ đúng luật; luân chuyển ngay cán bộ né tránh sang vị trí không có thẩm quyền.",
      impact: { people: 25, law: 15, integrity: 20, reform: 30 },
      quote: "Hồ Chí Minh: 'Cán bộ mà sợ trách nhiệm, thấy việc khó thì lùi, đùn đẩy cho người khác, đó là bệnh ích kỷ, là thứ quan liêu ăn mòn đất nước.'",
      rationale: "Thiết lập kỷ cương hành chính nghiêm minh, kiên quyết quét sạch căn bệnh sợ sai, sợ trách nhiệm theo tinh thần của Đảng hiện nay."
    },
    flawedChoice: {
      text: "Cũng thận trọng, tiếp tục ký văn bản của UBND huyện gửi xin ý kiến thêm của Bộ Tư pháp và Bộ Xây dựng để có 'lá chắn an toàn' cho cả bộ máy huyện.",
      impact: { people: -35, law: -15, integrity: -20, reform: -40 },
      quote: "Hồ Chí Minh: 'Ngồi bàn giấy gõ mõ cầm chừng, đẩy qua đẩy lại là có tội lớn với nhân dân.'",
      rationale: "Tiếp tay cho căn bệnh sợ trách nhiệm, làm trễ hạn công trình dân sinh thiết yếu, gây lãng phí nguồn lực nhà nước."
    }
  },
  {
    id: 12,
    quarter: "Quý 4 - Năm thứ 3",
    category: CATEGORIES.NHA_NUOC_DAN,
    character: {
      name: "Đồng chí Bí thư Huyện đoàn",
      role: "Ban Tiếp nhận Khiếu nại Cử tri",
      avatarId: "youth_leader",
      tagColor: "amber"
    },
    situation: "Nhân dân một xã thu thập đủ chữ ký theo luật yêu cầu bãi miễn một Đại biểu HĐND huyện vì đại biểu này vắng mặt tiếp xúc cử tri triền miên và có biểu hiện hách dịch. Thường trực Huyện ủy khuyên bạn nên 'xử lý nội bộ nhẹ nhàng' để giữ hình ảnh tổ chức trước thềm Đại hội.",
    correctChoice: {
      text: "Thực hiện đúng quy trình bãi miễn công khai theo Hiến pháp và Luật Tổ chức chính quyền địa phương, tôn trọng quyền bãi miễn tối cao của cử tri.",
      impact: { people: 25, law: 25, integrity: 20, reform: 15 },
      quote: "Hồ Chí Minh: 'Nhân dân có quyền bầu ra người đại diện thì cũng có quyền bãi miễn nếu người đó không xứng đáng với sự tín nhiệm của nhân dân.'",
      rationale: "Khẳng định bản chất quyền lực thuộc về nhân dân; làm trong sạch bộ máy bằng chính cơ chế dân chủ hiến định."
    },
    flawedChoice: {
      text: "Vận động nhân dân rút đơn, cho cán bộ tự làm đơn xin thôi nhiệm vụ vì 'lý do sức khỏe' để bảo toàn thể diện cho cơ quan nhà nước.",
      impact: { people: -35, law: -30, integrity: -30, reform: -15 },
      quote: "Hồ Chí Minh: 'Bao che khuyết điểm, biến quyền làm chủ của nhân dân thành hình thức là tự lừa dối mình và lừa dối nhân dân.'",
      rationale: "Biến quyền bãi miễn thành thỏa thuận nội bộ, tước đoạt quyền lực kiểm soát nhà nước của nhân dân."
    }
  },
  {
    id: 13,
    quarter: "Quý 1 - Năm thứ 4",
    category: CATEGORIES.LIEM_CHINH,
    character: {
      name: "Ủy viên Ủy ban Kiểm tra",
      role: "Cơ quan Xác minh Tài sản Thu nhập",
      avatarId: "exam_officer",
      tagColor: "emerald"
    },
    situation: "Quy định kê khai tài sản công chức: Phát hiện một số cán bộ chủ chốt có khối tài sản bất động sản lớn đứng tên người thân (vợ, con, bố mẹ) nhưng không giải trình được nguồn gốc hợp pháp một cách rõ ràng. Nội bộ đề nghị chỉ xác minh những tài sản đứng tên trực tiếp cán bộ.",
    correctChoice: {
      text: "Mở rộng xác minh dòng tiền tài sản biến động bất thường của cả người có liên quan theo đúng tinh thần phòng chống tham nhũng, không có vùng cấm.",
      impact: { people: 20, law: 20, integrity: 35, reform: 15 },
      quote: "Hồ Chí Minh: 'Cán bộ phải chí công vô tư, trong sạch thì sợ gì nhân dân soi xét? Có khuất tất mới phải tìm cách tẩu tán giấu giếm.'",
      rationale: "Bịt kín lỗ hổng tẩu tán tài sản tham nhũng, giữ gìn sự liêm chính và niềm tin chính trị của nhân dân đối với chế độ."
    },
    flawedChoice: {
      text: "Chỉ xác minh đúng phạm vi tài sản đứng tên chính chủ cán bộ để tránh gây hoang mang, xáo trộn tâm lý làm việc của đội ngũ lãnh đạo.",
      impact: { people: -25, law: -20, integrity: -40, reform: -20 },
      quote: "Hồ Chí Minh: 'Làm ngơ trước hành vi mờ ám là tự mình đánh mất sự thanh liêm của người cán bộ cách mạng.'",
      rationale: "Tạo kẽ hở cho tệ tham ô rửa tiền tẩu tán tài sản, làm suy yếu tính răn đe của công cuộc phòng chống tiêu cực."
    }
  },
  {
    id: 14,
    quarter: "Quý 2 - Năm thứ 4",
    category: CATEGORIES.PHAP_QUYEN,
    character: {
      name: "Nhà báo Điều tra",
      role: "Báo Pháp luật & Đời sống",
      avatarId: "journalist",
      tagColor: "purple"
    },
    situation: "Vụ việc đê điều: Một cơ sở kinh doanh lấn chiếm hành lang thoát lũ bị lập biên bản cưỡng chế. Chủ cơ sở livestream lên mạng xã hội, kêu gọi cộng đồng mạng 'tẩy chay chính quyền vô cảm' và tạo làn sóng chỉ trích gay gắt trên mạng đòi huyện phải hợp thức hóa.",
    correctChoice: {
      text: "Công bố đồ họa khoa học về nguy cơ vỡ đê ngập 10.000 hộ dân hạ du nếu không tháo dỡ; hỗ trợ mặt bằng kinh doanh hợp pháp khác nhưng kiên quyết tháo dỡ đúng luật.",
      impact: { people: -5, law: 30, integrity: 20, reform: 15 },
      quote: "Hồ Chí Minh: 'Lãnh đạo nhân dân phải có bản lĩnh vững vàng, không được để chủ nghĩa dân túy mạng xã hội làm lung lay kỷ cương phép nước.'",
      rationale: "Bảo vệ pháp quyền XHCN và an toàn tính mạng lâu dài của cộng đồng; đấu tranh với tâm lý đám đông bằng sự minh bạch khoa học."
    },
    flawedChoice: {
      text: "Tạm đình chỉ cưỡng chế và cấp phép kinh doanh tạm thời để dập tắt khủng hoảng truyền thông mạng xã hội, tránh ảnh hưởng thi đua của huyện.",
      impact: { people: 10, law: -40, integrity: -25, reform: -25 },
      quote: "Hồ Chí Minh: 'Vì sợ dư luận xấu nhất thời mà thỏa hiệp với cái sai là biểu hiện hèn nhát của căn bệnh mị dân.'",
      rationale: "Rơi thẳng vào bẫy mị dân, vô hiệu hóa hiệu lực pháp luật, tạo nguy cơ thảm họa vỡ đê cho hàng vạn người dân."
    }
  },
  {
    id: 15,
    quarter: "Quý 3 - Năm thứ 4",
    category: CATEGORIES.CAI_CACH,
    character: {
      name: "Chị Thảo Khảo Sát",
      role: "Đoàn đánh giá Chỉ số Hài lòng SIPAS",
      avatarId: "surveyor",
      tagColor: "blue"
    },
    situation: "Báo cáo chỉ số SIPAS độc lập chỉ ra: Người dân và doanh nghiệp bức xúc nhất về khâu trích lục hồ sơ đất đai còn chậm trễ 15%. Một số đơn vị đề xuất phát phiếu khảo sát lại cho các hộ thân quen để 'kéo điểm' giúp huyện giữ vững Cờ Thi đua xuất sắc của tỉnh.",
    correctChoice: {
      text: "Công bố công khai kết quả thật trên cổng thông tin; người đứng đầu công khai xin lỗi nhân dân; thiết lập đường dây nóng giám sát trực tiếp khâu đo đạc đất đai.",
      impact: { people: 25, law: 15, integrity: 30, reform: 25 },
      quote: "Hồ Chí Minh: 'Có khuyết điểm thì thành khẩn nhận và quyết tâm sửa chữa. Che giấu khuyết điểm là có tội với Đảng, có tội với nhân dân.'",
      rationale: "Văn hóa công vụ cầu thị, coi sự phục vụ và hài lòng của nhân dân là thước đo tối cao của cải cách hành chính."
    },
    flawedChoice: {
      text: "Cho phép lọc lại mẫu khảo sát để điểm số đạt trên 95% hài lòng, giữ vững thành tích thi đua toàn diện của địa phương.",
      impact: { people: -35, law: -20, integrity: -45, reform: -35 },
      quote: "Hồ Chí Minh: 'Bệnh thành tích và dối trá là ung nhọt nguy hại nhất làm ruỗng mục bộ máy chính quyền.'",
      rationale: "Bệnh thành tích giả dối, triệt tiêu động lực cải cách thực chất, lừa dối cấp trên và phản bội lòng tin nhân dân."
    }
  },
  {
    id: 16,
    quarter: "Quý 4 - Năm thứ 4 (Về đích nhiệm kỳ)",
    category: CATEGORIES.NHA_NUOC_DAN,
    character: {
      name: "Bác Chủ tịch Mặt trận Tổ quốc",
      role: "Hội nghị Tiếp xúc Cử tri Toàn Huyện",
      avatarId: "front_president",
      tagColor: "amber"
    },
    situation: "Đại hội Đảng bộ và Hội đồng Nhân dân khóa mới: Các ý kiến gợi ý nên trích một khoản ngân sách dự phòng địa phương làm 'kinh phí quà tặng tri ân' và tiếp đón nồng hậu các đại biểu về dự để đảm bảo 100% phiếu bầu tái đắc cử chức vụ người đứng đầu.",
    correctChoice: {
      text: "Kiên quyết bác bỏ chi quà cáp; trình bày báo cáo trung thực toàn bộ những việc đã làm được và những tồn tại chưa làm được để đại biểu và nhân dân tự do đánh giá tín nhiệm.",
      impact: { people: 25, law: 25, integrity: 35, reform: 20 },
      quote: "Hồ Chí Minh: 'Cán bộ là người đầy tớ trung thành của nhân dân, không phải là ông quan cách mạng để tranh giành địa vị, dùng mưu chước mưu cầu chức tước.'",
      rationale: "Phẩm chất người công bộc liêm chính mẫu mực; tuyệt đối tôn trọng quyền làm chủ và sự lựa chọn công tâm của nhân dân."
    },
    flawedChoice: {
      text: "Chi ngân sách vận động hành lang theo thông lệ ngầm để bảo đảm kết quả trúng cử tuyệt đối, tiếp tục giữ vững quyền lực lãnh đạo nhiệm kỳ sau.",
      impact: { people: -35, law: -40, integrity: -50, reform: -25 },
      quote: "Hồ Chí Minh: 'Chạy chức, chạy quyền, dùng tiền của nhân dân để mua chuộc quyền lực là sự phản bội lớn nhất đối với lý tưởng cách mạng.'",
      rationale: "Tha hóa quyền lực hoàn toàn, biến cơ quan nhà nước thành công cụ tư lợi cá nhân, vi phạm nghiêm trọng Luật Bầu cử."
    }
  }
];

// Helper: Seeded pseudo-random generator (Mulberry32-based hash)
function createSeededRng(seedStr) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  return function() {
    h += 0x6D2B79F5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds dilemmas with dynamically randomized A/B option positions.
 * - Guarantees exactly 8 correct choices on Left (Option A) and 8 on Right (Option B) (50/50 balance).
 * - Shuffles the assignment so the correct side per quarter is unpredictable.
 * - If seed is provided (e.g. roomCode in multiplayer), produces identical order for all room participants.
 * - If no seed is provided, generates a fresh random permutation for solo play.
 */
export function getShuffledDilemmas(seed = null) {
  const rng = seed ? createSeededRng(String(seed)) : Math.random;

  // Exactly 8 'left' (Option A) and 8 'right' (Option B) for correct answer
  const correctPositions = [
    'left', 'left', 'left', 'left', 'left', 'left', 'left', 'left',
    'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right'
  ];

  // Fisher-Yates shuffle
  for (let i = correctPositions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [correctPositions[i], correctPositions[j]] = [correctPositions[j], correctPositions[i]];
  }

  return RAW_DILEMMAS.map((dilemma, idx) => {
    const isCorrectOnLeft = correctPositions[idx] === 'left';
    return {
      ...dilemma,
      leftChoice: isCorrectOnLeft ? dilemma.correctChoice : dilemma.flawedChoice,
      rightChoice: isCorrectOnLeft ? dilemma.flawedChoice : dilemma.correctChoice,
      correctChoice: dilemma.correctChoice,
      flawedChoice: dilemma.flawedChoice,
      correctSide: isCorrectOnLeft ? 'left' : 'right'
    };
  });
}

// Statically balanced DILEMMAS array (8 correct on A/Left, 8 correct on B/Right)
// IDs with correct on Left (A): 1, 3, 5, 8, 10, 12, 14, 16
// IDs with correct on Right (B): 2, 4, 6, 7, 9, 11, 13, 15
const STATIC_LEFT_IDS = new Set([1, 3, 5, 8, 10, 12, 14, 16]);

export const DILEMMAS = RAW_DILEMMAS.map((dilemma) => {
  const isCorrectOnLeft = STATIC_LEFT_IDS.has(dilemma.id);
  return {
    ...dilemma,
    leftChoice: isCorrectOnLeft ? dilemma.correctChoice : dilemma.flawedChoice,
    rightChoice: isCorrectOnLeft ? dilemma.flawedChoice : dilemma.correctChoice,
    correctChoice: dilemma.correctChoice,
    flawedChoice: dilemma.flawedChoice,
    correctSide: isCorrectOnLeft ? 'left' : 'right'
  };
});

export const GENERAL_QUOTES = [
  {
    quote: "Nước ta là nước dân chủ, bao nhiêu lợi ích đều vì dân, bao nhiêu quyền hạn đều của dân.",
    source: "Hồ Chí Minh, Báo Sự Thật, 1949"
  },
  {
    quote: "Việc gì có lợi cho dân, ta phải hết sức làm. Việc gì hại đến dân, ta phải hết sức tránh.",
    source: "Hồ Chí Minh, Thư gửi UBND các kỳ, tỉnh, huyện và làng, 1945"
  },
  {
    quote: "Cán bộ là người đầy tớ của nhân dân, chứ không phải là 'quan cách mạng' để đè đầu cưỡi cổ nhân dân.",
    source: "Hồ Chí Minh, Bài nói chuyện tại trường Cán bộ Hành chính, 1950"
  },
  {
    quote: "Trăm điều phải có thần linh pháp quyền.",
    source: "Nguyễn Ái Quốc, Việt Nam yêu cầu ca, 1919"
  },
  {
    quote: "Tham ô, lãng phí và bệnh quan liêu là giặc nội xâm, kẻ thù nguy hiểm của nhân dân.",
    source: "Hồ Chí Minh, Bài nói chuyện tại lớp chỉnh Đảng TW, 1952"
  },
  {
    quote: "Có khi làm những việc mới xem qua như là hại đến dân, nhưng thực chất là vì lợi ích toàn cục, vì lợi ích lâu dài của nhân dân.",
    source: "Hồ Chí Minh: Toàn tập, t.5, tr.285"
  }
];
