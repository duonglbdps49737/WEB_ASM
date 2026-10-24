# Spec: Assignment GD1 - Website Bán Hàng Công Nghệ (WEB1044 - JavaScript Cơ Bản)

## Assumptions I'm Making
1. **Chủ đề website:** Website bán thiết bị công nghệ & phụ kiện điện tử ("TechGear Store"), phù hợp với sinh viên FPT Poly ngành CNTT/Lập trình Web.
2. **Phạm vi giai đoạn 1 (GD1):**
   - Hoàn thiện cấu trúc giao diện HTML5/CSS3 chuẩn Responsive (Desktop & Mobile).
   - Triển khai các tính năng JavaScript trọng tâm của GD1:
     + Slideshow Banner tự động + nút bấm điều hướng (Next/Prev/Dots).
     + Image Gallery (xem ảnh chi tiết sản phẩm qua thumbnails).
     + Form Validation bằng JavaScript thuần (Kiểm tra form Đăng ký / Liên hệ: rỗng, email hợp lệ, mật khẩu khớp, hiển thị thông báo lỗi thân thiện).
   - Dựng sẵn khung layout cho Giỏ hàng và Danh sách sản phẩm để sẵn sàng cho Giai đoạn 2 (GD2: LocalStorage, CRUD, Giỏ hàng động).
3. **Môi trường:** Chạy trực tiếp trên trình duyệt hiện đại (Chrome/Edge/Firefox), mở qua Live Server hoặc file tĩnh không cần backend phức tạp.
4. **Ngôn ngữ trong code:** Chú thích tiếng Việt rõ ràng, bám sát kiến thức từ Lab 1 đến Lab 5 của môn WEB1044.

---

## 1. Objective
Xây dựng đồ án Assignment Giai đoạn 1 (GD1) môn **WEB1044 - Lập trình JavaScript cơ bản** (Lớp SD21303). Đồ án cung cấp một website bán hàng công nghệ trực quan, chuẩn UI/UX, mã nguồn tường minh, đáp ứng toàn diện tiêu chí chấm điểm GD1 của FPT Polytechnic.

### Đối tượng & Trải nghiệm người dùng:
- **Khách hàng:** Dễ dàng lướt xem các banner khuyến mãi chuyển động mượt mà, xem danh mục & sản phẩm nổi bật, xem chi tiết ảnh sản phẩm và gửi form đăng ký/liên hệ với phản hồi lỗi tức thì.
- **Giảng viên chấm bài:** Thấy rõ cấu trúc thư mục chuẩn, mã HTML ngữ nghĩa (semantic), CSS Flexbox/Grid hiện đại không trùng lặp, và JavaScript thuần xử lý logic DOM / Event / Timer / Regex rõ ràng.

---

## 2. Tech Stack
- **HTML5:** Cấu trúc thẻ ngữ nghĩa (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
- **CSS3:** Flexbox, CSS Grid, CSS Variables cho theme màu, Media Queries responsive (Mobile First / Breakpoints 768px, 1024px).
- **JavaScript (ES6+ Vanilla):**
  - Thao tác DOM (`querySelector`, `getElementById`, `classList`, `setAttribute`).
  - Sự kiện (`addEventListener`, `click`, `submit`, `input`, `mouseover`, `mouseout`).
  - Timers (`setInterval`, `clearInterval`) cho Banner Slider.
  - Form validation: Regular Expression (Regex email), logic so sánh password, hiển thị feedback UI.
- **Font & Icon:** Google Fonts (Inter / Roboto) + Font Awesome 6 (qua CDN) cho icon trực quan.

---

## 3. Commands
Dự án là ứng dụng web tĩnh phía client (Static Front-end), không yêu cầu build step cồng kềnh:
- **Chạy thử nghiệm (Dev Server):**
  - Mở bằng tiện ích VSCode / Codespace `Live Server` (Port 5500), hoặc:
  - Command: `python3 -m http.server 3000` (truy cập `http://localhost:3000`)
- **Kiểm tra mã nguồn (Syntax & Format):**
  - Lint: Dùng trình kiểm tra cú pháp browser console / Node: `node --check js/*.js`

---

## 4. Project Structure
```
ASM/
├── SPEC.md                  # Bản đặc tả kỹ thuật (Spec document)
├── index.html               # Trang chủ: Header, Nav, Banner Slider, Danh mục, Sản phẩm nổi bật, Footer
├── products.html            # Trang danh sách sản phẩm: Bộ lọc danh mục, Grid sản phẩm
├── detail.html              # Trang chi tiết sản phẩm: Gallery ảnh (thay đổi ảnh lớn), Thông tin mô tả, Đặt mua
├── cart.html                # Trang giỏ hàng: Bảng sản phẩm mẫu, Tạm tính, Khung nhập voucher
├── contact.html             # Trang liên hệ / góp ý: Thông tin shop, Bản đồ mẫu, Form liên hệ
├── register.html            # Trang đăng ký / đăng nhập: Form Validate đầy đủ tiêu chí GD1
├── css/
│   ├── style.css            # Style chung (variables, reset, typography, layout, header, footer)
│   ├── responsive.css       # Media queries xử lý hiển thị responsive trên tablet & mobile
│   └── components.css       # Style riêng cho slider, cards, form inputs, buttons, alerts
├── js/
│   ├── slider.js            # Logic Slideshow banner (Next, Prev, Auto-play, Dots, Hover pause)
│   ├── gallery.js           # Logic đổi ảnh chi tiết sản phẩm khi click thumbnails
│   ├── validation.js        # Logic kiểm tra tính hợp lệ form Đăng ký & Form Liên hệ
│   └── main.js              # Khởi tạo chung, điều hướng menu mobile toggle (hamburger)
├── images/                  # Thư mục lưu trữ hình ảnh banner, logo, sản phẩm
│   ├── banners/
│   └── products/
└── tasks/
    ├── plan.md              # Kế hoạch triển khai chi tiết
    └── todo.md              # Danh sách task công việc có checkpoint nghiệm thu
```

---

## 5. Code Style & Convention

### Quy ước đặt tên:
- **File & Thư mục:** kebab-case hoặc lowercase đơn giản (`index.html`, `slider.js`, `style.css`).
- **Biến & Hàm JS:** camelCase (`currentSlide`, `handleNextSlide`, `validateEmail`, `showError`).
- **Hằng số JS:** UPPER_SNAKE_CASE (`SLIDE_INTERVAL = 4000`).
- **Class CSS:** kebab-case theo chuẩn BEM đơn giản (`.product-card`, `.product-card__title`, `.form-group--error`).
- **ID HTML:** camelCase hoặc kebab-case rõ nghĩa (`#mainSlider`, `#registerForm`).

### Code Snippet mẫu (JavaScript & Clean DOM Handling):
```javascript
// js/slider.js - Ví dụ chuẩn mực sạch sẽ, dễ bảo trì
const SLIDE_INTERVAL_TIME = 4000;
let slideIndex = 0;
let slideTimer = null;

const slides = document.querySelectorAll('.slider__item');
const dots = document.querySelectorAll('.slider__dot');

function showSlide(index) {
  if (index >= slides.length) slideIndex = 0;
  else if (index < 0) slideIndex = slides.length - 1;
  else slideIndex = index;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === slideIndex);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === slideIndex);
  });
}

function startAutoSlide() {
  stopAutoSlide();
  slideTimer = setInterval(() => {
    showSlide(slideIndex + 1);
  }, SLIDE_INTERVAL_TIME);
}

function stopAutoSlide() {
  if (slideTimer) clearInterval(slideTimer);
}
```

---

## 6. Testing Strategy
- **Manual Functional Testing (Kiểm thử chức năng giao diện & tương tác):**
  1. *Slider Banner:*
     - Kiểm tra nút Next, Prev chuyển ảnh chính xác.
     - Tự động chạy sau mỗi 4 giây.
     - Khi rê chuột vào banner thì dừng (pause), khi rê chuột ra thì tiếp tục chạy.
     - Bấm vào từng chấm dot chuyển đúng slide tương ứng.
  2. *Gallery ảnh chi tiết:*
     - Click vào từng ảnh thumbnail nhỏ ở dưới -> ảnh lớn phía trên đổi tức thì.
  3. *Form Validation (Đăng ký / Liên hệ):*
     - Bấm Submit khi để trống -> Viền đỏ các ô lỗi, hiển thị thông báo "Vui lòng nhập...".
     - Nhập sai định dạng email -> Báo "Email không đúng định dạng".
     - Nhập mật khẩu < 6 ký tự -> Báo lỗi độ dài.
     - Nhập xác nhận mật khẩu không khớp -> Báo "Mật khẩu xác nhận không trùng khớp".
     - Khi người dùng gõ sửa lại (sự kiện `input`) -> Tự động xoá trạng thái lỗi.
  4. *Responsive Test:*
     - Kiểm tra trên các kích thước màn hình: Mobile (375px - 480px), Tablet (768px), Desktop (1200px+).
     - Menu hamburger toggle đóng/mở mượt mà trên mobile.

---

## 7. Boundaries

- **Always do (Luôn luôn thực hiện):**
  - Viết code có cấu trúc rõ ràng, chú thích tiếng Việt ngắn gọn, dễ hiểu để sinh viên tự tin thuyết trình / vấn đáp với giảng viên.
  - Sử dụng HTML5 semantic tags.
  - Ngăn ngừa lỗi `null` khi query selector (luôn kiểm tra phần tử tồn tại trước khi gán sự kiện).
  - Tách bạch file HTML, CSS và JS (không viết style hay script inline bừa bãi).
- **Ask first (Hỏi ý kiến trước):**
  - Thêm bất kỳ thư viện ngoài nào кроме FontAwesome & Google Fonts.
  - Thay đổi cấu trúc thư mục dự án hoặc thêm bớt các trang giao diện.
- **Never do (Tuyệt đối không làm):**
  - Dùng các framework nặng như React, Vue, Angular (vì môn WEB1044 chỉ chấm HTML/CSS/JS thuần).
  - Sử dụng `alert()` phiền phức cho validation (phải hiển thị thông báo lỗi ngay dưới field).
  - Hardcode đường dẫn tuyệt đối (phải dùng đường dẫn tương đối để chạy được trên mọi máy tính).

---

## 8. Success Criteria (Tiêu chí nghiệm thu hoàn thành GD1)
1. Có đầy đủ 6 trang giao diện chuẩn đẹp, responsive:
   - `index.html` (Trang chủ)
   - `products.html` (Danh sách sản phẩm)
   - `detail.html` (Chi tiết sản phẩm)
   - `cart.html` (Khung giỏ hàng mẫu)
   - `contact.html` (Liên hệ & góp ý)
   - `register.html` (Đăng ký tài khoản)
2. Tính năng Slideshow Banner hoạt động 100% mượt mà, đầy đủ auto-play, pause on hover, next/prev, dots navigation.
3. Tính năng Gallery chi tiết sản phẩm hoạt động mượt mà.
4. Form Validation trên trang Đăng ký và Liên hệ kiểm tra chặt chẽ, hiển thị lỗi realtime/on submit bằng DOM manipulation chuyên nghiệp.
5. Menu header có chế độ Responsive (hamburger toggle trên mobile).
6. Không có bất kỳ lỗi Javascript runtime nào trên Console trình duyệt (`0 errors`).

---

## 9. Open Questions / Clarifications
- Bạn có muốn đưa logo hoặc bộ nhận diện thương hiệu cụ thể nào (hoặc màu sắc chủ đạo, ví dụ: Xanh công nghệ `#0984e3`, Cam `#e17055`, hay Đen sang trọng) không? *(Mặc định đề xuất: Xanh công nghệ hiện đại Indigo/Blue `#2563eb` kết hợp nền sáng `#f8fafc`).*
- Bạn có cần trang đăng nhập (`login.html`) tách riêng hay tích hợp tab Đăng ký / Đăng nhập chung trong `register.html`? *(Đề xuất: Tích hợp hoặc tạo bổ sung form đăng nhập tiện lợi).*
