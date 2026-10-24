/**
 * ==============================================================================
 * TechGear Store - Quản Lý Dữ Liệu & Đổ Sản Phẩm Bằng JS Thuần (js/products.js)
 * Môn học: WEB1044 - Lập trình JavaScript cơ bản (FPT Polytechnic)
 * ==============================================================================
 * ĐÁP ỨNG TIÊU CHÍ CỐT LÕI:
 * - LAB 5: Trang chi tiết sản phẩm hiển thị đa dạng các Session dữ liệu:
 *          1. Chi tiết sản phẩm chính & Gallery đổi ảnh
 *          2. Khối Ưu Đãi Đặc Quyền (Khuyến mãi đi kèm)
 *          3. Tabs chuyển đổi nội dung: Đặc điểm nổi bật, Bảng thông số, Đánh giá, Bảo hành
 *          4. Sản phẩm cùng loại (Related Products)
 *          5. Sản phẩm đã xem gần đây (Recently Viewed - dùng localStorage)
 * - LAB 6: Xử lý sự kiện (click chuyển tab, click chọn sao, submit form đánh giá, ...)
 * - LAB 7: Tương tác với localStorage (Recently Viewed, Reviews, Giỏ hàng)
 */

// 1. MẢNG DỮ LIỆU SẢN PHẨM (ARRAY OF OBJECTS) ĐẦY ĐỦ THÔNG SỐ VÀ DỮ LIỆU ĐA DẠNG
const danhSachSanPham = [
  {
    id: 1,
    ten: "iPhone 15 Pro Max 256GB Titan Tự Nhiên",
    danhMuc: "Điện Thoại",
    thuongHieu: "Apple",
    gia: 29990000,
    giaCu: 34990000,
    giamGia: "-15%",
    badgeClass: "",
    sao: 5,
    danhGia: 128,
    hinhAnh: "images/products/iphone15.jpg",
    moTa: "Khung viền Titan siêu nhẹ và bền bỉ, chip A17 Pro mạnh mẽ hàng đầu thế giới.",
    thongSo: {
      "Màn hình": "6.7 inch Super Retina XDR OLED (120Hz ProMotion)",
      "Chip xử lý": "Apple A17 Pro (3nm), GPU 6 lõi đẳng cấp console",
      "RAM / Bộ nhớ": "8GB RAM / 256 GB NVMe",
      "Camera sau": "48MP (Chính) + 12MP (Góc siêu rộng) + 12MP (Tele 5x)",
      "Camera trước": "12MP TrueDepth FaceTime HD",
      "Pin & Sạc": "4.422 mAh, Sạc nhanh 20W, MagSafe 15W",
      "Chất liệu & Cổng": "Khung Titanium hàng không vũ trụ, Cổng USB-C 10Gbps"
    },
    dacDiemNoiBat: [
      "Khung viền Titan chuẩn hàng không vũ trụ siêu nhẹ, bền bỉ và sang trọng bậc nhất.",
      "Chip Apple A17 Pro tiến trình 3nm mang lại đồ họa Ray Tracing đỉnh cao.",
      "Camera tiềm vọng 5x zoom quang học sắc nét vượt trội ở mọi cự ly.",
      "Cổng sạc Type-C tốc độ cao hỗ trợ truyền tải dữ liệu và xuất video 4K."
    ],
    uuDai: [
      "Tặng củ sạc nhanh 20W chính hãng trị giá 490.000đ.",
      "Giảm thêm 500.000đ khi thanh toán qua thẻ sinh viên FPT Poly.",
      "Gói bảo hành VIP 1 đổi 1 trong 12 tháng tại hệ thống Showroom TechGear.",
      "Miễn phí giao hàng hỏa tốc trong 2 giờ nội thành."
    ],
    danhGiaList: [
      { ten: "Nguyễn Văn Hùng", ngay: "18/10/2026", sao: 5, noiDung: "Màu Titan tự nhiên quá đẹp! Máy nhẹ hơn hẳn đời trước, dùng rất êm tay." },
      { ten: "Trần Mai Anh", ngay: "14/10/2026", sao: 5, noiDung: "Giao hàng siêu nhanh trong 1 giờ, đóng hộp cẩn thận, nhân viên tư vấn nhiệt tình." }
    ],
    thumbnails: [
      "images/products/iphone15.jpg",
      "images/products/detail-thumb1.jpg",
      "images/products/detail-thumb2.jpg",
      "images/products/detail-thumb3.jpg",
      "images/products/detail-thumb4.jpg"
    ]
  },
  {
    id: 2,
    ten: "MacBook Pro 14 inch M3 (8GB / 512GB SSD)",
    danhMuc: "Laptop",
    thuongHieu: "Apple",
    gia: 39490000,
    giaCu: 41990000,
    giamGia: "MỚI",
    badgeClass: "product-card__badge--new",
    sao: 5,
    danhGia: 95,
    hinhAnh: "images/products/macbook-m3.jpg",
    moTa: "Màn hình Liquid Retina XDR rực rỡ, pin bền bỉ đến 22 tiếng liên tục.",
    thongSo: {
      "Màn hình": "14.2 inch Liquid Retina XDR (3024 x 1964), 120Hz",
      "Chip xử lý": "Apple M3 (8-core CPU, 10-core GPU)",
      "RAM / Bộ nhớ": "8GB Unified Memory / 512GB SSD",
      "Pin & Sạc": "Thời lượng pin tới 22 giờ, sạc 70W USB-C",
      "Cổng kết nối": "3x Thunderbolt 4, HDMI, Đầu đọc thẻ SDXC, MagSafe 3",
      "Trọng lượng": "1.55 kg nhôm nguyên khối"
    },
    dacDiemNoiBat: [
      "Chip Apple M3 với kiến trúc GPU thế hệ mới hỗ trợ Dynamic Caching.",
      "Thời lượng pin lên đến 22 giờ làm việc liên tục mà không cần sạc.",
      "Màn hình Liquid Retina XDR độ sáng tối đa 1600 nits đỉnh cao thị giác."
    ],
    uuDai: [
      "Tặng balo chống sốc cao cấp TechGear Pro trị giá 650.000đ.",
      "Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng.",
      "Cài đặt phần mềm lập trình và văn phòng miễn phí trọn đời."
    ],
    danhGiaList: [
      { ten: "Hoàng Minh Tuấn", ngay: "16/10/2026", sao: 5, noiDung: "Máy mát, code web và xử lý đồ họa cực kỳ mượt mà, pin dùng cả ngày không hết." }
    ],
    thumbnails: [
      "images/products/macbook-m3.jpg",
      "images/products/detail-thumb1.jpg",
      "images/products/detail-thumb2.jpg",
      "images/products/detail-thumb3.jpg"
    ]
  },
  {
    id: 3,
    ten: "Tai nghe Apple AirPods Pro 2 Type-C MagSafe",
    danhMuc: "Tai Nghe",
    thuongHieu: "Apple",
    gia: 5490000,
    giaCu: 6890000,
    giamGia: "-20%",
    badgeClass: "",
    sao: 5,
    danhGia: 210,
    hinhAnh: "images/products/airpods-pro.jpg",
    moTa: "Chống ồn chủ động gấp 2 lần, chất âm không gian sống động vượt trội.",
    thongSo: {
      "Chip xử lý": "Apple H2 cho tai nghe, chip U1 trong hộp sạc",
      "Công nghệ âm thanh": "Chống ồn chủ động (ANC), Xuyên âm thích ứng, Âm thanh không gian",
      "Thời lượng pin": "6 giờ (tai nghe), 30 giờ (kèm hộp sạc)",
      "Cổng sạc": "USB-C, Hỗ trợ sạc không dây MagSafe và Apple Watch",
      "Kháng nước": "Chuẩn IP54 chống mồ hôi và bụi bẩn"
    },
    dacDiemNoiBat: [
      "Khả năng khử tiếng ồn gấp 2 lần so với thế hệ trước.",
      "Âm thanh thích ứng tự động điều chỉnh âm lượng theo môi trường.",
      "Hộp sạc mới tích hợp loa phát âm thanh định vị tìm kiếm qua Find My."
    ],
    uuDai: [
      "Tặng case bảo vệ silicon thời trang trị giá 150.000đ.",
      "Bảo hành 1 đổi 1 trong vòng 1 năm chính hãng Apple."
    ],
    danhGiaList: [
      { ten: "Đỗ Hải Long", ngay: "19/10/2026", sao: 5, noiDung: "Chống ồn cực tốt khi đi xe bus hoặc ngồi quán cafe đông đúc. Rất hài lòng!" }
    ],
    thumbnails: [
      "images/products/airpods-pro.jpg",
      "images/products/detail-thumb1.jpg",
      "images/products/detail-thumb2.jpg"
    ]
  },
  {
    id: 4,
    ten: "Apple Watch Series 9 GPS 41mm Viền Nhôm",
    danhMuc: "Đồng Hồ",
    thuongHieu: "Apple",
    gia: 8990000,
    giaCu: 10490000,
    giamGia: "-10%",
    badgeClass: "",
    sao: 4,
    danhGia: 64,
    hinhAnh: "images/products/apple-watch.jpg",
    moTa: "Cảm biến chạm hai lần thông minh, màn hình sáng gấp đôi thế hệ trước.",
    thongSo: {
      "Màn hình": "OLED Always-On Retina, độ sáng lên đến 2000 nits",
      "Chip xử lý": "Apple S9 SiP lõi kép mạnh mẽ",
      "Cảm biến": "Đo nhịp tim quang học, ECG, Đo nồng độ oxy trong máu SpO2, Đo nhiệt độ",
      "Thời lượng pin": "18 giờ sử dụng tiêu chuẩn, 36 giờ chế độ tiết kiệm pin",
      "Kết nối": "GPS, Wi-Fi, Bluetooth 5.3"
    },
    dacDiemNoiBat: [
      "Thao tác Chạm Hai Lần (Double Tap) điều khiển không cần chạm vào màn hình.",
      "Màn hình siêu sáng 2000 nits hiển thị rõ nét dưới trời nắng gắt."
    ],
    uuDai: [
      "Tặng dây đeo thể thao Sport Band cao cấp tùy chọn màu sắc.",
      "Dán cường lực bảo vệ mặt đồng hồ miễn phí 1 năm."
    ],
    danhGiaList: [
      { ten: "Vũ Phương Thảo", ngay: "10/10/2026", sao: 5, noiDung: "Đồng hồ nhẹ, màu hồng rất nữ tính, tính năng chạm ngón tay rất tiện!" }
    ],
    thumbnails: [
      "images/products/apple-watch.jpg",
      "images/products/detail-thumb1.jpg",
      "images/products/detail-thumb2.jpg"
    ]
  },
  {
    id: 5,
    ten: "Bàn Phím Cơ AKKO 3098B Plus Wireless",
    danhMuc: "Bàn Phím",
    thuongHieu: "AKKO",
    gia: 1950000,
    giaCu: 2600000,
    giamGia: "-25%",
    badgeClass: "",
    sao: 5,
    danhGia: 88,
    hinhAnh: "images/products/keyboard.jpg",
    moTa: "Kết nối đa chế độ Bluetooth/2.4Ghz/Type-C, switch gõ siêu êm ái.",
    thongSo: {
      "Layout": "98 phím (96% đầy đủ cụm số tiện lợi)",
      "Switch": "AKKO CS V3 Piano Switch (Linear mượt, âm đầm)",
      "Kết nối": "3 Mode: Bluetooth 5.0 / Wireless 2.4GHz / Cáp Type-C",
      "Keycap": "PBT Double-Shot siêu bền không bóng mờ",
      "Pin": "3000 mAh dùng liên tục hơn 150 giờ"
    },
    dacDiemNoiBat: [
      "Mạch Hotswap 5 pin thay switch nhanh chóng không cần hàn chì.",
      "Lót sẵn foam tiêu âm PCB và đáy cho cảm giác gõ trầm ấm và êm tai."
    ],
    uuDai: [
      "Tặng kê tay công thái học bằng gỗ trị giá 250.000đ.",
      "Bảo hành chính hãng 24 tháng đổi mới."
    ],
    danhGiaList: [
      { ten: "Lê Gia Bảo", ngay: "17/10/2026", sao: 5, noiDung: "Gõ code cực sướng, âm thanh êm không làm phiền người xung quanh." }
    ],
    thumbnails: [
      "images/products/keyboard.jpg",
      "images/products/detail-thumb1.jpg",
      "images/products/detail-thumb3.jpg"
    ]
  },
  {
    id: 6,
    ten: "Tai nghe chống ồn Sony WH-1000XM5 Hi-Res",
    danhMuc: "Âm Thanh",
    thuongHieu: "Sony",
    gia: 6990000,
    giaCu: 8490000,
    giamGia: "-18%",
    badgeClass: "",
    sao: 5,
    danhGia: 156,
    hinhAnh: "images/products/sony-xm5.jpg",
    moTa: "Công nghệ chống ồn hàng đầu thế giới với 2 bộ xử lý âm thanh độc quyền.",
    thongSo: {
      "Driver": "30mm màng loa sợi carbon tổng hợp cao cấp",
      "Chống ồn": "Tích hợp 8 micro và 2 bộ xử lý khử ồn V1 & QN1",
      "Codec hỗ trợ": "LDAC, AAC, SBC - Đạt chuẩn Hi-Res Audio Wireless",
      "Thời lượng pin": "30 giờ (bật ANC), sạc nhanh 3 phút nghe được 3 giờ",
      "Trọng lượng": "250g siêu nhẹ, đệm tai da êm mềm không gây cấn"
    },
    dacDiemNoiBat: [
      "Chất lượng đàm thoại trong trẻo với thuật toán lọc gió khử ồn AI.",
      "Tính năng Speak-to-Chat tự động dừng nhạc khi bạn cất lời nói."
    ],
    uuDai: [
      "Tặng giá treo tai nghe bằng nhôm sang trọng trị giá 300.000đ.",
      "Bảo hành 12 tháng chính hãng Sony Việt Nam."
    ],
    danhGiaList: [
      { ten: "Phạm Quốc Huy", ngay: "09/10/2026", sao: 5, noiDung: "Khử ồn bá đạo nhất hiện nay. Đeo cả ngày làm việc không hề bị đau tai." }
    ],
    thumbnails: [
      "images/products/sony-xm5.jpg",
      "images/products/detail-thumb1.jpg",
      "images/products/detail-thumb2.jpg"
    ]
  },
  {
    id: 7,
    ten: "Chuột không dây Logitech G Pro X Superlight 2",
    danhMuc: "Chuột Gaming",
    thuongHieu: "Logitech",
    gia: 2890000,
    giaCu: 3290000,
    giamGia: "-12%",
    badgeClass: "",
    sao: 4,
    danhGia: 72,
    hinhAnh: "images/products/mouse-gaming.jpg",
    moTa: "Trọng lượng siêu nhẹ chỉ 60g, cảm biến HERO 2 độ chính xác chuẩn eSports.",
    thongSo: {
      "Trọng lượng": "Khoảng 60 gram siêu nhẹ",
      "Cảm biến": "HERO 2 thế hệ mới, độ phân giải lên đến 32.000 DPI",
      "Polling rate": "Tần số phản hồi 2000Hz qua công nghệ LIGHTSPEED",
      "Switch": "Switch lai quang - cơ học LIGHTFORCE siêu nhạy và bền bỉ",
      "Pin": "Sử dụng liên tục lên đến 95 giờ"
    },
    dacDiemNoiBat: [
      "Thiết kế công thái học đối xứng tối ưu cho mọi kiểu cầm chuột.",
      "Chân feet PTFE nguyên chất 100% lướt êm ái trên mọi mặt lót chuột."
    ],
    uuDai: [
      "Tặng lót chuột gaming khổ lớn TechGear Speed trị giá 200.000đ."
    ],
    danhGiaList: [
      { ten: "Bùi Tiến Dũng", ngay: "11/10/2026", sao: 5, noiDung: "Chuột siêu nhẹ, vẩy tâm trong game FPS cực kỳ chuẩn xác!" }
    ],
    thumbnails: [
      "images/products/mouse-gaming.jpg",
      "images/products/detail-thumb1.jpg",
      "images/products/detail-thumb2.jpg"
    ]
  },
  {
    id: 8,
    ten: "iPad Pro 11 inch M2 WiFi 128GB Space Gray",
    danhMuc: "Máy Tính Bảng",
    thuongHieu: "Apple",
    gia: 19990000,
    giaCu: 22490000,
    giamGia: "HOT",
    badgeClass: "product-card__badge--new",
    sao: 5,
    danhGia: 94,
    hinhAnh: "images/products/ipad-pro.jpg",
    moTa: "Sức mạnh vi xử lý Apple M2, hỗ trợ bút Apple Pencil lướt không chạm.",
    thongSo: {
      "Màn hình": "11 inch Liquid Retina (2388 x 1668), 120Hz ProMotion, True Tone",
      "Chip xử lý": "Apple M2 (8-core CPU, 10-core GPU)",
      "RAM / Bộ nhớ": "8GB RAM / 128GB dung lượng lưu trữ",
      "Camera": "12MP Wide + 10MP Ultra Wide + Cảm biến LiDAR scanner",
      "Kết nối": "Wi-Fi 6E, Bluetooth 5.3, Cổng Thunderbolt / USB 4"
    },
    dacDiemNoiBat: [
      "Sức mạnh đồ họa đỉnh cao từ chip Apple M2 hỗ trợ dựng video 4K mượt mà.",
      "Tính năng Apple Pencil Hover nhận diện bút khi cách màn hình 12mm."
    ],
    uuDai: [
      "Tặng bao da gập thông minh trị giá 450.000đ.",
      "Giảm 10% khi mua kèm bút Apple Pencil 2."
    ],
    danhGiaList: [
      { ten: "Trịnh Thùy Linh", ngay: "13/10/2026", sao: 5, noiDung: "Màn hình 120Hz siêu mượt, vẽ minh họa và ghi chép học tập cực thích." }
    ],
    thumbnails: [
      "images/products/ipad-pro.jpg",
      "images/products/detail-thumb1.jpg",
      "images/products/detail-thumb2.jpg",
      "images/products/detail-thumb3.jpg"
    ]
  },
  {
    id: 9,
    ten: "Samsung Galaxy S24 Ultra 5G 256GB Titan",
    danhMuc: "Điện Thoại",
    thuongHieu: "Samsung",
    gia: 27990000,
    giaCu: 31990000,
    giamGia: "-12%",
    badgeClass: "product-card__badge--new",
    sao: 5,
    danhGia: 86,
    hinhAnh: "images/products/samsung-s24.jpg",
    moTa: "Trí tuệ nhân tạo Galaxy AI đỉnh cao, khung viền Titan và bút S-Pen tích hợp.",
    thongSo: {
      "Màn hình": "6.8 inch Dynamic AMOLED 2X (120Hz, 2600 nits)",
      "Chip xử lý": "Snapdragon 8 Gen 3 for Galaxy (4nm)",
      "RAM / Bộ nhớ": "12GB RAM / 256GB UFS 4.0",
      "Camera sau": "200MP (Chính) + 50MP (Tele 5x) + 12MP (Góc rộng) + 10MP (Tele 3x)",
      "Camera trước": "12MP Dual Pixel PDAF",
      "Pin & Sạc": "5.000 mAh, Sạc siêu nhanh 45W",
      "Tính năng đặc biệt": "Tích hợp bút S-Pen, Trợ lý AI dịch thuật thời gian thực"
    },
    dacDiemNoiBat: [
      "Khung viền Titanium chuẩn tàu vũ trụ bền bỉ và kính Corning Gorilla Armor chống chói.",
      "Công nghệ Galaxy AI: Khoanh tròn để tìm kiếm, Trợ lý chat thông minh, Dịch trực tiếp cuộc gọi.",
      "Camera 200MP tái hiện chi tiết sắc nét và khả năng chụp đêm Nightography ấn tượng."
    ],
    uuDai: [
      "Tặng củ sạc siêu nhanh 45W trị giá 690.000đ.",
      "Tặng gói bảo hành Samsung Care+ 1 năm rơi vỡ vào nước.",
      "Thu cũ đổi mới trợ giá đến 3.000.000đ."
    ],
    danhGiaList: [
      { ten: "Lê Hoàng Nam", ngay: "20/10/2026", sao: 5, noiDung: "Màn hình phẳng chống chói tuyệt vời, dùng dưới trời nắng gắt cực rõ. Bút S-Pen tiện lợi." }
    ],
    thumbnails: [
      "images/products/samsung-s24.jpg",
      "images/products/detail-thumb1.jpg",
      "images/products/detail-thumb2.jpg"
    ]
  }
];

// 2. HÀM ĐỊNH DẠNG TIỀN TỆ (VNĐ)
function dinhDangTien(soTien) {
  if (!soTien && soTien !== 0) return "0đ";
  return soTien.toLocaleString("vi-VN") + "đ";
}

// 3. HÀM TẠO CÁC BIỂU TƯỢNG SAO ĐÁNH GIÁ (LAB 5 UI)
function taoSao(soSao) {
  let chuoiSao = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= soSao) {
      chuoiSao += '<i class="fa-solid fa-star"></i>';
    } else {
      chuoiSao += '<i class="fa-regular fa-star"></i>';
    }
  }
  return chuoiSao;
}

// 4. HÀM ĐỔ DANH SÁCH SẢN PHẨM RA MÀN HÌNH HTML (Duyệt mảng forEach)
function doDuLieuSanPham(danhSach, idKhuVuc) {
  const khuVucHienThi = document.getElementById(idKhuVuc);
  if (!khuVucHienThi) return;

  // Xử lý khi danh sách lọc rỗng (0 sản phẩm thỏa mãn)
  if (!danhSach || danhSach.length === 0) {
    if (idKhuVuc === 'danhSachSanPhamShop') {
      khuVucHienThi.innerHTML = `
        <div class="empty-filter-state" style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color); box-shadow: var(--shadow-sm); margin: 10px 0;">
          <div style="font-size: 3rem; color: var(--text-muted); margin-bottom: 12px;">
            <i class="fa-solid fa-filter-circle-xmark"></i>
          </div>
          <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; color: var(--text-main);">
            Không tìm thấy sản phẩm nào
          </h3>
          <p style="color: var(--text-muted); max-width: 440px; margin: 0 auto 20px; font-size: 0.92rem; line-height: 1.5;">
            Không có sản phẩm nào thỏa mãn các tiêu chí lọc hiện tại. Hãy thử thay đổi bộ lọc hoặc bấm nút bên dưới.
          </p>
          <button type="button" class="btn btn-primary" onclick="window.resetShopFilters && window.resetShopFilters()">
            <i class="fa-solid fa-rotate-left"></i> Đặt Lại Tất Cả Bộ Lọc
          </button>
        </div>
      `;
    } else {
      khuVucHienThi.innerHTML = '<p class="text-muted" style="text-align: center; grid-column: 1 / -1; padding: 20px;">Chưa có sản phẩm nào để hiển thị.</p>';
    }
    return;
  }

  let noiDungHTML = "";

  danhSach.forEach(function (sp) {
    noiDungHTML += `
      <article class="product-card">
        ${sp.giamGia ? `<span class="product-card__badge ${sp.badgeClass}">${sp.giamGia}</span>` : ""}
        <div class="product-card__thumb">
          <a href="detail.html?id=${sp.id}" onclick="luuSanPhamVaoSession(${sp.id})">
            <img src="${sp.hinhAnh}" alt="${sp.ten}" class="product-card__img">
          </a>
        </div>
        <div class="product-card__content">
          <span class="product-card__category">${sp.danhMuc}</span>
          <h3 class="product-card__title">
            <a href="detail.html?id=${sp.id}" onclick="luuSanPhamVaoSession(${sp.id})">${sp.ten}</a>
          </h3>
          <div class="product-card__rating">
            <div class="rating-stars">
              ${taoSao(sp.sao)}
            </div>
            <span class="rating-count">(${sp.danhGia} đánh giá)</span>
          </div>
          <div class="product-card__price-row">
            <span class="price-current">${dinhDangTien(sp.gia)}</span>
            ${sp.giaCu ? `<span class="price-old">${dinhDangTien(sp.giaCu)}</span>` : ""}
          </div>
          <div class="product-card__actions">
            <!-- LAB 6: Sự kiện click gọi hàm thêm giỏ hàng localStorage (LAB 7) -->
            <button type="button" class="btn-add-cart" onclick="themNhanhVaoGio(${sp.id})">
              <i class="fa-solid fa-cart-plus"></i> Thêm giỏ
            </button>
            <a href="detail.html?id=${sp.id}" onclick="luuSanPhamVaoSession(${sp.id})" class="btn-quick-view" title="Xem chi tiết" aria-label="Xem chi tiết ${sp.ten}">
              <i class="fa-solid fa-eye"></i>
            </a>
          </div>
        </div>
      </article>
    `;
  });

  khuVucHienThi.innerHTML = noiDungHTML;

  // Tự động làm mới liên kết nội bộ đồng bộ dữ liệu cho file:/// (storage.js)
  if (window.TechGearStorage && typeof window.TechGearStorage.refreshInternalLinks === 'function') {
    try {
      window.TechGearStorage.refreshInternalLinks();
    } catch (e) {}
  }
}

/**
 * LAB 5 & LAB 7: Lưu thông tin sản phẩm vào sessionStorage khi người dùng chọn xem
 * @param {number} idSanPham
 */
function luuSanPhamVaoSession(idSanPham) {
  const sp = danhSachSanPham.find(item => item.id === idSanPham);
  if (!sp) return;

  try {
    // 1. Lưu đối tượng sản phẩm và ID vào sessionStorage
    sessionStorage.setItem('techgear_detail_product', JSON.stringify(sp));
    sessionStorage.setItem('techgear_detail_product_id', String(sp.id));

    // 2. Ghi nhận thời điểm bắt đầu phiên xem sản phẩm
    if (!sessionStorage.getItem('techgear_session_view_time_' + sp.id)) {
      sessionStorage.setItem(
        'techgear_session_view_time_' + sp.id,
        new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }

    // 3. Đếm số lần xem sản phẩm này trong phiên làm việc hiện tại
    const viewKey = 'techgear_session_views_' + sp.id;
    const views = parseInt(sessionStorage.getItem(viewKey) || '0', 10) + 1;
    sessionStorage.setItem(viewKey, String(views));

    // 4. Nếu có TechGearStorage, đồng bộ phụ trợ cho môi trường file:///
    if (window.TechGearStorage) {
      window.TechGearStorage.setItem('techgear_detail_product_id', String(sp.id));
    }
  } catch (e) {
    console.warn('[Session] Lỗi khi lưu vào sessionStorage:', e);
  }
}

// Cập nhật giao diện thông tin phiên làm việc trực quan
function capNhatGiaoDienSession(sp) {
  const sessionText = document.getElementById('sessionDetailsText');
  if (!sessionText) return;

  const viewTime = sessionStorage.getItem('techgear_session_view_time_' + sp.id) || new Date().toLocaleTimeString('vi-VN');
  const viewCount = sessionStorage.getItem('techgear_session_views_' + sp.id) || '1';
  const savedVariant = sessionStorage.getItem('techgear_session_variant_' + sp.id) || 'Bản Tiêu Chuẩn';

  sessionText.innerHTML = `
    Đang xem mã <strong>#${sp.id} (${sp.danhMuc})</strong> &bull; 
    Phiên nạp lúc: <strong>${viewTime}</strong> &bull; 
    Lượt xem trong session: <strong>${viewCount} lần</strong> &bull; 
    Tùy chọn: <strong>${savedVariant}</strong>
  `;
}

// Quản lý tùy chọn phiên bản / cấu hình lưu vào sessionStorage (LAB 5 / LAB 7)
function initVariantPillsSession(sp) {
  const pills = document.querySelectorAll('#detailVariantPills .option-pill');
  const variantText = document.getElementById('sessionSelectedVariantText');
  if (pills.length === 0) return;

  const storageKey = 'techgear_session_variant_' + sp.id;
  let savedVariant = sessionStorage.getItem(storageKey);
  if (!savedVariant) {
    savedVariant = 'Bản Tiêu Chuẩn';
  }

  pills.forEach(pill => {
    const vName = pill.getAttribute('data-variant') || pill.textContent.trim();
    if (vName === savedVariant) {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    }

    pill.onclick = function () {
      pills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const chosen = this.getAttribute('data-variant') || this.textContent.trim();
      try {
        sessionStorage.setItem(storageKey, chosen);
        if (variantText) {
          variantText.textContent = `(Đã lưu vào session: ${chosen})`;
        }
        capNhatGiaoDienSession(sp);
        if (typeof window.showToast === 'function') {
          window.showToast('Phiên làm việc (Session)', `Đã lưu tùy chọn: "${chosen}" vào sessionStorage!`, 'info');
        }
      } catch (e) {}
    };
  });

  if (variantText) {
    variantText.textContent = `(Đã lưu vào session: ${savedVariant})`;
  }
}

// Hàm thêm nhanh vào giỏ hàng kết nối với module TechGearCart (LAB 7)
function themNhanhVaoGio(idSanPham) {
  if (window.TechGearCart) {
    window.TechGearCart.addItem(idSanPham, 1);
  } else {
    // Dự phòng khi chưa load cart.js
    const sp = danhSachSanPham.find(item => item.id === idSanPham);
    alert(`Đã thêm "${sp ? sp.ten : 'Sản phẩm'}" vào giỏ hàng!`);
  }
}

// 5. LAB 5 & LAB 7: HÀM ĐỔ DỮ LIỆU ĐA DẠNG CHO TRANG CHI TIẾT (detail.html)
function doDuLieuChiTietSanPham() {
  const tieuDeChiTiet = document.getElementById('detailProductTitle');
  if (!tieuDeChiTiet) return; // Không phải trang detail.html

  // 1. LAB 5 & LAB 7: Ứng dụng sessionStorage kết hợp URL query để lấy thông tin sản phẩm
  const thamSoURL = new URLSearchParams(window.location.search);
  let idCanTim = parseInt(thamSoURL.get('id'), 10);

  // Nếu không truyền ID qua URL (ví dụ click menu "Chi Tiết Demo"), đọc từ sessionStorage
  if (!idCanTim) {
    try {
      const sessionProductId = sessionStorage.getItem('techgear_detail_product_id');
      if (sessionProductId) {
        idCanTim = parseInt(sessionProductId, 10);
      }
    } catch (e) {}
  }

  // Mặc định ID = 1 nếu phiên làm việc chưa chọn sản phẩm nào
  if (!idCanTim) idCanTim = 1;

  // Tìm sản phẩm tương ứng trong mảng hoặc khôi phục từ sessionStorage
  let sp = danhSachSanPham.find(item => item.id === idCanTim);
  if (!sp) {
    try {
      const rawSessionObj = sessionStorage.getItem('techgear_detail_product');
      if (rawSessionObj) {
        sp = JSON.parse(rawSessionObj);
      }
    } catch (e) {}
  }
  if (!sp) sp = danhSachSanPham[0];

  // Lưu/cập nhật phiên làm việc hiện tại vào sessionStorage (LAB 5 / LAB 7)
  luuSanPhamVaoSession(sp.id);

  // Hiển thị trực quan thông tin phiên duyệt trên giao diện
  capNhatGiaoDienSession(sp);
  initVariantPillsSession(sp);

  // ==========================================
  // SESSION 1: THÔNG TIN CƠ BẢN & GALLERY ẢNH
  // ==========================================
  tieuDeChiTiet.textContent = sp.ten;
  document.title = `${sp.ten} - Chi Tiết Sản Phẩm | TechGear Store`;

  const breadcrumb = document.getElementById('detailBreadcrumbName');
  if (breadcrumb) breadcrumb.textContent = sp.ten;

  const breadcrumbCat = document.getElementById('detailBreadcrumbCat');
  if (breadcrumbCat) {
    breadcrumbCat.textContent = sp.danhMuc;
    breadcrumbCat.setAttribute('href', `products.html?category=${encodeURIComponent(sp.danhMuc)}`);
  }

  const giaHienTai = document.getElementById('detailPriceCurrent');
  if (giaHienTai) giaHienTai.textContent = dinhDangTien(sp.gia);

  const giaCu = document.getElementById('detailPriceOld');
  if (giaCu) {
    giaCu.textContent = sp.giaCu ? dinhDangTien(sp.giaCu) : '';
  }

  const discountTag = document.getElementById('detailDiscountTag');
  if (discountTag) {
    if (sp.giaCu && sp.giaCu > sp.gia) {
      const tietKiem = sp.giaCu - sp.gia;
      discountTag.textContent = `Tiết kiệm ${dinhDangTien(tietKiem)} (${sp.giamGia})`;
      discountTag.style.display = 'inline-block';
    } else {
      discountTag.style.display = 'none';
    }
  }

  // Đổ ảnh lớn và các thumbnails
  const anhChinh = document.getElementById('mainProductImg');
  if (anhChinh) {
    anhChinh.src = sp.hinhAnh;
    anhChinh.alt = sp.ten;
  }

  const thumbContainer = document.getElementById('detailThumbnails');
  if (thumbContainer && sp.thumbnails && sp.thumbnails.length > 0) {
    thumbContainer.innerHTML = sp.thumbnails.map((thumbSrc, index) => `
      <div class="gallery-thumb ${index === 0 ? 'active' : ''}" role="button" tabindex="0" title="Ảnh góc ${index + 1}">
        <img src="${thumbSrc}" alt="${sp.ten} góc ${index + 1}">
      </div>
    `).join('');

    // Gọi lại sự kiện click gallery cho thumbnails mới
    if (typeof window.initProductGallery === 'function') {
      window.initProductGallery();
    }
  }

  // Nút Thêm vào giỏ trên trang chi tiết
  const btnDetailAddCart = document.getElementById('btnDetailAddCart');
  if (btnDetailAddCart) {
    btnDetailAddCart.onclick = function () {
      const qtyInput = document.querySelector('.qty-input');
      const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
      if (window.TechGearCart) {
        window.TechGearCart.addItem(sp.id, qty);
      }
    };
  }

  // Nút Mua ngay
  const btnDetailBuyNow = document.getElementById('btnDetailBuyNow');
  if (btnDetailBuyNow) {
    btnDetailBuyNow.onclick = function (e) {
      e.preventDefault();
      const qtyInput = document.querySelector('.qty-input');
      const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
      if (window.TechGearCart) {
        window.TechGearCart.addItem(sp.id, qty);
        if (window.TechGearStorage && typeof window.TechGearStorage.navigate === 'function') {
          window.TechGearStorage.navigate('checkout.html');
        } else {
          window.location.href = 'checkout.html';
        }
      }
    };
  }

  // ==========================================
  // SESSION 2: KHỐI ƯU ĐÃI ĐẶC QUYỀN (PROMO)
  // ==========================================
  const promoContainer = document.getElementById('detailPromoBox');
  if (promoContainer && sp.uuDai) {
    promoContainer.innerHTML = `
      <div class="detail-promo-title">
        <i class="fa-solid fa-gift"></i> Ưu Đãi & Khuyến Mãi Đặc Quyền
      </div>
      <ul class="detail-promo-list">
        ${sp.uuDai.map(uu => `
          <li class="detail-promo-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>${uu}</span>
          </li>
        `).join('')}
      </ul>
    `;
  }

  // ==========================================
  // SESSION 3: CÁC TAB NỘI DUNG ĐA DẠNG
  // ==========================================

  // Tab 1: Đặc điểm nổi bật
  const tabDescContainer = document.getElementById('tabPaneDescription');
  if (tabDescContainer) {
    let dacDiemHTML = `
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 16px; color: var(--text-main);">
        <i class="fa-solid fa-star" style="color: #f59e0b;"></i> Điểm Nhấn Công Nghệ Trên ${sp.ten}
      </h3>
      <p style="font-size: 0.95rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 20px;">
        ${sp.moTa}
      </p>
      <div style="display: grid; gap: 14px; margin-bottom: 20px;">
    `;

    if (sp.dacDiemNoiBat) {
      sp.dacDiemNoiBat.forEach((item, idx) => {
        dacDiemHTML += `
          <div style="display: flex; gap: 12px; align-items: flex-start; background: #f8fafc; padding: 14px 18px; border-radius: var(--radius-sm); border-left: 4px solid var(--primary-color);">
            <span style="font-weight: 800; color: var(--primary-color);">0${idx + 1}.</span>
            <span style="color: #334155; line-height: 1.6;">${item}</span>
          </div>
        `;
      });
    }

    dacDiemHTML += `</div>`;
    tabDescContainer.innerHTML = dacDiemHTML;
  }

  // Tab 2: Bảng thông số kỹ thuật chi tiết
  const specsTableContainer = document.getElementById('tabPaneSpecs');
  if (specsTableContainer && sp.thongSo) {
    let specsHTML = `
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 16px; color: var(--text-main);">
        <i class="fa-solid fa-sliders" style="color: var(--primary-color);"></i> Bảng Cấu Hình Kỹ Thuật
      </h3>
      <table class="specs-table" style="width: 100%; border-collapse: collapse;">
        <tbody>
    `;

    for (const [key, value] of Object.entries(sp.thongSo)) {
      specsHTML += `
        <tr>
          <td style="font-weight: 600; width: 35%;">${key}:</td>
          <td>${value}</td>
        </tr>
      `;
    }

    specsHTML += `
        </tbody>
      </table>
    `;
    specsTableContainer.innerHTML = specsHTML;
  }

  // Tab 3: Đánh giá & Bình luận (Interactive Reviews với localStorage)
  renderProductReviews(sp);

  // ==========================================
  // SESSION 4: SẢN PHẨM CÙNG LOẠI (RELATED PRODUCTS)
  // ==========================================
  const relatedGrid = document.getElementById('relatedProductsGrid');
  if (relatedGrid) {
    // Lọc các sản phẩm cùng danh mục hoặc sản phẩm khác nếu ít
    let related = danhSachSanPham.filter(item => item.id !== sp.id && item.danhMuc === sp.danhMuc);
    if (related.length < 3) {
      related = danhSachSanPham.filter(item => item.id !== sp.id).slice(0, 4);
    }
    doDuLieuSanPham(related.slice(0, 4), 'relatedProductsGrid');
  }

  // ==========================================
  // SESSION 5: SẢN PHẨM ĐÃ XEM GẦN ĐÂY (LAB 7 - localStorage)
  // ==========================================
  saveRecentlyViewed(sp.id);
  renderRecentlyViewed(sp.id);

  // Khởi tạo chuyển Tab cho trang chi tiết (LAB 6: Sự kiện click)
  initDetailTabs();
}

/**
 * Quản lý Đánh giá sản phẩm (Render & Thêm review lưu vào localStorage)
 */
function renderProductReviews(sp) {
  const reviewsContainer = document.getElementById('tabPaneReviews');
  if (!reviewsContainer) return;

  // Đọc thêm đánh giá do người dùng vừa gửi từ localStorage
  const savedReviewsKey = `techgear_reviews_${sp.id}`;
  let userReviews = [];
  try {
    userReviews = JSON.parse(localStorage.getItem(savedReviewsKey)) || [];
  } catch (e) {
    userReviews = [];
  }

  const allReviews = [...(sp.danhGiaList || []), ...userReviews];

  reviewsContainer.innerHTML = `
    <div class="reviews-grid">
      <!-- Cột tổng quan điểm số -->
      <div class="reviews-score-card">
        <div class="reviews-score-number">${sp.sao}.0</div>
        <div class="rating-stars" style="font-size: 1.2rem; margin-bottom: 8px;">
          ${taoSao(sp.sao)}
        </div>
        <div style="font-size: 0.9rem; color: var(--text-muted);">
          Dựa trên <strong>${sp.danhGia + userReviews.length}</strong> lượt đánh giá thực tế
        </div>
      </div>

      <!-- Cột danh sách đánh giá & Form gửi đánh giá -->
      <div>
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">
          Nhận Xét Của Khách Hàng (${allReviews.length})
        </h4>

        <div class="review-list" id="reviewListEl">
          ${allReviews.map(rv => `
            <div class="review-item-card">
              <div class="review-item-top">
                <div class="review-author">
                  <i class="fa-solid fa-circle-user" style="color: var(--primary-color); font-size: 1.2rem;"></i>
                  <span>${rv.ten}</span>
                  <span class="review-badge-verified"><i class="fa-solid fa-check"></i> Đã mua tại TechGear</span>
                </div>
                <div class="review-date">${rv.ngay}</div>
              </div>
              <div class="rating-stars" style="margin-bottom: 6px; font-size: 0.85rem;">
                ${taoSao(rv.sao)}
              </div>
              <p class="review-comment">${rv.noiDung}</p>
            </div>
          `).join('')}
        </div>

        <!-- LAB 6: Form gửi đánh giá mới (Sự kiện submit + click chọn sao) -->
        <div class="review-form-box">
          <h5 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px; color: var(--text-main);">
            <i class="fa-solid fa-pen-to-square"></i> Viết Nhận Xét Của Bạn
          </h5>
          <form id="reviewSubmitForm">
            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 0.88rem; font-weight: 600; margin-bottom: 4px;">Đánh giá của bạn:</label>
              <!-- LAB 6: Sự kiện click chọn số sao -->
              <div class="rating-select-stars" id="starSelector">
                <i class="fa-solid fa-star active" data-rating="1"></i>
                <i class="fa-solid fa-star active" data-rating="2"></i>
                <i class="fa-solid fa-star active" data-rating="3"></i>
                <i class="fa-solid fa-star active" data-rating="4"></i>
                <i class="fa-solid fa-star active" data-rating="5"></i>
              </div>
              <input type="hidden" id="selectedStarValue" value="5">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
              <div>
                <label for="reviewAuthorName" class="form-label">Họ tên của bạn *</label>
                <input type="text" id="reviewAuthorName" class="form-input" placeholder="Ví dụ: Hoàng Long" required>
              </div>
              <div>
                <label for="reviewAuthorPhone" class="form-label">Số điện thoại *</label>
                <input type="tel" id="reviewAuthorPhone" class="form-input" placeholder="0988xxxxxx" required>
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <label for="reviewCommentText" class="form-label">Nội dung nhận xét *</label>
              <textarea id="reviewCommentText" class="form-input" rows="3" placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary">
              <i class="fa-solid fa-paper-plane"></i> Gửi Đánh Giá Ngay
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Gắn sự kiện tương tác chọn sao & submit đánh giá (LAB 6 & LAB 7)
  initReviewFormEvents(sp.id);
}

/**
 * LAB 6 & LAB 7: Xử lý sự kiện cho Form Đánh giá sản phẩm
 */
function initReviewFormEvents(productId) {
  const form = document.getElementById('reviewSubmitForm');
  const starContainer = document.getElementById('starSelector');
  const starValueInput = document.getElementById('selectedStarValue');

  if (starContainer && starValueInput) {
    const starIcons = starContainer.querySelectorAll('i');
    starIcons.forEach(icon => {
      // LAB 6: Sự kiện click chọn số sao
      icon.addEventListener('click', function () {
        const rating = parseInt(this.getAttribute('data-rating'), 10);
        starValueInput.value = rating;

        starIcons.forEach(s => {
          const sRating = parseInt(s.getAttribute('data-rating'), 10);
          if (sRating <= rating) {
            s.classList.add('active');
            s.className = 'fa-solid fa-star active';
          } else {
            s.classList.remove('active');
            s.className = 'fa-regular fa-star';
          }
        });
      });
    });
  }

  if (form) {
    // LAB 6: Sự kiện submit form
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const author = document.getElementById('reviewAuthorName').value.trim();
      const comment = document.getElementById('reviewCommentText').value.trim();
      const rating = parseInt(starValueInput.value, 10) || 5;

      if (!author || !comment) return;

      const newReview = {
        ten: author,
        ngay: new Date().toLocaleDateString('vi-VN'),
        sao: rating,
        noiDung: comment
      };

      // LAB 7: Lưu vào localStorage
      const storageKey = `techgear_reviews_${productId}`;
      let userReviews = [];
      try {
        userReviews = JSON.parse(localStorage.getItem(storageKey)) || [];
      } catch (err) {
        userReviews = [];
      }
      userReviews.unshift(newReview);
      localStorage.setItem(storageKey, JSON.stringify(userReviews));

      // Thông báo Toast thành công
      if (typeof window.showToast === 'function') {
        window.showToast('Gửi đánh giá thành công', 'Cảm ơn bạn đã đóng góp nhận xét cho sản phẩm!', 'success');
      } else {
        alert('Cảm ơn bạn đã gửi đánh giá!');
      }

      // Re-render lại khối đánh giá
      const sp = danhSachSanPham.find(item => item.id === productId);
      if (sp) renderProductReviews(sp);
    });
  }
}

/**
 * LAB 6: Sự kiện click chuyển Tabs trang chi tiết (kèm lưu phiên sessionStorage)
 */
function initDetailTabs() {
  const tabBtns = document.querySelectorAll('.detail-tab-btn');
  const tabPanes = document.querySelectorAll('.detail-tab-pane');

  if (tabBtns.length === 0) return;

  // LAB 5 & LAB 7: Khôi phục tab đang mở từ sessionStorage nếu có
  const savedTab = sessionStorage.getItem('techgear_detail_active_tab');
  if (savedTab) {
    const activeBtn = document.querySelector(`.detail-tab-btn[data-target="${savedTab}"]`);
    const activePane = document.getElementById(savedTab);
    if (activeBtn && activePane) {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      activeBtn.classList.add('active');
      activePane.classList.add('active');
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      this.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      // Lưu tab vào sessionStorage (LAB 5 / LAB 7)
      try {
        sessionStorage.setItem('techgear_detail_active_tab', targetId);
      } catch (e) {}
    });
  });
}

// Tự động lắng nghe mọi click vào thẻ <a> dẫn đến detail.html để lưu ID vào sessionStorage
document.addEventListener('click', function (e) {
  const link = e.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href) return;

  const match = href.match(/detail\.html(?:\?id=(\d+))?/);
  if (match) {
    if (match[1]) {
      const id = parseInt(match[1], 10);
      luuSanPhamVaoSession(id);
    }
  }
}, true);

/**
 * LAB 7: Lưu sản phẩm đã xem gần đây vào localStorage
 */
function saveRecentlyViewed(productId) {
  const key = 'techgear_recent_views';
  let recentIds = [];
  try {
    recentIds = JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    recentIds = [];
  }

  // Xóa nếu đã tồn tại để đưa lên đầu danh sách
  recentIds = recentIds.filter(id => id !== productId);
  recentIds.unshift(productId);

  // Giữ tối đa 6 sản phẩm gần nhất
  if (recentIds.length > 6) {
    recentIds = recentIds.slice(0, 6);
  }

  localStorage.setItem(key, JSON.stringify(recentIds));
}

/**
 * LAB 7: Đọc và hiển thị danh sách sản phẩm đã xem gần đây
 */
function renderRecentlyViewed(currentProductId) {
  const container = document.getElementById('recentlyViewedGrid');
  if (!container) return;

  const key = 'techgear_recent_views';
  let recentIds = [];
  try {
    recentIds = JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    recentIds = [];
  }

  // Lọc bỏ sản phẩm đang xem hiện tại
  recentIds = recentIds.filter(id => id !== currentProductId);

  if (recentIds.length === 0) {
    const parentSection = document.getElementById('recentlyViewedSection');
    if (parentSection) parentSection.style.display = 'none';
    return;
  }

  const recentProducts = recentIds
    .map(id => danhSachSanPham.find(sp => sp.id === id))
    .filter(Boolean);

  doDuLieuSanPham(recentProducts, 'recentlyViewedGrid');
}

// 6. BỘ LỌC VÀ SẮP XẾP SẢN PHẨM TRANG SHOP (products.html - LAB 6: Sự kiện change/click)

// Bảng ánh xạ linh hoạt giữa slug/tên danh mục với trường danhMuc trong dữ liệu
const CATEGORY_SLUG_MAP = {
  dienthoai: ['Điện Thoại'],
  phone: ['Điện Thoại'],
  'điện thoại': ['Điện Thoại'],
  laptop: ['Laptop'],
  tainghe: ['Tai Nghe', 'Âm Thanh'],
  audio: ['Tai Nghe', 'Âm Thanh'],
  'tai nghe': ['Tai Nghe', 'Âm Thanh'],
  'tai nghe & âm thanh': ['Tai Nghe', 'Âm Thanh'],
  dongho: ['Đồng Hồ'],
  watch: ['Đồng Hồ'],
  'đồng hồ': ['Đồng Hồ'],
  'đồng hồ thông minh': ['Đồng Hồ'],
  banphim: ['Bàn Phím', 'Chuột Gaming'],
  gear: ['Bàn Phím', 'Chuột Gaming'],
  'bàn phím': ['Bàn Phím', 'Chuột Gaming'],
  'bàn phím cơ & chuột': ['Bàn Phím', 'Chuột Gaming'],
  maytinhbang: ['Máy Tính Bảng'],
  tablet: ['Máy Tính Bảng'],
  'máy tính bảng': ['Máy Tính Bảng']
};

/**
 * Đọc tham số URL an toàn hỗ trợ cả Web Server lẫn file:/// (Chrome, Firefox)
 */
function getSafeUrlParam(paramKey) {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(paramKey)) {
      return searchParams.get(paramKey);
    }
    const href = window.location.href;
    const qIndex = href.indexOf('?');
    if (qIndex !== -1) {
      const queryPart = href.substring(qIndex + 1).split('#')[0];
      const manualParams = new URLSearchParams(queryPart);
      if (manualParams.has(paramKey)) {
        return manualParams.get(paramKey);
      }
    }
    const hash = window.location.hash;
    if (hash && hash.includes('=')) {
      const hashPart = hash.startsWith('#') ? hash.substring(1) : hash;
      const hashParams = new URLSearchParams(hashPart);
      if (hashParams.has(paramKey)) {
        return hashParams.get(paramKey);
      }
    }
  } catch (e) {}
  return null;
}

/**
 * Khởi tạo toàn bộ bộ lọc và sắp xếp trên trang products.html
 */
function initShopFilters() {
  const shopEl = document.getElementById('danhSachSanPhamShop');
  if (!shopEl) return;

  const countEl = document.getElementById('shopToolbarCount');
  const sortSelect = document.getElementById('sortSelect');
  const filterResetBtn = document.getElementById('filterResetBtn');
  const breadcrumbFilter = document.getElementById('shopBreadcrumbFilter');
  const breadcrumbCurrent = document.getElementById('shopBreadcrumbCurrent');

  // Đọc các tham số khởi tạo từ URL
  const initialCategory = (getSafeUrlParam('category') || getSafeUrlParam('danhMuc') || '').trim().toLowerCase();
  const initialBrand = (getSafeUrlParam('brand') || getSafeUrlParam('thuongHieu') || '').trim();
  const initialSearch = (getSafeUrlParam('q') || '').trim();
  const initialPrice = (getSafeUrlParam('price') || '').trim();

  // 1. Áp dụng trạng thái khởi tạo lên các ô checkbox / radio
  if (initialCategory) {
    const catInputs = document.querySelectorAll('input[name="category"]');
    catInputs.forEach(input => {
      const val = (input.value || '').toLowerCase();
      if (
        val === initialCategory ||
        (CATEGORY_SLUG_MAP[initialCategory] &&
          CATEGORY_SLUG_MAP[initialCategory].some(c => val.includes(c.toLowerCase())))
      ) {
        input.checked = true;
      }
    });
  }

  if (initialBrand) {
    const brandInputs = document.querySelectorAll('input[name="brand"]');
    brandInputs.forEach(input => {
      if (input.value.toLowerCase() === initialBrand.toLowerCase()) {
        input.checked = true;
      }
    });
  }

  if (initialPrice) {
    const priceInput = document.querySelector(`input[name="price_range"][value="${initialPrice}"]`);
    if (priceInput) priceInput.checked = true;
  }

  // 2. Hàm lọc và sắp xếp danh sách sản phẩm
  function applyFilters() {
    // Lấy danh mục được chọn
    const checkedCatInputs = Array.from(document.querySelectorAll('input[name="category"]:checked'));
    const selectedCategorySlugs = checkedCatInputs.map(input => input.value.toLowerCase());

    let allowedCategories = [];
    selectedCategorySlugs.forEach(slug => {
      if (CATEGORY_SLUG_MAP[slug]) {
        allowedCategories.push(...CATEGORY_SLUG_MAP[slug]);
      } else {
        allowedCategories.push(slug);
      }
    });
    allowedCategories = Array.from(new Set(allowedCategories.map(c => c.toLowerCase())));

    // Lấy mức giá được chọn
    const checkedPriceInput = document.querySelector('input[name="price_range"]:checked');
    const selectedPriceRange = checkedPriceInput ? checkedPriceInput.value : 'all';

    // Lấy thương hiệu được chọn
    const checkedBrandInputs = Array.from(document.querySelectorAll('input[name="brand"]:checked'));
    const selectedBrands = checkedBrandInputs.map(input => input.value.toLowerCase());

    // Lấy từ khóa tìm kiếm (từ URL)
    const currentSearch = (getSafeUrlParam('q') || '').trim().toLowerCase();

    // Lọc mảng sản phẩm
    let result = danhSachSanPham.filter(sp => {
      // a. Lọc theo danh mục
      if (allowedCategories.length > 0) {
        const spCat = sp.danhMuc.toLowerCase();
        const catMatch = allowedCategories.some(cat => spCat.includes(cat) || cat.includes(spCat));
        if (!catMatch) return false;
      }

      // b. Lọc theo mức giá
      if (selectedPriceRange !== 'all') {
        const price = sp.gia;
        if (selectedPriceRange === 'under_5m' && price >= 5000000) return false;
        if (selectedPriceRange === '5m_15m' && (price < 5000000 || price > 15000000)) return false;
        if (selectedPriceRange === '15m_30m' && (price < 15000000 || price > 30000000)) return false;
        if (selectedPriceRange === 'over_30m' && price <= 30000000) return false;
      }

      // c. Lọc theo thương hiệu
      if (selectedBrands.length > 0) {
        const spBrand = (sp.thuongHieu || '').toLowerCase();
        if (!selectedBrands.includes(spBrand)) return false;
      }

      // d. Lọc theo từ khóa tìm kiếm
      if (currentSearch) {
        const inTen = sp.ten.toLowerCase().includes(currentSearch);
        const inDM = sp.danhMuc.toLowerCase().includes(currentSearch);
        const inBrand = (sp.thuongHieu || '').toLowerCase().includes(currentSearch);
        const inDesc = (sp.moTa || '').toLowerCase().includes(currentSearch);
        if (!inTen && !inDM && !inBrand && !inDesc) return false;
      }

      return true;
    });

    // Sắp xếp
    const sortVal = sortSelect ? sortSelect.value : 'featured';
    if (sortVal === 'price_asc') {
      result.sort((a, b) => a.gia - b.gia);
    } else if (sortVal === 'price_desc') {
      result.sort((a, b) => b.gia - a.gia);
    } else if (sortVal === 'rating') {
      result.sort((a, b) => b.sao - a.sao || b.danhGia - a.danhGia);
    }

    // Đổ dữ liệu ra DOM
    doDuLieuSanPham(result, 'danhSachSanPhamShop');

    // Cập nhật thanh đếm
    if (countEl) {
      if (currentSearch) {
        countEl.innerHTML = `Tìm thấy <strong>${result.length}</strong> sản phẩm cho từ khóa "<strong>${currentSearch}</strong>"`;
      } else {
        countEl.innerHTML = `Hiển thị <strong>${result.length}</strong> trong số <strong>${danhSachSanPham.length}</strong> sản phẩm`;
      }
    }

    // Cập nhật Breadcrumbs
    if (breadcrumbFilter && breadcrumbCurrent) {
      if (checkedCatInputs.length === 1) {
        const labelText = checkedCatInputs[0].closest('label').textContent.trim();
        breadcrumbCurrent.textContent = labelText;
        breadcrumbFilter.style.display = 'inline';
      } else if (checkedCatInputs.length > 1) {
        breadcrumbCurrent.textContent = `${checkedCatInputs.length} danh mục đã chọn`;
        breadcrumbFilter.style.display = 'inline';
      } else {
        breadcrumbFilter.style.display = 'none';
      }
    }
  }

  // 3. Gắn sự kiện 'change' cho tất cả checkbox và radio trong sidebar (LAB 6)
  const allFilterInputs = document.querySelectorAll('.filter-item input');
  allFilterInputs.forEach(input => {
    input.addEventListener('change', () => {
      applyFilters();
    });
  });

  // Gắn sự kiện 'change' cho dropdown sắp xếp (LAB 6)
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      applyFilters();
    });
  }

  // 4. Hàm đặt lại bộ lọc
  window.resetShopFilters = function () {
    // Bỏ chọn tất cả checkbox danh mục & thương hiệu
    document.querySelectorAll('.filter-item input[type="checkbox"]').forEach(i => (i.checked = false));

    // Đưa radio mức giá về 'all'
    const defaultPriceRadio = document.querySelector('input[name="price_range"][value="all"]');
    if (defaultPriceRadio) defaultPriceRadio.checked = true;

    // Đưa sort về 'featured'
    if (sortSelect) sortSelect.value = 'featured';

    // Dọn param URL
    if (window.history && typeof window.history.replaceState === 'function') {
      const cleanUrl = window.location.pathname;
      window.history.replaceState(null, document.title, cleanUrl);
    }

    // Chạy lại lọc
    applyFilters();

    // Thông báo toast
    if (window.showToast) {
      window.showToast('Bộ lọc', 'Đã đặt lại toàn bộ tiêu chí lọc sản phẩm.', 'info');
    }
  };

  // Gắn sự kiện click cho nút Đặt lại
  if (filterResetBtn) {
    filterResetBtn.addEventListener('click', window.resetShopFilters);
  }

  // Thực hiện lọc ngay khi khởi tạo
  applyFilters();
}

// 7. TỰ ĐỘNG CHẠY ĐỔ DỮ LIỆU KHI TRANG TẢI
function chayDoDuLieu() {
  // Trang chủ (index.html)
  doDuLieuSanPham(danhSachSanPham, 'danhSachSanPhamHome');

  // Trang danh sách (products.html) - Chạy toàn bộ hệ thống bộ lọc & sắp xếp
  initShopFilters();

  // Trang chi tiết (detail.html)
  doDuLieuChiTietSanPham();
}

// Đăng ký toàn cục các hàm hỗ trợ
window.danhSachSanPham = danhSachSanPham;
window.luuSanPhamVaoSession = luuSanPhamVaoSession;
window.doDuLieuChiTietSanPham = doDuLieuChiTietSanPham;
window.doDuLieuSanPham = doDuLieuSanPham;
window.themNhanhVaoGio = themNhanhVaoGio;
window.initShopFilters = initShopFilters;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', chayDoDuLieu);
} else {
  chayDoDuLieu();
}
