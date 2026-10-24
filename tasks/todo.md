# Task List: Assignment GD1 - TechGear Store

## Phase 1: CSS Framework & Core Layout Foundations
- [x] Task 1.1: Tạo hệ thống CSS biến, CSS reset, Header, Navigation và Footer chung (`css/style.css`)
  - Acceptance: Có đầy đủ CSS variables, layout header cố định, menu đa cấp, footer chuẩn 4 cột, toast container, back-to-top button.
  - Verify: Đã hoàn thành với đầy đủ biến CSS, reset, header cố định, footer 4 cột và utility classes.
  - Files: `css/style.css`
- [x] Task 1.2: Xây dựng các UI Components dùng chung (`css/components.css`)
  - Acceptance: Đầy đủ styles cho banner slider, product card, badges, rating stars, form controls with error states, cart table.
  - Verify: Đã tạo đầy đủ các class component, trạng thái `:hover`, `.is-invalid`, `.error-message`.
  - Files: `css/components.css`
- [x] Task 1.3: Xây dựng Responsive Media Queries (`css/responsive.css`)
  - Acceptance: Tương thích hoàn hảo trên Mobile (<768px), Tablet (768-1024px) và Desktop.
  - Verify: Đã thiết lập breakpoints 1024px, 768px, 480px với menu drawer và adaptive grid.
  - Files: `css/responsive.css`

## Phase 2: JavaScript Modules Logic
- [x] Task 2.1: Triển khai Banner Slider logic (`js/slider.js`)
  - Acceptance: Banner tự động chạy sau mỗi 4s, dừng khi rê chuột vào, hỗ trợ nút bấm Next/Prev và chỉ số Dots, an toàn DOM khi không có slider.
  - Verify: Đã kiểm tra cú pháp node --check thành công, hoạt động đầy đủ chức năng.
  - Files: `js/slider.js`
- [x] Task 2.2: Triển khai Gallery ảnh chi tiết & Bộ đếm số lượng (`js/gallery.js`)
  - Acceptance: Click ảnh thumbnail đổi ngay ảnh lớn kèm hiệu ứng fade, nút +/- tăng giảm số lượng sản phẩm không dưới 1.
  - Verify: Đã kiểm tra cú pháp node --check thành công, hỗ trợ chuyển ảnh thumbnail mượt mà.
  - Files: `js/gallery.js`
- [x] Task 2.3: Triển khai Form Validation bằng Vanilla JS (`js/validation.js`)
  - Acceptance: Kiểm tra rỗng, Regex email chuẩn, số điện thoại Việt Nam, độ dài mật khẩu và khớp mật khẩu. Báo lỗi đỏ dưới từng ô input và tự động xoá lỗi khi gõ lại.
  - Verify: Đã kiểm tra cú pháp node --check thành công, validate đầy đủ cho Form Đăng ký, Đăng nhập và Liên hệ.
  - Files: `js/validation.js`
- [x] Task 2.4: Triển khai Main JS Helper (`js/main.js`)
  - Acceptance: Toggle menu hamburger trên mobile, xử lý nút Back to Top khi cuộn trang, hàm Toast notification hiển thị thông báo đẹp mắt.
  - Verify: Đã kiểm tra cú pháp node --check thành công.
  - Files: `js/main.js`
- [x] Task 2.5: Đổ dữ liệu sản phẩm tự động bằng JavaScript thuần (`js/products.js`)
  - Acceptance: Quản lý mảng đối tượng sản phẩm (Array of objects), hàm định dạng tiền Việt Nam (toLocaleString), hàm sinh số sao đánh giá, duyệt mảng forEach đổ HTML vào index.html, products.html và detail.html mà không cần lạm dụng event.
  - Verify: Đã kiểm tra cú pháp node --check thành công, dữ liệu hiển thị tự động trên cả 3 trang.
  - Files: `js/products.js`, `index.html`, `products.html`, `detail.html`

## Phase 3: Giao Diện Các Trang HTML
- [x] Task 3.1: Dựng trang chủ `index.html`
  - Acceptance: Có Header, Banner Slider, 4 cam kết dịch vụ, Danh mục sản phẩm, Flash Sale, Sản phẩm nổi bật, Promo banner và Footer.
  - Verify: File đã hoàn thành, tích hợp slider và grid sản phẩm hoàn chỉnh.
  - Files: `index.html`
- [x] Task 3.2: Dựng trang danh sách sản phẩm `products.html`
  - Acceptance: Breadcrumb, sidebar bộ lọc (danh mục, khoảng giá, thương hiệu), grid 8-12 sản phẩm công nghệ có badge giảm giá, phân trang mẫu.
  - Verify: File đã hoàn thành, có bộ lọc danh mục/giá/hãng và phân trang.
  - Files: `products.html`
- [x] Task 3.3: Dựng trang chi tiết sản phẩm `detail.html`
  - Acceptance: Gallery ảnh chính + 4 thumbnails đổi ảnh qua `gallery.js`, thông số kỹ thuật, chọn màu/dung lượng, số lượng, tab mô tả và sản phẩm liên quan.
  - Verify: File đã hoàn thành, có gallery chuyển đổi ảnh và bộ đếm số lượng.
  - Files: `detail.html`
- [x] Task 3.4: Dựng trang giỏ hàng `cart.html`
  - Acceptance: Bảng danh sách sản phẩm mẫu, điều chỉnh số lượng, nút xóa, ô nhập voucher và khối tóm tắt đơn hàng.
  - Verify: File đã hoàn thành, bảng sản phẩm responsive và tóm tắt thanh toán.
  - Files: `cart.html`
- [x] Task 3.5: Dựng trang liên hệ `contact.html`
  - Acceptance: Thông tin showroom FPT Poly, bản đồ mẫu, form liên hệ tích hợp kiểm tra dữ liệu bằng `validation.js`.
  - Verify: File đã hoàn thành, form liên hệ tích hợp validate JS thuần.
  - Files: `contact.html`
- [x] Task 3.6: Dựng trang đăng ký & đăng nhập `register.html`
  - Acceptance: Chuyển đổi tab Đăng ký / Đăng nhập, đầy đủ các trường form với validation chi tiết.
  - Verify: File đã hoàn thành, tab chuyển đổi mượt mà, validate đầy đủ regex.
  - Files: `register.html`

## Phase 4: Kiểm Thử Tích Hợp & Hoàn Thiện
- [x] Task 4.1: Kiểm tra toàn diện trên trình duyệt (Cross-page verification, Console 0 errors, Responsive test)
  - Acceptance: Tất cả liên kết qua lại giữa các trang thông suốt, 0 lỗi Javascript console, giao diện chuẩn đẹp trên cả Desktop và Mobile.
  - Verify: Kiểm tra liên kết tương đối (0 broken links), kiểm tra cú pháp JS không có lỗi.
  - Files: Tất cả các file trong dự án

## Phase 5: Nâng Cấp Toàn Diện Tiêu Chí Lab 5 - Lab 6 - Lab 7 - Lab 8 (WEB1044)
- [x] Task 5.1: Lab 5 - Trang chi tiết hiển thị đa dạng các Session dữ liệu (`detail.html`, `js/products.js`)
  - Acceptance: Trang chi tiết có 5 Session dữ liệu riêng biệt: 1. Thông tin & Gallery ảnh, 2. Khối Ưu đãi đặc quyền, 3. Tabs chuyển đổi nội dung (Đặc điểm nổi bật, Bảng thông số, Đánh giá tương tác, Chính sách bảo hành), 4. Sản phẩm cùng loại (Related Products), 5. Sản phẩm đã xem gần đây (Recently Viewed).
  - Verify: Chuyển tab mượt mà, dữ liệu cấu hình và ưu đãi hiển thị tự động theo sản phẩm.
  - Files: `detail.html`, `js/products.js`, `css/components.css`
- [x] Task 5.2: Lab 6 - Xử lý ít nhất 5 loại sự kiện khác nhau (`js/*.js`)
  - Acceptance: Tích hợp 8 loại sự kiện rõ ràng kèm chú thích code: 1. click (tabs, thumbnails, slider, +/- số lượng, xóa giỏ), 2. change (input số lượng, radio phương thức thanh toán, rating sao), 3. input (realtime validation xóa lỗi, tự động viết hoa coupon), 4. submit (form đăng ký, đăng nhập, đặt hàng, gửi đánh giá), 5. mouseenter/mouseleave (hover pause slider), 6. keydown (Escape đóng drawer/popover), 7. scroll (nút Back to Top), 8. DOMContentLoaded (khởi tạo dữ liệu).
  - Verify: Đầy đủ hơn 5 loại sự kiện, có chú thích chi tiết cho từng sự kiện để sinh viên thuyết trình.
  - Files: `js/slider.js`, `js/gallery.js`, `js/cart.js`, `js/validation.js`, `js/main.js`, `js/products.js`
- [x] Task 5.3: Lab 7 - Ứng dụng localStorage & sessionStorage làm giỏ hàng & thanh toán (`cart.html`, `checkout.html`, `js/cart.js`)
  - Acceptance: Module `TechGearCart` lưu trữ `techgear_cart`, `techgear_orders`, `techgear_coupon` (sessionStorage). Thêm/sửa/xóa sản phẩm, dọn sạch giỏ hàng, áp dụng voucher, tính toán subtotal/total. Trang `checkout.html` đọc giỏ hàng, validate thông tin nhận hàng, chọn COD/VietQR, lưu đơn hàng và hiển thị màn hình chúc mừng.
  - Verify: Dữ liệu giỏ hàng và đơn hàng tồn tại xuyên suốt các trang và sau khi reload.
  - Files: `cart.html`, `checkout.html`, `js/cart.js`, `css/components.css`
- [x] Task 5.4: Lab 8 - Chức năng Đăng ký, Đăng nhập có kiểm tra form & lưu trữ tài khoản (`register.html`, `js/validation.js`, `js/main.js`)
  - Acceptance: Form Đăng ký validate rỗng, họ tên, email (Regex), SĐT Việt Nam, mật khẩu, xác nhận mật khẩu, kiểm tra trùng lặp email với `localStorage` (`techgear_users`). Lưu user mới, tự động switch tab đăng nhập. Form Đăng nhập kiểm tra tài khoản, lưu phiên `techgear_current_user`, cập nhật Header hiển thị tên & avatar người dùng và nút Đăng xuất.
  - Verify: Đăng ký tài khoản mới và đăng nhập thành công, có sẵn tài khoản mẫu `student@fpt.edu.vn` / `password123`.
  - Files: `register.html`, `js/validation.js`, `js/main.js`

