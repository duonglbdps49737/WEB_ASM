/**
 * ==============================================================================
 * TechGear Store - Banner Slideshow Module (js/slider.js)
 * Assignment WEB1044 - Lập trình JavaScript cơ bản - FPT Polytechnic
 * ==============================================================================
 * Các tính năng chính:
 * 1. Tự động chuyển đổi slide sau mỗi khoảng thời gian định sẵn (4 giây).
 * 2. Nút bấm điều hướng Trước (Prev) và Sau (Next).
 * 3. Chấm tròn (Dots) báo hiệu vị trí slide và cho phép click chọn trực tiếp.
 * 4. Tạm dừng tự động khi rê chuột vào banner và chạy tiếp khi rê chuột ra.
 * 5. Bẫy lỗi DOM an toàn: Không gây lỗi Console nếu trang không chứa Slider.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBannerSlider();
});

function initBannerSlider() {
  // Lấy các phần tử liên quan trong DOM
  const sliderContainer = document.querySelector('.slider-container');
  const slides = document.querySelectorAll('.slider-slide');
  const prevBtn = document.querySelector('.slider-control--prev');
  const nextBtn = document.querySelector('.slider-control--next');
  const dotsContainer = document.querySelector('.slider-dots');

  // Kiểm tra nếu trang không có slider thì kết thúc hàm ngay lập tức
  if (!sliderContainer || slides.length === 0) {
    return;
  }

  // Khai báo các biến trạng thái
  let currentIndex = 0;
  const totalSlides = slides.length;
  const AUTO_PLAY_DELAY = 4000; // Thời gian chuyển slide: 4000ms = 4 giây
  let slideInterval = null;

  /**
   * Tạo các chấm tròn (Dots) tương ứng với số lượng slides
   */
  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = ''; // Làm sạch trước khi render
    dotsContainer.setAttribute('role', 'tablist');
    dotsContainer.setAttribute('aria-label', 'Danh sách điều hướng slide');

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.classList.add('slider-dot');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Xem slide số ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) dot.classList.add('active');

      // Bắt sự kiện click vào chấm tròn
      dot.addEventListener('click', () => {
        goToSlide(i);
        restartAutoPlay();
      });

      dotsContainer.appendChild(dot);
    }
  }

  /**
   * Cập nhật trạng thái hiển thị của slide và dot
   * @param {number} targetIndex - Chỉ số của slide cần hiển thị
   */
  function showSlide(targetIndex) {
    // Xử lý vòng lặp tròn (looping)
    if (targetIndex >= totalSlides) {
      currentIndex = 0;
    } else if (targetIndex < 0) {
      currentIndex = totalSlides - 1;
    } else {
      currentIndex = targetIndex;
    }

    // 1. Cập nhật Slide
    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    // 2. Cập nhật Dot
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  /**
   * Chuyển sang slide tiếp theo
   */
  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  /**
   * Quay lại slide phía trước
   */
  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  /**
   * Đi đến slide cụ thể
   * @param {number} index
   */
  function goToSlide(index) {
    showSlide(index);
  }

  /**
   * Bắt đầu tự động chuyển slide bằng setInterval
   */
  function startAutoPlay() {
    stopAutoPlay(); // Đảm bảo không bị lặp nhiều interval cùng lúc
    slideInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }

  /**
   * Dừng tự động chuyển slide bằng clearInterval
   */
  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  /**
   * Khởi động lại vòng lặp tự động sau khi người dùng tương tác thủ công
   */
  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // --- GẮN SỰ KIỆN (EVENT LISTENERS) ---

  // Gắn sự kiện cho nút Next
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoPlay();
    });
  }

  // Gắn sự kiện cho nút Prev
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoPlay();
    });
  }

  // Điều khiển bằng phím mũi tên (Keyboard Navigation WCAG)
  sliderContainer.setAttribute('tabindex', '0');
  sliderContainer.setAttribute('role', 'region');
  sliderContainer.setAttribute('aria-label', 'Banner khuyến mãi công nghệ');
  sliderContainer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      restartAutoPlay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      restartAutoPlay();
    }
  });

  // Tạm dừng khi rê chuột vào Slider và chạy lại khi rời chuột
  sliderContainer.addEventListener('mouseenter', stopAutoPlay);
  sliderContainer.addEventListener('mouseleave', startAutoPlay);

  // Tạm dừng khi focus vào bên trong Slider
  sliderContainer.addEventListener('focusin', stopAutoPlay);
  sliderContainer.addEventListener('focusout', startAutoPlay);

  // Khởi tạo ban đầu
  createDots();
  showSlide(0);
  startAutoPlay();
}
