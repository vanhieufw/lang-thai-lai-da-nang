(() => {
  const quiz = document.querySelector("#do-vui");
  if (!quiz) return;
  const get = (selector) => quiz.querySelector(selector);
  const start = get("[data-quiz-start]");
  const play = get("[data-quiz-play]");
  const result = get("[data-quiz-result]");
  const prizes = get("[data-quiz-rewards]");
  const startButton = get("[data-start-quiz]");
  const progress = get("[data-quiz-progress]");
  const meter = get("[data-quiz-meter]");
  const questionText = get("[data-quiz-question]");
  const options = get("[data-quiz-options]");
  const feedback = get("[data-quiz-feedback]");
  const next = get("[data-quiz-next]");
  const resultTitle = get("[data-quiz-result-title]");
  const resultCopy = get("[data-quiz-result-copy]");
  const storageKey = "thai-lai-quiz-best";
  const pointsKey = "thai-lai-su-gia-points";

  const questionBank = [
    {
      text: "Làng Thái Lai nằm bên bờ nào của sông Túy Loan?",
      answers: [
        "Bờ bắc",
        "Bờ nam",
        "Hai bên bờ",
        "Không giáp sông"
      ],
      correct: 0,
      detail: "Làng trải dài bên bờ bắc sông Túy Loan."
    },
    {
      text: "Tên gọi cũ của làng Thái Lai thời nhà Lê là gì?",
      answers: [
        "Bàu Trai",
        "Túy Loan",
        "Hòa Nhơn",
        "Cẩm Lệ"
      ],
      correct: 0,
      detail: "Tên cũ là Bàu Trai; năm 1818 (Gia Long thứ 10) đổi thành Thái Lai."
    },
    {
      text: "Đình làng Thái Lai được công nhận di tích cấp thành phố khoảng năm nào?",
      answers: [
        "2010",
        "2000",
        "2018",
        "2022"
      ],
      correct: 0,
      detail: "Công nhận di tích lịch sử – văn hóa cấp thành phố năm 2010."
    },
    {
      text: "Đình làng Thái Lai có tuổi đời khoảng bao nhiêu?",
      answers: [
        "Gần 300 năm",
        "Khoảng 50 năm",
        "Hơn 800 năm",
        "Mới xây 2010"
      ],
      correct: 0,
      detail: "Đình hình thành gần 300 năm, kiến trúc thời Nguyễn."
    },
    {
      text: "Nhà cổ Tích Thiện Đường thuộc kiểu kiến trúc nào?",
      answers: [
        "Ba gian hai chái",
        "Năm gian hai chái",
        "Nhà sàn",
        "Biệt thự Pháp"
      ],
      correct: 0,
      detail: "Nhà rường ba gian hai chái, mái ngói âm dương."
    },
    {
      text: "Thợ mộc nào gắn với việc dựng Tích Thiện Đường?",
      answers: [
        "Kim Bồng (Quảng Nam)",
        "Chàng Sơn (Hà Nội)",
        "La Xuyên (Nam Định)",
        "Đồng Xâm"
      ],
      correct: 0,
      detail: "Thợ mộc làng nghề Kim Bồng với kỹ thuật mộng gỗ."
    },
    {
      text: "Chủ nhân Đỗ Gia Viên / Tích Thiện Đường thường được nhắc đến là ai?",
      answers: [
        "Ông Đỗ Hữu Minh",
        "Ông Nguyễn Văn Dự",
        "Ông Nguyễn Đăng Sữ",
        "Ông Đỗ Văn Oai"
      ],
      correct: 0,
      detail: "Ông Đỗ Hữu Minh là chủ nhân nhà cổ và Đỗ Gia Viên."
    },
    {
      text: "Đỗ Gia Viên rộng khoảng bao nhiêu?",
      answers: [
        "Khoảng 3.500–5.000 m²",
        "Dưới 200 m²",
        "Hơn 10 hecta",
        "Chỉ sân trước nhà"
      ],
      correct: 0,
      detail: "Khuôn viên khoảng 3.500–5.000 m² với vườn cây và tiểu cảnh."
    },
    {
      text: "Trước khi vào trong nhà cổ, du khách nên làm gì?",
      answers: [
        "Hỏi gia chủ trước",
        "Tự mở cửa",
        "Chỉ cần mua vé",
        "Chụp ảnh ngay"
      ],
      correct: 0,
      detail: "Nhà cổ là không gian gia đình; hãy hỏi gia chủ trước."
    },
    {
      text: "Làng du lịch sinh thái cộng đồng Thái Lai khai trương khoảng khi nào?",
      answers: [
        "Cuối tháng 5/2022",
        "Năm 2010",
        "Năm 2015",
        "Năm 2024"
      ],
      correct: 0,
      detail: "Khai trương khoảng 29/5/2022."
    },
    {
      text: "Ngoài đường bộ, có thể đến Thái Lai bằng đường nào?",
      answers: [
        "Đường sông",
        "Đường sắt",
        "Cáp treo",
        "Chỉ đường bộ"
      ],
      correct: 0,
      detail: "Có bến thủy nội địa bên sông Túy Loan."
    },
    {
      text: "Trải nghiệm ẩm thực nào hay được nhắc tại Thái Lai?",
      answers: [
        "Xay cối đá, đúc bánh xèo, gói bánh ít",
        "Làm sushi",
        "Pha cocktail",
        "Nướng BBQ kiểu Mỹ"
      ],
      correct: 0,
      detail: "Du khách thích tự tay làm bánh xèo, bánh ít lá gai."
    },
    {
      text: "Loại hình văn nghệ dân gian nào gắn với xứ Quảng tại làng?",
      answers: [
        "Bài chòi",
        "Quan họ",
        "Hát xoan",
        "Cải lương miền Nam"
      ],
      correct: 0,
      detail: "Bài chòi là di sản dân ca đặc trưng xứ Quảng."
    },
    {
      text: "Tại Đỗ Gia Viên có không gian trưng bày gì về nghề nông?",
      answers: [
        "Bảo tàng nông nghiệp mini",
        "Phòng tranh hiện đại",
        "Rạp phim",
        "Siêu thị"
      ],
      correct: 0,
      detail: "Trưng bày hàng trăm nông – ngư cụ truyền thống."
    },
    {
      text: "Tên Thái Lai gắn ước vọng gì?",
      answers: [
        "An bình, mùa màng tốt đẹp",
        "Mở cảng biển",
        "Làm kinh đô",
        "Xây thành lũy"
      ],
      correct: 0,
      detail: "Phản ánh ước vọng an bình, hòa cốc phong đăng."
    },
    {
      text: "Nhà cổ Tích Thiện Đường có tuổi đời khoảng?",
      answers: [
        "Hơn 200 năm",
        "Dưới 50 năm",
        "Khoảng 10 năm",
        "Mới phục dựng 2022"
      ],
      correct: 0,
      detail: "Hơn 200 năm, qua nhiều thế hệ."
    },
    {
      text: "Mái nhà cổ Tích Thiện Đường lợp gì?",
      answers: [
        "Ngói âm dương",
        "Tôn lạnh",
        "Fibro",
        "Lá dừa"
      ],
      correct: 0,
      detail: "Mái ngói âm dương rêu phong cổ kính."
    },
    {
      text: "Thái Lai thuộc khu vực nào của Đà Nẵng?",
      answers: [
        "Hòa Vang – hướng Bà Nà",
        "Hải Châu",
        "Sơn Trà",
        "Hoàng Sa"
      ],
      correct: 0,
      detail: "Thôn Thái Lai, xã Hòa Nhơn, huyện Hòa Vang, hướng Bà Nà."
    },
    {
      text: "Bánh tráng Thái Lai thường được chế biến ra sao?",
      answers: [
        "Nướng giòn (mè)",
        "Luộc",
        "Làm kem",
        "Chiên ngập kiểu Tây"
      ],
      correct: 0,
      detail: "Bánh tráng nướng giòn, dùng kèm trà sen mộc."
    },
    {
      text: "Trong kháng chiến, nhà cổ từng có vai trò gì theo lời kể?",
      answers: [
        "Nuôi giấu cán bộ",
        "Trụ sở Pháp",
        "Kho quân Mỹ",
        "Không liên quan"
      ],
      correct: 0,
      detail: "Từng là nơi nuôi giấu cán bộ cách mạng."
    },
    {
      text: "Điểm tập kết đón đoàn khách thường là?",
      answers: [
        "Nhà văn hóa thôn Thái Lai",
        "Sân bay Đà Nẵng",
        "Cầu Rồng",
        "Cổng Bà Nà Hills"
      ],
      correct: 0,
      detail: "Nhà văn hóa thôn Thái Lai có sân đậu xe."
    },
    {
      text: "Cây ăn quả nào thường thấy trong vườn Thái Lai?",
      answers: [
        "Bưởi, thanh trà, mận, ổi…",
        "Chỉ cao su",
        "Rừng thông",
        "Lúa nước mặn"
      ],
      correct: 0,
      detail: "Nhiều vườn cây ăn quả Nam Bộ và xứ Quảng."
    },
    {
      text: "Ý nghĩa tên Tích Thiện Đường là gì?",
      answers: [
        "Tích đức, làm việc thiện",
        "Tên quan triều Nguyễn",
        "Tên thợ mộc",
        "Tên con sông"
      ],
      correct: 0,
      detail: "Đặt tên để răn dạy con cháu tích đức, làm thiện."
    },
    {
      text: "Khung giờ đón đoàn phổ biến trên web là?",
      answers: [
        "Sáng 09h–10h30 hoặc Chiều 14h30–16h",
        "Chỉ nửa đêm",
        "Cả ngày không cố định",
        "Chỉ sáng sớm 5h"
      ],
      correct: 0,
      detail: "Hai khung giờ giúp làng chuẩn bị đón đoàn."
    },
    {
      text: "Sông chảy qua khu vực làng Thái Lai tên gì?",
      answers: [
        "Túy Loan",
        "Sông Hàn",
        "Sông Cu Đê",
        "Sông Vu Gia"
      ],
      correct: 0,
      detail: "Sông Túy Loan hiền hòa bên làng."
    },
    {
      text: "Khoảng cách từ trung tâm Đà Nẵng đến Thái Lai khoảng?",
      answers: [
        "Khoảng 20 km",
        "Dưới 5 km",
        "Hơn 100 km",
        "Ngay trung tâm thành phố"
      ],
      correct: 0,
      detail: "Khoảng 20 km về hướng Tây / Hòa Vang."
    },
    {
      text: "Đình Thái Lai xây theo lối kiến trúc thời nào?",
      answers: [
        "Triều Nguyễn",
        "Thời Pháp thuộc hoàn toàn",
        "Hiện đại 2000",
        "Thời Trần"
      ],
      correct: 0,
      detail: "Kiến trúc theo quy cách xây dựng thời triều Nguyễn."
    },
    {
      text: "Nhà thờ tộc nào được nhắc tại làng Thái Lai?",
      answers: [
        "Tộc Đỗ (phái nhì)",
        "Tộc Nguyễn toàn quốc",
        "Tộc Trần",
        "Không có nhà thờ tộc"
      ],
      correct: 0,
      detail: "Nhà thờ cổ phái nhì tộc Đỗ có lối kiến trúc độc đáo."
    },
    {
      text: "Món mì đặc trưng xứ Quảng có thể thưởng thức ở Thái Lai?",
      answers: [
        "Mì Quảng",
        "Phở Hà Nội",
        "Bún bò Huế là món duy nhất",
        "Ramen"
      ],
      correct: 0,
      detail: "Mì Quảng và nhiều món dân dã quê."
    },
    {
      text: "Homestay / cắm trại ở Thái Lai có không?",
      answers: [
        "Có, ven sông và homestay hộ dân",
        "Không có chỗ nghỉ",
        "Chỉ khách sạn 5 sao",
        "Chỉ dormitory"
      ],
      correct: 0,
      detail: "Có cắm trại bãi cỏ ven sông và homestay hộ dân."
    },
    {
      text: "Theo tư liệu, làng Thái Lai hình thành cách đây khoảng bao lâu?",
      answers: [
        "Gần 500 năm (thời Lê)",
        "Chỉ 20 năm gần đây",
        "Hơn 1000 năm chắc chắn",
        "Sau năm 1975"
      ],
      correct: 0,
      detail: "Làng hình thành gần 500 năm, tên cũ Bàu Trai."
    },
    {
      text: "Năm Gia Long thứ 10 (1818) gắn với sự kiện gì của làng?",
      answers: [
        "Đổi tên từ Bàu Trai thành Thái Lai",
        "Xây cầu Rồng",
        "Thành lập quận Hải Châu",
        "Khai trương Bà Nà Hills"
      ],
      correct: 0,
      detail: "Năm 1818 làng đổi tên thành Thái Lai."
    },
    {
      text: "Làng từng nhận bao nhiêu sắc phong qua các đời vua (theo tư liệu)?",
      answers: [
        "17 sắc phong",
        "1 sắc phong",
        "Không có sắc phong",
        "100 sắc phong"
      ],
      correct: 0,
      detail: "Qua các đời vua làng được 17 sắc phong."
    },
    {
      text: "Hương ước làng Thái Lai còn lưu (thời Thành Thái) do ai viết?",
      answers: [
        "Cụ Đỗ Văn Oai (Tú Hanh)",
        "Vua Minh Mạng",
        "Thợ Kim Bồng",
        "Không còn hương ước"
      ],
      correct: 0,
      detail: "Bản hương ước 45 điều do cụ Đỗ Văn Oai viết năm 1902."
    },
    {
      text: "Tường nhà cổ Tích Thiện Đường dày khoảng?",
      answers: [
        "Gần nửa mét",
        "Mỏng như tường thạch cao",
        "Hơn 2 mét",
        "Không có tường gạch"
      ],
      correct: 0,
      detail: "Bờ tường dày gần 1/2 mét, mát hè ấm đông."
    },
    {
      text: "Chiều dài × rộng nhà cổ Tích Thiện Đường khoảng?",
      answers: [
        "14 m × 10 m",
        "5 m × 5 m",
        "50 m × 30 m",
        "Không đo được"
      ],
      correct: 0,
      detail: "Chiều dài khoảng 14 m, rộng khoảng 10 m."
    },
    {
      text: "Gỗ dùng nhiều trong nhà cổ Tích Thiện Đường là?",
      answers: [
        "Gỗ mít (và lim, kiền kiền…)",
        "Gỗ thông nhập khẩu",
        "Nhôm kính",
        "Tre nứa toàn bộ"
      ],
      correct: 0,
      detail: "Nhiều cấu kiện gỗ mít, lim, kiền kiền, mun."
    },
    {
      text: "Đỗ Gia Viên có loại nhà nghỉ chân nào?",
      answers: [
        "Nhà lục giác, bát giác",
        "Chỉ ghế nhựa",
        "Lều bạt duy nhất",
        "Phòng karaoke"
      ],
      correct: 0,
      detail: "Có nhà lục giác, bát giác cho khách uống trà, nghỉ."
    },
    {
      text: "Vườn hoa nào từng được nhắc khi viết về Thái Lai?",
      answers: [
        "Hướng dương",
        "Hoa anh đào Nhật",
        "Hoa tulip Hà Lan",
        "Không có hoa"
      ],
      correct: 0,
      detail: "Có vườn hoa hướng dương trong không gian làng sinh thái."
    },
    {
      text: "Đường làng Thái Lai hai bên thường trồng gì?",
      answers: [
        "Chè tàu, dâm bụt…",
        "Cactus sa mạc",
        "Cây dầu khí",
        "Không có cây"
      ],
      correct: 0,
      detail: "Hàng rào chè tàu, dâm bụt tạo khung cảnh làng quê."
    },
    {
      text: "Bảo tàng nông nghiệp mini trưng bày gì?",
      answers: [
        "Nông cụ, ngư cụ truyền thống",
        "Xe hơi cổ",
        "Máy bay",
        "Điện thoại đời đầu"
      ],
      correct: 0,
      detail: "Hàng trăm nông – ngư cụ gắn với đời sống sông nước, đồng ruộng."
    },
    {
      text: "Du khách có thể đạp xe tham quan làng không?",
      answers: [
        "Có",
        "Không bao giờ",
        "Chỉ đi xe tăng",
        "Chỉ đi bộ trong nhà"
      ],
      correct: 0,
      detail: "Có dịch vụ đạp xe tham quan, chụp ảnh lưu niệm."
    },
    {
      text: "Món sắn hông lá dứa thuộc nhóm ẩm thực nào ở Thái Lai?",
      answers: [
        "Món dân dã quê",
        "Món Âu",
        "Đồ hộp công nghiệp",
        "Không có món này"
      ],
      correct: 0,
      detail: "Sắn hông lá dứa là món dân dã được nhắc khi viết về làng."
    },
    {
      text: "Thịt heo cuốn bánh tráng có trong thực đơn quê Thái Lai không?",
      answers: [
        "Có",
        "Không",
        "Chỉ món chay",
        "Chỉ hải sản"
      ],
      correct: 0,
      detail: "Nhiều món quê như thịt heo cuốn bánh tráng, bánh xèo, mít trộn…"
    },
    {
      text: "Làng Thái Lai nằm cách trung tâm Đà Nẵng về hướng nào?",
      answers: [
        "Hướng Tây / Hòa Vang",
        "Hướng biển Sơn Trà",
        "Ngay trung tâm",
        "Hướng Hoàng Sa"
      ],
      correct: 0,
      detail: "Khoảng 20 km về hướng Tây, huyện Hòa Vang."
    },
    {
      text: "Khi đặt tour, tiền cọc phổ biến được thiết kế khoảng?",
      answers: [
        "Khoảng 30% giá tour",
        "100% trả trước bắt buộc",
        "0 đồng",
        "Trả bằng vàng"
      ],
      correct: 0,
      detail: "Cọc khoảng 30% theo từng gói trải nghiệm."
    },
    {
      text: "Hủy tour trước 24 giờ thì chính sách thế nào?",
      answers: [
        "Hoàn 100% cọc hoặc mã bảo lưu 60 ngày",
        "Mất hết cọc",
        "Phạt gấp đôi",
        "Không cho hủy"
      ],
      correct: 0,
      detail: "Hủy trước 24h: hoàn cọc hoặc bảo lưu lịch 60 ngày."
    },
    {
      text: "Hủy sát giờ / vắng mặt thì cọc đi đâu?",
      answers: [
        "Hỗ trợ hộ dân (nguyên liệu đã chuẩn bị)",
        "Hoàn 100%",
        "Chuyển ngân hàng trung ương",
        "Mua vàng"
      ],
      correct: 0,
      detail: "Cọc hỗ trợ hộ dân bù chi phí bột bánh, rau, trà đã chuẩn bị."
    },
    {
      text: "Túi Tote “Thái Lai Ký Tự” đóng góp bao nhiêu % duy tu nhà cổ?",
      answers: [
        "35%",
        "0%",
        "100%",
        "1%"
      ],
      correct: 0,
      detail: "Mỗi túi đóng góp 35% chi phí duy tu nhà cổ và sinh kế nông dân."
    },
    {
      text: "Mã cào mẫu trên túi để kích hoạt Hộ chiếu là?",
      answers: [
        "TL-8921",
        "ABC-000",
        "DN-9999",
        "Không có mã"
      ],
      correct: 0,
      detail: "Mã mẫu TL-8921 dùng để kích hoạt coupon ẩm thực."
    },
    {
      text: "Săn kho báu trên web gồm bao nhiêu câu mỗi vòng?",
      answers: [
        "4 câu",
        "1 câu",
        "100 câu cùng lúc",
        "Không có câu hỏi"
      ],
      correct: 0,
      detail: "Mỗi vòng 4 câu random từ ngân hàng câu hỏi."
    },
    {
      text: "Điểm Sứ giả dùng để làm gì?",
      answers: [
        "Đổi quà nông sản tại làng",
        "Mua vé máy bay",
        "Đóng thuế",
        "Không dùng được"
      ],
      correct: 0,
      detail: "Đổi rau sạch, dầu phộng OCOP, trà sen, voucher ghe…"
    },
    {
      text: "Voucher đi ghe gắn với dòng sông nào?",
      answers: [
        "Sông Túy Loan",
        "Sông Hàn",
        "Sông Amazon",
        "Hồ Tây"
      ],
      correct: 0,
      detail: "Đi ghe ngắm cảnh dọc sông Túy Loan."
    },
    {
      text: "OCOP 3 sao được nhắc trong quà làng là sản phẩm gì?",
      answers: [
        "Dầu đậu phộng",
        "Điện thoại",
        "Xe máy",
        "Áo thun"
      ],
      correct: 0,
      detail: "Chai dầu đậu phộng OCOP 3 sao."
    },
    {
      text: "Trà sen mộc thường thưởng thức ở đâu trong làng?",
      answers: [
        "Tích Thiện Đường / Đỗ Gia Viên",
        "Sân bay",
        "Tầng hầm siêu thị",
        "Trên đỉnh Bà Nà bắt buộc"
      ],
      correct: 0,
      detail: "Uống trà sen mộc tại không gian nhà cổ, vườn."
    },
    {
      text: "Bến Thái Lai nằm ở đâu?",
      answers: [
        "Bên sông Túy Loan",
        "Giữa biển Đông",
        "Trên núi Bà Nà",
        "Trong trung tâm thương mại"
      ],
      correct: 0,
      detail: "Bến thủy nội địa bên sông Túy Loan."
    },
    {
      text: "Làng có thể tham quan bằng đường thủy không?",
      answers: [
        "Có",
        "Không",
        "Chỉ trực thăng",
        "Chỉ tàu hỏa"
      ],
      correct: 0,
      detail: "Có thể đến bằng đường bộ hoặc đường sông."
    },
    {
      text: "Năm 2022 gắn với sự kiện du lịch nào ở Thái Lai?",
      answers: [
        "Khai trương làng du lịch sinh thái cộng đồng",
        "Đóng cửa vĩnh viễn",
        "Xây sân bay mới",
        "Đổi tên thành quận 1"
      ],
      correct: 0,
      detail: "Khai trương làng DL sinh thái cộng đồng cuối tháng 5/2022."
    },
    {
      text: "“Enjoy Danang” gắn với dịp nào của làng?",
      answers: [
        "Chương trình kích cầu du lịch khi khai trương",
        "Lễ hội pháo hoa quốc tế",
        "SEA Games",
        "Không liên quan"
      ],
      correct: 0,
      detail: "Khai trương hưởng ứng “Enjoy Danang – Tận hưởng Đà Nẵng”."
    },
    {
      text: "Nhà cổ có giữ đồ dùng sinh hoạt xưa không?",
      answers: [
        "Có (nồi đồng, tràng kỷ, liễn đối…)",
        "Không, chỉ tường trống",
        "Chỉ TV hiện đại",
        "Chỉ máy lạnh"
      ],
      correct: 0,
      detail: "Còn nồi đồng, bộ tràng kỷ, liễn đối, bàn thờ, tủ gốm sứ…"
    },
    {
      text: "Ai từng được tưởng nhầm là quan lớn trong chuyện xưa làng?",
      answers: [
        "Ông Đỗ Văn Ninh (Thủ Tám)",
        "Một người Pháp",
        "Vua Gia Long",
        "Không có chuyện đó"
      ],
      correct: 0,
      detail: "Ông Thủ Tám dung mạo uy nghi, từng bị nhầm là quan."
    },
    {
      text: "Ông Thủ Tám rước thợ Kim Bồng về làm nhà trong bao lâu?",
      answers: [
        "Ba năm",
        "Một tuần",
        "Một ngày",
        "Hai mươi năm liên tục không nghỉ"
      ],
      correct: 0,
      detail: "Rước thợ Kim Bồng làm nhà trong ba năm, đặt tên Tích Thiện Đường."
    },
    {
      text: "Đình làng từng là nơi làm gì trong kháng chiến?",
      answers: [
        "Tập kết lương thực, che giấu cán bộ",
        "Sòng bạc",
        "Trụ sở địch duy nhất",
        "Không dùng gì"
      ],
      correct: 0,
      detail: "Đình gắn với lịch sử kháng chiến của địa phương."
    },
    {
      text: "Hệ sinh thái làng Thái Lai được mô tả là?",
      answers: [
        "Phong phú, làng quê xứ Quảng",
        "Sa mạc khô",
        "Rừng rậm Amazon",
        "Khu công nghiệp nặng"
      ],
      correct: 0,
      detail: "Hệ sinh thái phong phú, bản sắc làng quê Hòa Vang – xứ Quảng."
    },
    {
      text: "Có vườn trái cây kiểu Nam Bộ trong làng không?",
      answers: [
        "Có",
        "Không",
        "Chỉ cây xương rồng",
        "Chỉ cây thông"
      ],
      correct: 0,
      detail: "Có vườn trái cây Nam Bộ và nhiều vườn kiểu mẫu."
    },
    {
      text: "Đường lát đá trong làng tạo cảm giác gì?",
      answers: [
        "Làng quê mộc mạc, thanh bình",
        "Đường cao tốc",
        "Sân bay",
        "Bãi đỗ xe tải"
      ],
      correct: 0,
      detail: "Đường làng lát đá, hàng rào xanh, khung cảnh thanh bình."
    },
    {
      text: "Khi chụp ảnh trong nhà cổ nên lưu ý gì?",
      answers: [
        "Tôn trọng, hỏi gia chủ",
        "Chụp thoải mái mọi góc",
        "Bắt buộc dùng flash mạnh",
        "Không cần phép"
      ],
      correct: 0,
      detail: "Hỏi trước khi tham quan hoặc chụp ảnh bên trong."
    },
    {
      text: "Gói tour “Về Làng An Yên” thường gồm gì?",
      answers: [
        "Đình, nhà cổ trà bánh, bến phà",
        "Chỉ ngủ khách sạn 5 sao",
        "Chỉ đi cáp treo",
        "Không có hoạt động"
      ],
      correct: 0,
      detail: "Thăm đình, Tích Thiện Đường uống trà, tản bộ bến phà."
    },
    {
      text: "Gói “Nông Dân Thái Lai” thêm trải nghiệm gì?",
      answers: [
        "Xay cối, bánh xèo, bữa trưa vườn",
        "Lặn biển",
        "Nhảy dù",
        "Chơi golf"
      ],
      correct: 0,
      detail: "Thêm trải nghiệm làm bánh và bữa trưa đồng quê."
    },
    {
      text: "Gói trọn ngày có thể gồm nông nghiệp xanh và gì?",
      answers: [
        "Bài chòi, dầu phộng, pin mặt trời / lúa",
        "Sòng bạc",
        "Trung tâm thương mại",
        "Sân vận động"
      ],
      correct: 0,
      detail: "Có thể gồm nông nghiệp xanh, OCOP, bài chòi."
    },
    {
      text: "Pin mặt trời 2 mặt kết hợp lúa hữu cơ gắn với hợp tác nào (theo mô tả tour)?",
      answers: [
        "Hợp tác Hàn Quốc",
        "Hợp tác Sao Hỏa",
        "Không có pin",
        "Chỉ than đá"
      ],
      correct: 0,
      detail: "Mô tả tour có cánh đồng pin mặt trời 2 mặt + lúa hữu cơ."
    },
    {
      text: "CLB Bài chòi trong phân bổ doanh thu tour thuộc phần nào?",
      answers: [
        "Văn nghệ / trải nghiệm dân gian",
        "Xăng xe",
        "Phí sân bay",
        "Thuế xuất khẩu"
      ],
      correct: 0,
      detail: "Một phần doanh thu hỗ trợ CLB bài chòi."
    },
    {
      text: "Nhà văn hóa thôn dùng để làm gì với đoàn khách?",
      answers: [
        "Tập kết, đón đoàn",
        "Chỉ kho chứa rác",
        "Sân bay trực thăng",
        "Siêu thị"
      ],
      correct: 0,
      detail: "Vị trí tập kết đón đoàn, có sân ô tô."
    },
    {
      text: "Trà sen mộc thường kèm gì?",
      answers: [
        "Bánh tráng mè nướng",
        "Pizza",
        "Hamburger",
        "Sushi"
      ],
      correct: 0,
      detail: "Trà sen mộc và bánh tráng mè nướng tại nhà cổ."
    },
    {
      text: "Cối đá dùng để làm gì trong trải nghiệm?",
      answers: [
        "Xay bột gạo ướt làm bánh",
        "Nghiền đá xây dựng",
        "Làm đá lạnh",
        "Không dùng"
      ],
      correct: 0,
      detail: "Tự tay quay cối đá xay bột gạo ướt."
    },
    {
      text: "Bánh ít lá gai gói bằng gì?",
      answers: [
        "Gạo làng / bột gạo",
        "Bột mì Ý",
        "Bột năng lượng",
        "Đất sét"
      ],
      correct: 0,
      detail: "Gói bánh ít lá gai bằng gạo làng."
    },
    {
      text: "Săn kho báu hoàn thành có thể nhận gì?",
      answers: [
        "Voucher ghe hoặc hái trái cây",
        "Vé máy bay quốc tế",
        "Ô tô",
        "Không có gì"
      ],
      correct: 0,
      detail: "Rương Báu: voucher ghe sông Túy Loan hoặc hái trái 45 phút."
    },
    {
      text: "Sứ giả lan tỏa điểm khi nào?",
      answers: [
        "Bạn bè mở link ref hợp lệ",
        "Chỉ khi ngủ",
        "Khi tắt máy",
        "Không bao giờ"
      ],
      correct: 0,
      detail: "Điểm referral khi bạn bè mở link có mã ref."
    },
    {
      text: "Túi Tote có thể nhận ở đâu?",
      answers: [
        "Cổng làng / Nhà văn hóa thôn",
        "Chỉ ở Hà Nội",
        "Chỉ nước ngoài",
        "Không nhận được"
      ],
      correct: 0,
      detail: "Khuyên nhận tại cổng làng; có ship nội thành Đà Nẵng."
    },
    {
      text: "Combo túi + tour An Yên giá mô tả trên web là?",
      answers: [
        "199.000 đ",
        "1 triệu đồng",
        "Miễn phí hoàn toàn",
        "10.000 đ"
      ],
      correct: 0,
      detail: "Combo Túi + Tour An Yên 199.000 đ."
    },
    {
      text: "Giá túi Tote lẻ mô tả trên web là?",
      answers: [
        "149.000 đ",
        "50.000 đ",
        "5 triệu",
        "Miễn phí"
      ],
      correct: 0,
      detail: "Túi lẻ 149.000 đ."
    },
    {
      text: "Ship nội thành Đà Nẵng phụ thu khoảng?",
      answers: [
        "20.000 đ",
        "0 đ bắt buộc",
        "500.000 đ",
        "Không ship"
      ],
      correct: 0,
      detail: "Ship nội thành +20.000 đ."
    },
    {
      text: "Mã vé điện tử thường có dạng?",
      answers: [
        "#TL-xxxx",
        "#HN-xxxx",
        "#SG-xxxx",
        "Không có mã"
      ],
      correct: 0,
      detail: "Mã dạng #TL-xxxx trên thẻ điện tử."
    },
    {
      text: "Sau khi đặt cọc, tin nhắn gửi qua kênh nào?",
      answers: [
        "Zalo OA / SMS",
        "Chỉ chim bồ câu",
        "Chỉ fax",
        "Không thông báo"
      ],
      correct: 0,
      detail: "Hệ thống gửi tin Zalo OA / SMS xác nhận."
    },
    {
      text: "Bác Đỗ Hữu Minh trong tin nhắn gắn với vai trò gì?",
      answers: [
        "Chủ nhà cổ / đón đoàn",
        "Tài xế Grab",
        "Phi công",
        "Không liên quan"
      ],
      correct: 0,
      detail: "Bác Đỗ Hữu Minh và trưởng thôn nhận lịch đón đoàn."
    },
    {
      text: "Lúa hữu cơ trong mô tả tour gắn với?",
      answers: [
        "Nông nghiệp xanh",
        "Khai thác than",
        "Xây chung cư",
        "Nuôi cá biển khơi"
      ],
      correct: 0,
      detail: "Kết hợp pin mặt trời và trồng lúa hữu cơ."
    },
    {
      text: "OCOP là gì trong ngữ cảnh quà làng?",
      answers: [
        "Chương trình sản phẩm địa phương",
        "Tên một con sông",
        "Tên khách sạn",
        "Loại xe bus"
      ],
      correct: 0,
      detail: "Sản phẩm OCOP (mỗi xã một sản phẩm) như dầu đậu phộng."
    },
    {
      text: "Khi đổi quà bằng điểm, mã đổi dạng nào?",
      answers: [
        "QUA-xxxx",
        "XE-xxxx",
        "MAYBAY-xxxx",
        "Không có mã"
      ],
      correct: 0,
      detail: "Mã dạng QUA-xxxx mang đến làng nhận quà."
    },
    {
      text: "Rau sạch đổi điểm lấy ở đâu?",
      answers: [
        "Tại làng Thái Lai",
        "Sân bay quốc tế",
        "Nước ngoài",
        "Siêu thị Hàn Quốc bắt buộc"
      ],
      correct: 0,
      detail: "Mang mã đổi đến Nhà văn hóa thôn / làng nhận."
    },
    {
      text: "Voucher đi ghe cho bao nhiêu người (mô tả quà)?",
      answers: [
        "2 người",
        "100 người",
        "Chỉ 1 trẻ em",
        "Không giới hạn máy bay"
      ],
      correct: 0,
      detail: "Voucher đi ghe 2 người trên sông Túy Loan."
    },
    {
      text: "Set trà sen + bánh mè thưởng thức ở?",
      answers: [
        "Tích Thiện Đường",
        "Tầng hầm để xe",
        "Trên tàu điện ngầm",
        "Ngoài khơi"
      ],
      correct: 0,
      detail: "Uống tại không gian Tích Thiện Đường."
    },
    {
      text: "Điểm tập kết có sân ô tô không?",
      answers: [
        "Có, râm mát",
        "Không có chỗ đậu",
        "Chỉ đậu máy bay",
        "Chỉ xe đạp"
      ],
      correct: 0,
      detail: "Nhà văn hóa thôn có sân ô tô râm mát."
    },
    {
      text: "Làng còn lưu hương ước bao nhiêu điều (thời Thành Thái)?",
      answers: [
        "45 điều",
        "1 điều",
        "1000 điều",
        "Không còn"
      ],
      correct: 0,
      detail: "Hương ước 45 điều còn nguyên vẹn."
    },
    {
      text: "Tên xóm / địa danh cổ trong làng có thể gặp?",
      answers: [
        "Bàu Trai, bàu Séo, gò Ông Siêu…",
        "Times Square",
        "Silicon Valley",
        "Phố Wall"
      ],
      correct: 0,
      detail: "Địa danh phản ánh địa hình đầm gò: bàu Trai, bàu Séo…"
    },
    {
      text: "Nhà cổ mát hè ấm đông nhờ?",
      answers: [
        "Tường dày, mái ngói, kiến trúc xưa",
        "Máy lạnh 24/24 bắt buộc",
        "Sưởi điện",
        "Kính hộp hiện đại"
      ],
      correct: 0,
      detail: "Kiến trúc nhà cổ giúp mát mùa hè, ấm mùa đông."
    },
    {
      text: "Du khách quốc tế / trong nước đến làng bằng cách nào?",
      answers: [
        "Đường bộ và đường sông",
        "Chỉ tàu vũ trụ",
        "Chỉ trực thăng quân sự",
        "Không cho khách"
      ],
      correct: 0,
      detail: "Thuận tiện cả đường bộ lẫn đường sông."
    },
    {
      text: "Mít trộn thuộc nhóm món nào ở Thái Lai?",
      answers: [
        "Ẩm thực dân dã",
        "Món Bắc Âu",
        "Đồ đóng hộp",
        "Không có"
      ],
      correct: 0,
      detail: "Mít trộn và nhiều món quê được phụ nữ làng chế biến."
    },
    {
      text: "Bánh bột lọc / bánh đúc có trong thực đơn quê không?",
      answers: [
        "Có",
        "Không",
        "Chỉ bánh ngọt Pháp",
        "Chỉ kem Ý"
      ],
      correct: 0,
      detail: "Nhiều bánh quê: bột lọc, đúc, tro, gói, ít…"
    },
    {
      text: "Khi nào nên đặt tour trước?",
      answers: [
        "Trước để làng chuẩn bị suất",
        "Không cần đặt",
        "Sau khi về nhà",
        "Chỉ đặt sau 10 năm"
      ],
      correct: 0,
      detail: "Đặt trước giúp bác chủ nhà cổ và hộ làm bánh chuẩn bị."
    },
    {
      text: "Gói tour có ghi rõ phân bổ doanh thu không?",
      answers: [
        "Có (nhà cổ, hộ làm bánh, thôn…)",
        "Không công khai",
        "Chỉ một dòng tổng",
        "Không có giá"
      ],
      correct: 0,
      detail: "Bảng tour ghi phân bổ cho nhà cổ, hộ dân, quản lý thôn…"
    }
  ];

  const QUESTIONS_PER_ROUND = 4;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickRound() {
    const pool = shuffle(questionBank);
    return pool.slice(0, QUESTIONS_PER_ROUND).map((q) => {
      const order = shuffle(q.answers.map((_, i) => i));
      const answers = order.map((i) => q.answers[i]);
      const correct = order.indexOf(q.correct);
      return { text: q.text, answers, correct, detail: q.detail };
    });
  }

  let questions = pickRound();
  let index = 0;
  let score = 0;
  let answered = false;
  let best = 0;

  try {
    const saved = Number(localStorage.getItem(storageKey));
    if (Number.isInteger(saved) && saved >= 0) best = saved;
  } catch {}

  function showPrizes() {
    if (!prizes) return;
    prizes.hidden = best < 3;
    prizes.querySelectorAll("[data-prize-score]").forEach((link) => {
      link.hidden = best < Number(link.dataset.prizeScore);
    });
  }

  function addAmbassadorPoints(pts) {
    try {
      let current = Number(localStorage.getItem(pointsKey) || 0);
      current += pts;
      localStorage.setItem(pointsKey, String(current));
      document.querySelectorAll("[data-su-gia-points]").forEach((el) => {
        el.textContent = current;
      });
    } catch {}
  }

  function showQuestion() {
    const question = questions[index];
    answered = false;
    progress.textContent = "Câu " + (index + 1) + " / " + questions.length;
    meter.value = index + 1;
    meter.max = questions.length;
    questionText.textContent = question.text;
    feedback.textContent = "";
    next.hidden = true;
    next.firstChild.textContent = index === questions.length - 1 ? "Xem kết quả " : "Tiếp theo ";
    options.replaceChildren(...question.answers.map((answer, optionIndex) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.type = "button";
      button.textContent = answer;
      button.addEventListener("click", () => checkAnswer(optionIndex));
      return button;
    }));
    questionText.focus({ preventScroll: true });
  }

  function checkAnswer(choice) {
    if (answered) return;
    answered = true;
    const question = questions[index];
    const correct = choice === question.correct;
    if (correct) score += 1;
    [...options.children].forEach((button, option) => {
      button.setAttribute("aria-disabled", "true");
      button.tabIndex = -1;
      if (option === question.correct || option === choice) {
        const badge = document.createElement("small");
        badge.textContent = option === question.correct ? "Đáp án đúng" : "Bạn đã chọn";
        button.dataset.state = option === question.correct ? "correct" : "incorrect";
        button.append(badge);
      }
    });
    feedback.textContent = (correct ? "Đúng rồi. " : "Chưa đúng. ") + question.detail;
    next.hidden = false;
  }

  function begin() {
    questions = pickRound();
    index = 0;
    score = 0;
    start.hidden = true;
    result.hidden = true;
    play.hidden = false;
    showQuestion();
  }

  function finish() {
    if (score > best) {
      best = score;
      try { localStorage.setItem(storageKey, String(best)); } catch {}
    }
    play.hidden = true;
    result.hidden = false;
    get("[data-quiz-score]").textContent = score + " / " + questions.length + " câu đúng";

    if (score === questions.length) {
      resultTitle.textContent = "Bạn đã mở Rương Báu Thái Lai!";
      resultCopy.textContent = "Chúc mừng! Bạn nhận voucher đi ghe ngắm cảnh sông Túy Loan hoặc hái trái cây trong làng (45 phút). Mã: TL-BAU-" + Date.now().toString().slice(-4) + ".";
      addAmbassadorPoints(20);
    } else if (score >= 3) {
      resultTitle.textContent = "Bạn đã mở quà!";
      resultCopy.textContent = "Bưu thiếp đã sẵn sàng. Trả lời đúng cả bốn câu để mở Rương Báu đầy đủ.";
      addAmbassadorPoints(10);
    } else {
      resultTitle.textContent = "Thử thêm một vòng nhé";
      resultCopy.textContent = "Mỗi lần chơi lại sẽ có bộ câu hỏi khác trong ngân hàng 100 câu. Đúng từ 3 câu trở lên để mở quà.";
    }
    showPrizes();
    resultTitle.focus({ preventScroll: true });
  }

  if (meter) meter.max = QUESTIONS_PER_ROUND;
  if (startButton) {
    startButton.hidden = false;
    startButton.addEventListener("click", begin);
  }
  get("[data-quiz-retry]")?.addEventListener("click", begin);
  next?.addEventListener("click", () => {
    if (!answered) return;
    if (index === questions.length - 1) finish();
    else {
      index += 1;
      showQuestion();
    }
  });
  showPrizes();
})();

(() => {
  const dialog = document.querySelector("#share-dialog");
  if (!dialog || !dialog.showModal) return;
  const input = dialog.querySelector("input");
  const notice = dialog.querySelector("[data-share-access]");
  const description = dialog.querySelector("[data-share-description]");
  const status = dialog.querySelector(".share-status");
  const native = dialog.querySelector("[data-native-share]");
  const canonical = document.querySelector('link[rel="canonical"]')?.href || location.href;
  const triggers = document.querySelectorAll("[data-open-share]");
  let opener;
  let sharingQuiz = false;
  let shareRevision = 0;
  if (native) native.hidden = typeof navigator.share !== "function";
  if (notice) notice.hidden = document.documentElement.dataset.siteAccess !== "private";

  triggers.forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      opener = button;
      sharingQuiz = Boolean(button.closest("#do-vui"));
      const url = new URL(canonical);
      if (sharingQuiz) url.hash = "do-vui";
      if (input) input.value = url.href;
      if (description) description.textContent = sharingQuiz ? "Gửi đường dẫn săn kho báu Thái Lai cho bạn bè." : "Gửi cẩm nang Thái Lai cho bạn bè.";
      if (status) status.textContent = "";
      shareRevision += 1;
      dialog.showModal();
    });
  });

  dialog.querySelector("[data-copy-link]")?.addEventListener("click", async () => {
    const attempt = shareRevision;
    try {
      await navigator.clipboard.writeText(input.value);
      if (attempt === shareRevision && status) status.textContent = "Đã sao chép liên kết.";
    } catch {
      if (!dialog.open || attempt !== shareRevision) return;
      input.focus();
      input.select();
      let copied = false;
      try { copied = document.execCommand("copy"); } catch {}
      if (status) status.textContent = copied ? "Đã sao chép liên kết." : "Liên kết đã được chọn.";
    }
  });

  native?.addEventListener("click", async () => {
    const attempt = shareRevision;
    if (status) status.textContent = "";
    try {
      await navigator.share({
        title: sharingQuiz ? "Săn kho báu làng Thái Lai" : "Làng Thái Lai",
        text: sharingQuiz ? "Thử sức với câu hỏi về làng Thái Lai." : "Cùng khám phá làng Thái Lai bên dòng Túy Loan.",
        url: input.value
      });
    } catch (error) {
      if (error.name !== "AbortError" && attempt === shareRevision && status)
        status.textContent = "Bạn có thể sao chép liên kết.";
    }
  });

  dialog.querySelector("[data-close-share]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => {
    shareRevision += 1;
    opener?.focus({ preventScroll: true });
  });
})();
