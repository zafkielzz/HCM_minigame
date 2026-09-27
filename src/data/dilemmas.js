// Bộ dữ liệu các tình huống (Dilemmas) bám sát Giáo trình Tư tưởng Hồ Chí Minh - Chương 4
// "Tư tưởng Hồ Chí Minh về xây dựng Nhà nước của dân, do dân, vì dân và yêu cầu cải cách hành chính hiện nay"

export const CATEGORIES = {
  NHA_NUOC_DAN: "Nhà nước của dân, do dân, vì dân",
  PHAP_QUYEN: "Nhà nước pháp quyền & Thượng tôn pháp luật",
  LIEM_CHINH: "Xây dựng Nhà nước trong sạch, phòng chống tiêu cực",
  CAI_CACH: "Cải cách hành chính & Chuyển đổi số"
};

export const DILEMMAS = [
  {
    id: 1,
    quarter: "Quý 1 - Năm thứ 1",
    category: CATEGORIES.NHA_NUOC_DAN,
    character: {
      name: "Bác Ba Nông Dân",
      role: "Đại diện Ban thanh tra nhân dân thôn",
      avatar: "👴",
      tagColor: "amber"
    },
    situation: "Bà con bức xúc về mức đền bù dự án làm đường liên xã. Cán bộ văn phòng khuyên đồng chí nên hạn chế tiếp xúc trực tiếp để tránh áp lực từ cử tri đông đảo.",
    leftChoice: {
      text: "Tổ chức đối thoại trực tiếp, công khai phương án đền bù và ghi nhận ý kiến dân.",
      impact: { people: 20, law: 5, integrity: -5, reform: 15 },
      quote: "Hồ Chí Minh: 'Việc gì có lợi cho dân, ta phải hết sức làm. Việc gì hại đến dân, ta phải hết sức tránh.'",
      rationale: "Thực hiện đúng bản chất Nhà nước do dân, vì dân; dân chủ cơ sở 'Dân biết, dân bàn, dân làm, dân kiểm tra'."
    },
    rightChoice: {
      text: "Giao cấp dưới trả lời văn bản, tránh tiếp xúc đông người để giữ an ninh trụ sở.",
      impact: { people: -25, law: 5, integrity: 0, reform: -15 },
      quote: "Hồ Chí Minh: 'Xa rời quần chúng, không đi sâu vào đời sống của dân, đó là căn bệnh quan liêu nguy hiểm.'",
      rationale: "Vi phạm nguyên tắc gần dân, biểu hiện của bệnh quan liêu hách dịch, làm suy giảm niềm tin chính trị của nhân dân."
    }
  },
  {
    id: 2,
    quarter: "Quý 2 - Năm thứ 1",
    category: CATEGORIES.CAI_CACH,
    character: {
      name: "Đồng chí Thu Hà",
      role: "Chuyên viên Bộ phận Một Cửa",
      avatar: "👩‍💼",
      tagColor: "blue"
    },
    situation: "Nhiều người dân đi làm thủ tục hành chính bị cán bộ vòi xuất trình sổ hộ khẩu giấy cũ dù đã có quy định tích hợp trên cơ sở dữ liệu số VNeID.",
    leftChoice: {
      text: "Xử lý nghiêm cán bộ đòi giấy tờ thừa, bắt buộc 100% khai thác dữ liệu số VNeID.",
      impact: { people: 25, law: 10, integrity: 10, reform: 25 },
      quote: "Hồ Chí Minh: 'Cán bộ là người đầy tớ của nhân dân... Thủ tục mà rườm rà lắt léo là hành dân.'",
      rationale: "Đột phá cải cách thủ tục hành chính, chuyển đổi số thực chất, lấy sự phục vụ người dân làm trung tâm."
    },
    rightChoice: {
      text: "Thôi thì linh động cho phép thu bản sao giấy để tránh rủi ro nghẽn mạng.",
      impact: { people: -15, law: -10, integrity: -5, reform: -25 },
      quote: "Hồ Chí Minh: 'Cải cách hành chính không được nửa vời, chần chừ, bảo thủ.'",
      rationale: "Tạo kẽ hở cho tệ quan liêu, giấy phép con bủa vây, đi ngược lại chương trình hiện đại hóa nền hành chính quốc gia."
    }
  },
  {
    id: 3,
    quarter: "Quý 3 - Năm thứ 1",
    category: CATEGORIES.LIEM_CHINH,
    character: {
      name: "Đ/c Trưởng phòng Tài chính",
      role: "Ban Quản lý Ngân sách Huyện",
      avatar: "👨‍💼",
      tagColor: "emerald"
    },
    situation: "Có đề xuất trích 15 tỷ đồng ngân sách để xây dựng một 'Cổng chào biểu tượng' hoành tráng chào mừng sự kiện lớn của địa phương.",
    leftChoice: {
      text: "Bác bỏ đề án cổng chào, chuyển toàn bộ kinh phí tu sửa 3 trạm y tế và trường mầm non.",
      impact: { people: 25, law: 5, integrity: 30, reform: 15 },
      quote: "Hồ Chí Minh: 'Lãng phí tuy không lấy của công bỏ túi, nhưng kết quả cũng rất tai hại cho nhân dân, cho Chính phủ.'",
      rationale: "Chống bệnh hình thức phô trương, thực hành tiết kiệm, bảo toàn công quỹ phục vụ đời sống nhân dân."
    },
    rightChoice: {
      text: "Phê duyệt xây dựng để tạo dấu ấn kiến trúc và nâng cao thể diện lãnh đạo huyện.",
      impact: { people: -20, law: -5, integrity: -35, reform: -10 },
      quote: "Hồ Chí Minh: 'Tham ô, lãng phí và bệnh quan liêu là thứ giặc nội xâm, kẻ thù nguy hiểm của nhân dân.'",
      rationale: "Mắc bệnh phô trương, thành tích ảo, lãng phí mồ hôi nước mắt và tiền thuế của nhân dân."
    }
  },
  {
    id: 4,
    quarter: "Quý 4 - Năm thứ 1",
    category: CATEGORIES.PHAP_QUYEN,
    character: {
      name: "Ông Vĩnh Hưng",
      role: "Chủ xưởng gỗ lớn kiêm người họ hàng thân tín",
      avatar: "🧔",
      tagColor: "purple"
    },
    situation: "Xưởng gỗ của người quen chưa đủ điều kiện nghiệm thu PCCC, đến xin bạn 'ký tạm linh động' để kịp mở cửa giao lô hàng xuất khẩu sang châu Âu.",
    leftChoice: {
      text: "Kiên quyết từ chối ký, yêu cầu khắc phục triệt để an toàn PCCC mới được phép vận hành.",
      impact: { people: 5, law: 30, integrity: 25, reform: 10 },
      quote: "Hồ Chí Minh: 'Pháp luật của ta là pháp luật dân chủ... Bất kỳ ai vi phạm đều phải xử lý, không có vùng cấm.'",
      rationale: "Thực hiện 'thần linh pháp quyền', thượng tôn Hiến pháp và pháp luật, không vị tình riêng mà dung dưỡng sai phạm."
    },
    rightChoice: {
      text: "Ký cho phép hoạt động tạm thời 3 tháng vì tình nghĩa gia đình và hỗ trợ tăng trưởng.",
      impact: { people: -10, law: -35, integrity: -25, reform: -15 },
      quote: "Hồ Chí Minh: 'Tư túng, chia rẽ, kéo bè kéo cánh là căn bệnh phá hoại đoàn kết và kỷ cương pháp nước.'",
      rationale: "Vi phạm nghiêm trọng nguyên tắc nhà nước pháp quyền, tư túng người nhà, tiềm ẩn thảm họa cháy nổ."
    }
  },
  {
    id: 5,
    quarter: "Quý 1 - Năm thứ 2",
    category: CATEGORIES.CAI_CACH,
    character: {
      name: "Đồng chí Trưởng ban Tổ chức",
      role: "Ban Đổi mới sắp xếp bộ máy",
      avatar: "👔",
      tagColor: "blue"
    },
    situation: "Thực hiện Nghị quyết về tinh giản bộ máy: Có kế hoạch sáp nhập 3 phòng ban chồng chéo chức năng, giảm 2 cấp trưởng và 5 biên chế dôi dư, nhưng nội bộ đang phản đối gay gắt.",
    leftChoice: {
      text: "Quyết tâm sáp nhập tinh gọn, thực hiện thi tuyển cạnh tranh vị trí việc làm minh bạch.",
      impact: { people: 15, law: 15, integrity: 20, reform: 30 },
      quote: "Hồ Chí Minh: 'Bộ máy phải tinh giản, gọn gàng, hoạt động có hiệu lực, thiết thực, tránh cồng kềnh quan liêu.'",
      rationale: "Xây dựng bộ máy hành chính tinh gọn, hiệu lực, hiệu quả theo đúng tinh thần cải cách thể chế hiện nay."
    },
    rightChoice: {
      text: "Tạm dừng đề án sáp nhập để 'dĩ hòa vi quý', giữ nguyên bộ máy tránh xung đột.",
      impact: { people: -15, law: -10, integrity: -20, reform: -35 },
      quote: "Hồ Chí Minh: 'Cán bộ mà sợ va chạm, sợ mất lòng người này người nọ thì không thể làm cách mạng được.'",
      rationale: "Tâm lý sợ trách nhiệm, bảo thủ, duy trì bộ máy cồng kềnh ăn lương ngân sách làm giảm năng lực phục vụ."
    }
  },
  {
    id: 6,
    quarter: "Quý 2 - Năm thứ 2",
    category: CATEGORIES.NHA_NUOC_DAN,
    character: {
      name: "Bà Hai Cử Tri",
      role: "Đại biểu Hội đồng Nhân dân xã",
      avatar: "👵",
      tagColor: "amber"
    },
    situation: "Dự án quy hoạch trung tâm sinh hoạt cộng đồng: Một tập đoàn bất động sản muốn mua lại để xây khu thương mại sinh lời cao, nhưng cử tri muốn làm công viên cây xanh công cộng.",
    leftChoice: {
      text: "Tổ chức hội nghị lấy phiếu biểu quyết của toàn thể cử tri nhân dân để quyết định.",
      impact: { people: 30, law: 15, integrity: 15, reform: 10 },
      quote: "Hồ Chí Minh: 'Nước ta là nước dân chủ. Địa vị cao nhất là dân, vì dân là chủ.'",
      rationale: "Thực hiện quyền làm chủ của nhân dân, tôn trọng nguyên tắc 'quyền lực nhà nước thuộc về nhân dân'."
    },
    rightChoice: {
      text: "Chính quyền tự duyệt bán đất cho tập đoàn để tăng ngân sách nhanh chóng.",
      impact: { people: -35, law: -15, integrity: -20, reform: -10 },
      quote: "Hồ Chí Minh: 'Nếu chính phủ làm hại dân thì dân có quyền đuổi chính phủ... Lãnh đạo không được độc đoán chuyên quyền.'",
      rationale: "Xa rời lợi ích nhân dân, biểu hiện lạm quyền độc đoán, coi thường quyền dân chủ trực tiếp."
    }
  },
  {
    id: 7,
    quarter: "Quý 3 - Năm thứ 2",
    category: CATEGORIES.LIEM_CHINH,
    character: {
      name: "Đồng chí Chánh Thanh tra",
      role: "Cơ quan Thanh tra Huyện",
      avatar: "🕵️‍♂️",
      tagColor: "emerald"
    },
    situation: "Phát hiện một cán bộ địa chính vòi vĩnh nhận hối lộ làm sổ đỏ của người nghèo. Đáng chú ý, cán bộ này là con của một đồng chí có nhiều huân chương công trạng.",
    leftChoice: {
      text: "Chuyển ngay hồ sơ sang Viện kiểm sát để khởi tố nghiêm minh theo pháp luật.",
      impact: { people: 25, law: 35, integrity: 30, reform: 10 },
      quote: "Hồ Chí Minh: 'Thiết diện vô tư... Chớ vì công lao của cha anh mà che đậy khuyết điểm của con em.'",
      rationale: "Bảo đảm tính nghiêm minh của pháp luật, không có vùng cấm, phòng chống tham ô nhũng nhiễu."
    },
    rightChoice: {
      text: "Cho rút kinh nghiệm nội bộ, luân chuyển sang bộ phận khác để giữ thể diện gia đình người có công.",
      impact: { people: -30, law: -35, integrity: -35, reform: -15 },
      quote: "Hồ Chí Minh: 'Bao che cho kẻ sai trái tức là đồng lõa, làm hư hỏng đội ngũ cán bộ, làm mất lòng tin của dân.'",
      rationale: "Bệnh cánh hẩu, tư túng, làm xói mòn lòng tin của nhân dân vào sự công bằng của pháp luật."
    }
  },
  {
    id: 8,
    quarter: "Quý 4 - Năm thứ 2",
    category: CATEGORIES.CAI_CACH,
    character: {
      name: "Kỹ sư Chuyển đổi số Minh",
      role: "Tổ Công nghệ Đổi mới Sáng tạo",
      avatar: "👨‍💻",
      tagColor: "blue"
    },
    situation: "Đề xuất cắt giảm 12 loại giấy chứng thực rườm rà, thay bằng xác thực trực tuyến qua Cổng Dịch vụ công. Một số cán bộ lâu năm ngại học phần mềm mới.",
    leftChoice: {
      text: "Ban hành quyết định số hóa ngay, tổ chức đào tạo cấp tốc và đánh giá thi đua theo kết quả phục vụ dân.",
      impact: { people: 25, law: 10, integrity: 15, reform: 35 },
      quote: "Hồ Chí Minh: 'Thời đại ngày càng văn minh, cán bộ phải không ngừng học tập, trau dồi chuyên môn để phụng sự.'",
      rationale: "Hiện đại hóa nền hành chính, cải cách phương thức quản lý, nâng cao chỉ số phục vụ nhân dân."
    },
    rightChoice: {
      text: "Chờ thêm vài năm để đội ngũ lớn tuổi về hưu hết rồi mới áp dụng công nghệ mới.",
      impact: { people: -20, law: -5, integrity: -10, reform: -35 },
      quote: "Hồ Chí Minh: 'Bảo thủ, lười biếng, không chịu tiến bộ cũng là một dạng thoái hóa.'",
      rationale: "Trì trệ, kìm hãm sự phát triển của nền hành chính số, kéo lùi hiệu quả quản lý nhà nước."
    }
  },
  {
    id: 9,
    quarter: "Quý 1 - Năm thứ 3",
    category: CATEGORIES.PHAP_QUYEN,
    character: {
      name: "Bà Cụ Tám Bán Rong",
      role: "Người già mưu sinh trên vỉa hè",
      avatar: "👵",
      tagColor: "purple"
    },
    situation: "Đợt ra quân lập lại trật tự đô thị: Đội trật tự đề xuất tịch thu toàn bộ xe gánh của các cụ già bán hàng rong lấn chiếm góc phố để lập thành tích 'tuyến phố kiểu mẫu'.",
    leftChoice: {
      text: "Bố trí khu vực chợ truyền thống tập trung cho người nghèo bán mưu sinh kết hợp tuyên truyền tự giác.",
      impact: { people: 30, law: 10, integrity: 10, reform: 15 },
      quote: "Hồ Chí Minh: 'Đạo đức cách mạng là phải thương yêu nhân dân... Pháp trị phải đi đôi với đức trị.'",
      rationale: "Kết hợp nhuần nhuyễn giữa 'Đức trị' và 'Pháp trị' theo tư tưởng Hồ Chí Minh: pháp luật nghiêm nhưng vì con người."
    },
    rightChoice: {
      text: "Tịch thu hết và xử phạt kịch khung theo đúng câu chữ nghị định cho sạch đường.",
      impact: { people: -35, law: 15, integrity: -5, reform: -10 },
      quote: "Hồ Chí Minh: 'Không được mang thói hách dịch, máy móc, vô cảm với nỗi khổ cực của đồng bào.'",
      rationale: "Cứng nhắc, máy móc, xa rời bản chất nhà nước của dân, do dân, vì dân, đẩy người nghèo vào đường cùng."
    }
  },
  {
    id: 10,
    quarter: "Quý 2 - Năm thứ 3",
    category: CATEGORIES.LIEM_CHINH,
    character: {
      name: "Giám đốc Doanh nghiệp Xây dựng",
      role: "Nhà thầu thân quen dự án trường học",
      avatar: "💼",
      tagColor: "emerald"
    },
    situation: "Đấu thầu xây dựng trường học liên xã: Nhà thầu xin cài đặt tiêu chí kỹ thuật riêng biệt để hạn chế nhà thầu khác tham gia, đổi lại hứa trích 5% hỗ trợ ngân sách 'tiếp khách' của huyện.",
    leftChoice: {
      text: "Yêu cầu đấu thầu rộng rãi 100% qua Mạng Đấu thầu Quốc gia, công khai minh bạch toàn bộ tiêu chí.",
      impact: { people: 20, law: 25, integrity: 35, reform: 20 },
      quote: "Hồ Chí Minh: 'Của công là mồ hôi nước mắt của đồng bào. Lợi dụng chức quyền ăn bớt của dân là có tội lớn.'",
      rationale: "Đảm bảo tính cạnh tranh lành mạnh, triệt tiêu tham nhũng, lợi ích nhóm trong đầu tư công."
    },
    rightChoice: {
      text: "Tạo điều kiện cài cắm tiêu chí để nhà thầu địa phương thắng thầu có kinh phí phục vụ cơ quan.",
      impact: { people: -20, law: -35, integrity: -40, reform: -20 },
      quote: "Hồ Chí Minh: 'Lòng tham lam, trục lợi cá nhân là nguồn gốc sinh ra mọi thứ tội lỗi.'",
      rationale: "Tha hóa quyền lực, cấu kết lợi ích nhóm, vi phạm Luật Đấu thầu và nguyên tắc đạo đức công vụ."
    }
  },
  {
    id: 11,
    quarter: "Quý 3 - Năm thứ 3",
    category: CATEGORIES.CAI_CACH,
    character: {
      name: "Đồng chí Giám đốc Ban QLDA",
      role: "Cán bộ phụ trách giải ngân vốn công",
      avatar: "👷‍♂️",
      tagColor: "blue"
    },
    situation: "Bệnh 'Sợ trách nhiệm': Hồ sơ giải ngân trạm bơm chống úng ngập đúng quy định nhưng cán bộ sợ sai sót nên không ai chịu ký nháy, đùn đẩy lên tận bàn Chủ tịch huyện xin ý kiến.",
    leftChoice: {
      text: "Họp chấn chỉnh, phân công thẩm quyền rành mạch, bảo vệ cán bộ dám nghĩ dám làm vì dân, xử lý người đùn đẩy.",
      impact: { people: 20, law: 15, integrity: 15, reform: 30 },
      quote: "Hồ Chí Minh: 'Cán bộ mà sợ trách nhiệm, thấy việc khó thì lùi là kẻ hèn nhát, vô trách nhiệm với dân.'",
      rationale: "Khắc phục triệt để bệnh đùn đẩy né tránh, phát huy cơ chế bảo vệ cán bộ năng động sáng tạo theo Nghị quyết Đảng."
    },
    rightChoice: {
      text: "Cũng lo ngại bị kiểm tra nên tiếp tục làm văn bản gửi lòng vòng lên các Sở xin hướng dẫn.",
      impact: { people: -25, law: -5, integrity: -15, reform: -35 },
      quote: "Hồ Chí Minh: 'Ngồi bàn giấy gõ mõ cầm chừng, đẩy qua đẩy lại là thứ vi trùng quan liêu ăn mòn đất nước.'",
      rationale: "Tê liệt bộ máy, lỡ mùa màng ngập úng của nhân dân, lãng phí nguồn lực công cộng."
    }
  },
  {
    id: 12,
    quarter: "Quý 4 - Năm thứ 3",
    category: CATEGORIES.NHA_NUOC_DAN,
    character: {
      name: "Đồng chí Bí thư Huyện đoàn",
      role: "Thành viên Ban Giám sát Khiếu nại",
      avatar: "🧑‍🎓",
      tagColor: "amber"
    },
    situation: "Một đại biểu HĐND huyện nhiều kỳ liền không tham gia tiếp xúc cử tri, có thái độ trịch thượng và bị nhân dân khu phố ký tên kiến nghị bãi miễn tư cách đại biểu.",
    leftChoice: {
      text: "Tiến hành quy trình bãi miễn đúng luật theo nguyện vọng chính đáng của nhân dân.",
      impact: { people: 30, law: 25, integrity: 20, reform: 15 },
      quote: "Hồ Chí Minh: 'Nhân dân có quyền bầu cử thì cũng có quyền bãi miễn những đại biểu không xứng đáng.'",
      rationale: "Thực hiện quyền lực nhân dân, làm cho bộ máy nhà nước luôn trong sạch và xứng đáng với sự ủy quyền của nhân dân."
    },
    rightChoice: {
      text: "Vận động nhân dân rút đơn để bảo đảm 'tỷ lệ cán bộ hoàn thành xuất sắc nhiệm vụ' của huyện.",
      impact: { people: -35, law: -25, integrity: -25, reform: -10 },
      quote: "Hồ Chí Minh: 'Coi quyền lực là của riêng mình, phớt lờ quyền làm chủ của nhân dân là trái bản chất chế độ ta.'",
      rationale: "Vi phạm quyền dân chủ đại diện, biến bầu cử bãi miễn thành hình thức, vi phạm Hiến pháp."
    }
  },
  {
    id: 13,
    quarter: "Quý 1 - Năm thứ 4",
    category: CATEGORIES.LIEM_CHINH,
    character: {
      name: "Ủy viên Ủy ban Kiểm tra",
      role: "Cơ quan Kê khai Tài sản",
      avatar: "📋",
      tagColor: "emerald"
    },
    situation: "Dự thảo Quy chế công khai minh bạch tài sản, thu nhập của toàn bộ lãnh đạo chủ chốt trên cổng thông tin điện tử huyện để nhân dân giám sát.",
    leftChoice: {
      text: "Ký ban hành ngay, đồng thời tiên phong công khai tài sản của chính gia đình mình trước toàn dân.",
      impact: { people: 35, law: 20, integrity: 40, reform: 20 },
      quote: "Hồ Chí Minh: 'Muốn người ta nghe theo, trước hết mình phải làm mực thước cho người ta bắt chước.'",
      rationale: "Phát huy vai trò nêu gương của người đứng đầu, kiểm soát quyền lực tài sản, củng cố lòng tin."
    },
    rightChoice: {
      text: "Chỉ niêm yết trong phòng họp kín của chi bộ vì sợ dư luận soi mói đời tư cán bộ.",
      impact: { people: -25, law: -15, integrity: -35, reform: -15 },
      quote: "Hồ Chí Minh: 'Cán bộ trong sạch thì sợ gì nhân dân soi xét? Có khuất tất mới phải giấu giếm.'",
      rationale: "Che giấu thông tin, cản trở sự giám sát của nhân dân đối với cán bộ công chức."
    }
  },
  {
    id: 14,
    quarter: "Quý 2 - Năm thứ 4",
    category: CATEGORIES.PHAP_QUYEN,
    character: {
      name: "Nhà báo Điều tra",
      role: "Báo Pháp luật & Đời sống",
      avatar: "📰",
      tagColor: "purple"
    },
    situation: "Trên mạng lan truyền video một gia đình dựng rạp lấn chiếm toàn bộ đê thoát lũ. Khi xã yêu cầu dỡ bỏ thì họ livestream khóc lóc, cư dân mạng tạo áp lực đòi miễn trừ cho họ.",
    leftChoice: {
      text: "Kiên trì tuyên truyền nguy cơ sạt lở đê, hỗ trợ an cư hợp pháp nhưng kiên quyết tháo dỡ đúng pháp luật.",
      impact: { people: 5, law: 35, integrity: 15, reform: 15 },
      quote: "Hồ Chí Minh: 'Lãnh đạo không được mị dân, không được theo đuôi quần chúng một cách vô nguyên tắc.'",
      rationale: "Giữ vững nguyên tắc pháp quyền xã hội chủ nghĩa, không nhân nhượng trước căn bệnh dân túy mị dân."
    },
    rightChoice: {
      text: "Nhượng bộ cư dân mạng, cấp phép đặc cách cho tồn tại trên mặt đê để dập tắt dư luận tức thời.",
      impact: { people: -10, law: -40, integrity: -20, reform: -25 },
      quote: "Hồ Chí Minh: 'Phá vỡ kỷ cương phép nước để cầu danh hão là tự sát chính trị.'",
      rationale: "Bệnh mị dân nguy hiểm, phá vỡ hệ thống pháp luật an toàn đê điều, đe dọa sinh mạng hàng vạn hộ dân hạ du."
    }
  },
  {
    id: 15,
    quarter: "Quý 3 - Năm thứ 4",
    category: CATEGORIES.CAI_CACH,
    character: {
      name: "Chị Thảo Khảo Sát",
      role: "Đoàn đánh giá Chỉ số Hài lòng SIPAS",
      avatar: "📊",
      tagColor: "blue"
    },
    situation: "Kết quả đo lường sự hài lòng của nhân dân (SIPAS) quý này tại bộ phận cấp phép kinh doanh giảm sút do thủ tục thẩm định còn rườm rà. Lãnh đạo phòng đề xuất xin 'chỉnh số liệu đẹp' để giữ danh hiệu thi đua.",
    leftChoice: {
      text: "Công khai thật thà kết quả trên báo chí, xin lỗi nhân dân và cam kết tinh gọn quy trình trong 30 ngày.",
      impact: { people: 30, law: 15, integrity: 30, reform: 30 },
      quote: "Hồ Chí Minh: 'Có khuyết điểm thì thành khẩn nhận và sửa chữa. Giấu khuyết điểm là lừa dối nhân dân.'",
      rationale: "Văn hóa công vụ cầu thị, coi sự hài lòng của nhân dân là thước đo tối cao của cải cách hành chính."
    },
    rightChoice: {
      text: "Cho phép sửa số liệu khảo sát lên 98% hài lòng để địa phương được nhận Cờ Thi đua xuất sắc.",
      impact: { people: -30, law: -20, integrity: -40, reform: -35 },
      quote: "Hồ Chí Minh: 'Bệnh thành tích và dối trá là ung nhọt làm ruỗng mục bộ máy chính quyền.'",
      rationale: "Bệnh thành tích dối trá, triệt tiêu động lực cải cách thực chất, phản bội lòng tin nhân dân."
    }
  },
  {
    id: 16,
    quarter: "Quý 4 - Năm thứ 4 (Về đích nhiệm kỳ)",
    category: CATEGORIES.NHA_NUOC_DAN,
    character: {
      name: "Bác Chủ tịch Mặt trận Tổ quốc",
      role: "Hội nghị Tiếp xúc Cử tri Toàn Huyện",
      avatar: "🏛️",
      tagColor: "amber"
    },
    situation: "Kết thúc nhiệm kỳ 4 năm: Chuẩn bị Đại hội bầu cử khóa mới. Nhiều người khuyên bạn nên dùng ngân sách chi quà tặng cho các đại biểu để gom phiếu tín nhiệm tuyệt đối.",
    leftChoice: {
      text: "Báo cáo công khai toàn bộ công việc đã làm và những tồn tại trước nhân dân, để dân tự do lựa chọn công tâm.",
      impact: { people: 35, law: 30, integrity: 35, reform: 25 },
      quote: "Hồ Chí Minh: 'Cán bộ là người đày tớ trung thành của nhân dân, không phải là ông quan cách mạng.'",
      rationale: "Giữ vững phẩm chất công bộc liêm chính, tôn trọng quyền lựa chọn dân chủ thực chất của nhân dân."
    },
    rightChoice: {
      text: "Trích quỹ công chi quà cáp và tổ chức tiệc tùng vận động hành lang để đảm bảo 100% phiếu bầu.",
      impact: { people: -30, law: -35, integrity: -45, reform: -20 },
      quote: "Hồ Chí Minh: 'Dùng thủ đoạn mua chuộc phiếu bầu là biến cơ quan quyền lực nhà nước thành nơi buôn bán quyền lực.'",
      rationale: "Chạy chức chạy quyền, suy thoái đạo đức cách mạng nghiêm trọng, vi phạm Luật Bầu cử."
    }
  }
];

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
  }
];
