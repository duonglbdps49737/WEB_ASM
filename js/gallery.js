/**
 * ==============================================================================
 * TechGear Store - Product Detail Gallery & Options (js/gallery.js)
 * Assignment WEB1044 - Lập trình JavaScript cơ bản - FPT Polytechnic
 * ==============================================================================
 * Các tính năng chính:
 * 1. Chuyển đổi ảnh chính khi nhấp vào các ảnh thu nhỏ (Thumbnails).
 * 2. Bộ chọn số lượng sản phẩm (+ / -) đảm bảo không giảm dưới 1.
 * 3. Lựa chọn màu sắc / cấu hình (Storage / Color pills).
 * 4. Bẫy lỗi DOM an toàn: Chỉ chạy khi các phần tử tồn tại.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductGallery();
  initQuantityPicker();
  initOptionPills();
});

/**
 * 1. Khởi tạo tính năng đổi ảnh chi tiết sản phẩm
 */
function initProductGallery() {
  const mainImage = document.getElementById('mainProductImg');
  const thumbnails = document.querySelectorAll('.gallery-thumb');

  if (!mainImage || thumbnails.length === 0) {
    return;
  }

  thumbnails.forEach((thumb, index) => {
    // Thêm hỗ trợ truy cập bàn phím (WCAG 2.1 AA)
    thumb.setAttribute('tabindex', '0');
    thumb.setAttribute('role', 'button');
    thumb.setAttribute('aria-label', `Xem chi tiết góc ảnh ${index + 1}`);

    function selectThumbnail() {
      const thumbImg = thumb.querySelector('img');
      if (!thumbImg) return;

      const newSrc = thumbImg.getAttribute('src');
      const newAlt = thumbImg.getAttribute('alt') || 'Ảnh chi tiết sản phẩm';

      // Hiệu ứng mờ nhẹ khi đổi ảnh
      mainImage.style.opacity = '0.3';
      mainImage.style.transform = 'scale(0.97)';

      setTimeout(() => {
        mainImage.setAttribute('src', newSrc);
        mainImage.setAttribute('alt', newAlt);
        mainImage.style.opacity = '1';
        mainImage.style.transform = 'scale(1)';
      }, 150);

      // Cập nhật class active cho thumbnail
      thumbnails.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    }

    thumb.addEventListener('click', selectThumbnail);
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectThumbnail();
      }
    });
  });
}

/**
 * 2. Khởi tạo bộ đếm số lượng (+/-)
 */
function initQuantityPicker() {
  const minusBtns = document.querySelectorAll('.qty-minus');
  const plusBtns = document.querySelectorAll('.qty-plus');
  const qtyInputs = document.querySelectorAll('.qty-input');

  // Nút Giảm số lượng
  minusBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const container = this.closest('.qty-picker') || this.parentElement;
      const input = container.querySelector('.qty-input');
      if (input) {
        let currentValue = parseInt(input.value, 10) || 1;
        if (currentValue > 1) {
          input.value = currentValue - 1;
          // Kích hoạt sự kiện change nếu cần cập nhật lại tổng tiền
          input.dispatchEvent(new Event('change'));
        }
      }
    });
  });

  // Nút Tăng số lượng
  plusBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const container = this.closest('.qty-picker') || this.parentElement;
      const input = container.querySelector('.qty-input');
      if (input) {
        let currentValue = parseInt(input.value, 10) || 1;
        if (currentValue < 99) {
          input.value = currentValue + 1;
          input.dispatchEvent(new Event('change'));
        }
      }
    });
  });

  // Kiểm soát khi người dùng gõ trực tiếp vào ô input
  qtyInputs.forEach((input) => {
    input.addEventListener('change', function () {
      let val = parseInt(this.value, 10);
      if (isNaN(val) || val < 1) {
        this.value = 1;
      } else if (val > 99) {
        this.value = 99;
      }
    });
  });
}

/**
 * 3. Khởi tạo lựa chọn phiên bản / màu sắc
 */
function initOptionPills() {
  const optionGroups = document.querySelectorAll('.option-pills');

  optionGroups.forEach((group) => {
    const pills = group.querySelectorAll('.option-pill');
    pills.forEach((pill) => {
      // Hỗ trợ bàn phím cho các nút chọn cấu hình
      pill.setAttribute('tabindex', '0');
      pill.setAttribute('role', 'button');

      function selectPill() {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
      }

      pill.addEventListener('click', selectPill);
      pill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectPill();
        }
      });
    });
  });
}
