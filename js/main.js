/**
 * ==============================================================================
 * TechGear Store - Main Helper & UI Utilities (js/main.js)
 * Môn học: WEB1044 - Lập trình JavaScript cơ bản - FPT Polytechnic
 * ==============================================================================
 * ĐÁP ỨNG TIÊU CHÍ CỐT LÕI:
 * - LAB 6: Xử lý các sự kiện đa dạng:
 *          + Sự kiện 'click': Mở/đóng mobile menu drawer, cuộn lên top, mở dropdown user
 *          + Sự kiện 'scroll': Ẩn/hiện nút Back to Top khi cuộn trang > 300px
 *          + Sự kiện 'submit': Tìm kiếm sản phẩm
 *          + Sự kiện 'keydown': Nhấn phím Escape để đóng nhanh menu / dropdown
 * - LAB 8: Quản lý trạng thái Đăng nhập / Đăng xuất trên Header toàn trang (localStorage)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initBackToTop();
  initSearchHandler();
  initProductFilters();
  initUserAuthHeader();
  initKeyboardShortcuts();
});

/**
 * 1. LAB 8: Quản lý trạng thái Đăng Nhập / Đăng Xuất trên Site Header
 * Đọc dữ liệu từ localStorage ('techgear_current_user') và cập nhật giao diện
 */
function initUserAuthHeader() {
  updateUserHeaderUI();
}

function updateUserHeaderUI() {
  // Ưu tiên Reusable Component Engine nếu đang hoạt động
  if (window.TechGearComponents && typeof window.TechGearComponents.syncAll === 'function') {
    window.TechGearComponents.syncAll();
    return;
  }

  const headerActions = document.querySelector('.header-actions');
  if (!headerActions) return;

  const storage = window.TechGearStorage || localStorage;
  const currentUserRaw = storage.getItem('techgear_current_user');
  let currentUser = null;
  if (currentUserRaw) {
    try {
      currentUser = JSON.parse(currentUserRaw);
    } catch (e) {
      currentUser = null;
    }
  }

  // Tìm nút tài khoản hiện tại trong header
  let userContainer = headerActions.querySelector('.user-action-container');
  if (!userContainer) {
    // Nếu chưa bọc thì tìm thẻ a trỏ về register.html
    const oldLink = headerActions.querySelector('a[href="register.html"]');
    userContainer = document.createElement('div');
    userContainer.className = 'user-action-container';
    if (oldLink) {
      oldLink.parentNode.insertBefore(userContainer, oldLink);
      oldLink.remove();
    } else {
      headerActions.prepend(userContainer);
    }
  }

  if (currentUser) {
    // ĐÃ ĐĂNG NHẬP: Hiển thị avatar, tên người dùng và dropdown đăng xuất
    const initials = currentUser.fullname
      ? currentUser.fullname.split(' ').pop().charAt(0).toUpperCase()
      : 'U';

    userContainer.innerHTML = `
      <div class="user-menu-wrapper">
        <!-- LAB 6: Sự kiện click mở dropdown tài khoản -->
        <button type="button" class="user-logged-btn" id="userMenuToggle" aria-haspopup="true" aria-expanded="false">
          <div class="user-logged-avatar">${initials}</div>
          <div class="action-btn__text" style="text-align: left;">
            <span class="action-btn__label" style="font-size: 0.75rem;">Xin chào</span>
            <span class="action-btn__value" style="max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${currentUser.fullname}
            </span>
          </div>
          <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem; color: var(--text-muted); margin-left: 4px;"></i>
        </button>

        <div class="user-dropdown-popover" id="userDropdownPopover" role="menu">
          <div class="user-dropdown-header">
            <div class="user-dropdown-name">${currentUser.fullname}</div>
            <div class="user-dropdown-email">${currentUser.email}</div>
          </div>
          <ul class="user-dropdown-links">
            <li>
              <a href="cart.html"><i class="fa-solid fa-box-archive"></i> Đơn hàng & Giỏ hàng</a>
            </li>
            <li>
              <a href="contact.html"><i class="fa-solid fa-headset"></i> Trung tâm hỗ trợ VIP</a>
            </li>
            <li class="logout-item">
              <!-- LAB 6: Sự kiện click Đăng xuất -->
              <button type="button" id="btnLogoutUser">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng Xuất Tài Khoản
              </button>
            </li>
          </ul>
        </div>
      </div>
    `;

    // Gắn sự kiện click mở menu popover
    const toggleBtn = document.getElementById('userMenuToggle');
    const popover = document.getElementById('userDropdownPopover');
    const logoutBtn = document.getElementById('btnLogoutUser');

    if (toggleBtn && popover) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = popover.classList.contains('show');
        popover.classList.toggle('show', !isOpen);
        toggleBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });

      // Đóng popover khi click ra ngoài
      document.addEventListener('click', () => {
        popover.classList.remove('show');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    }

    // Xử lý sự kiện Đăng xuất
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        const storage = window.TechGearStorage || localStorage;
        storage.removeItem('techgear_current_user');
        window.dispatchEvent(new CustomEvent('techgear:statechange', { detail: { type: 'auth' } }));
        if (typeof window.showToast === 'function') {
          window.showToast('Đăng xuất', 'Bạn đã đăng xuất tài khoản thành công.', 'info');
        } else {
          alert('Đã đăng xuất tài khoản.');
        }
        if (window.TechGearComponents && typeof window.TechGearComponents.syncAll === 'function') {
          TechGearComponents.syncAll();
        } else {
          updateUserHeaderUI();
        }
      });
    }

  } else {
    // CHƯA ĐĂNG NHẬP: Hiển thị nút liên kết Đăng ký / Đăng nhập
    userContainer.innerHTML = `
      <a href="register.html" class="action-btn">
        <div class="action-btn__icon"><i class="fa-regular fa-user"></i></div>
        <div class="action-btn__text">
          <span class="action-btn__label">Xin chào</span>
          <span class="action-btn__value">Tài khoản</span>
        </div>
      </a>
    `;
  }

  // Cập nhật văn bản trên thanh Menu Navigation ở mọi trang
  const navAuthLinks = document.querySelectorAll('.nav-menu__link[href="register.html"]');
  navAuthLinks.forEach(link => {
    if (currentUser) {
      link.innerHTML = `<i class="fa-solid fa-circle-user"></i> Tài Khoản`;
    } else {
      link.innerHTML = `<i class="fa-solid fa-user-plus"></i> Đăng Ký / Đăng Nhập`;
    }
  });

  // Nếu đang ở trang register.html thì gọi checkUserAuthStateOnPage()
  if (typeof window.checkUserAuthStateOnPage === 'function') {
    window.checkUserAuthStateOnPage();
  }
}

// Đăng ký toàn cục để validation.js gọi sau khi đăng nhập
window.updateUserHeaderUI = updateUserHeaderUI;

/**
 * 2. LAB 6: Sự kiện click mở/đóng Menu Drawer Mobile
 */
function initMobileMenu() {
  // Nếu đã dùng Reusable Components, TechGearComponents đã gắn và quản lý sự kiện này
  if (window.TechGearComponents) return;

  const toggleBtn = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  let overlay = document.querySelector('.nav-overlay');

  if (!toggleBtn || !mainNav) return;

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    mainNav.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mainNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mainNav.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  const navLinks = mainNav.querySelectorAll('.nav-menu__link');
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * 3. LAB 6: Sự kiện scroll - Nút Cuộn lên đầu trang (Back to Top)
 */
function initBackToTop() {
  let backToTopBtn = document.getElementById('backToTop');

  if (!backToTopBtn) {
    backToTopBtn = document.createElement('div');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);
  }

  // LAB 6: Sự kiện scroll trên cửa sổ trình duyệt
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // LAB 6: Sự kiện click cuộn lên đầu trang
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/**
 * 4. Hàm hiển thị thông báo Toast toàn cục
 */
window.showToast = function (title, message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  let iconClass = 'fa-solid fa-circle-info';
  if (type === 'success') iconClass = 'fa-solid fa-circle-check';
  if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

  toast.innerHTML = `
    <div class="toast__icon">
      <i class="${iconClass}"></i>
    </div>
    <div class="toast__content">
      <div class="toast__title">${title}</div>
      <div class="toast__message">${message}</div>
    </div>
    <div class="toast__close">&times;</div>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast__close');
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });

  setTimeout(() => {
    removeToast(toast);
  }, 3500);

  function removeToast(elem) {
    elem.style.opacity = '0';
    elem.style.transform = 'translateX(50px)';
    setTimeout(() => {
      if (elem.parentNode) elem.parentNode.removeChild(elem);
    }, 300);
  }
};

/**
 * 5. LAB 6: Sự kiện submit form tìm kiếm sản phẩm
 */
function initSearchHandler() {
  const searchForm = document.querySelector('.header-search__form');
  const searchInput = document.querySelector('.header-search__input');

  if (!searchForm || !searchInput) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.showToast('Tìm kiếm', `Đang tìm các sản phẩm phù hợp với: "${query}"`, 'info');
      setTimeout(() => {
        const targetUrl = `products.html?q=${encodeURIComponent(query)}`;
        if (window.TechGearStorage && typeof window.TechGearStorage.navigate === 'function') {
          window.TechGearStorage.navigate(targetUrl);
        } else {
          window.location.href = targetUrl;
        }
      }, 400);
    } else {
      window.showToast('Tìm kiếm', 'Vui lòng nhập từ khóa sản phẩm cần tìm!', 'error');
    }
  });
}

/**
 * 6. LAB 6: Khởi tạo bộ lọc sản phẩm (Shop Filters)
 * Quản lý tập trung trong module js/products.js
 */
function initProductFilters() {
  // Logic sự kiện lọc change/click và nút Đặt lại đã được khởi tạo bởi initShopFilters() (js/products.js)
}

/**
 * 7. LAB 6: Sự kiện keydown - Phím Escape đóng Drawer và Modal
 */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const mainNav = document.querySelector('.main-nav');
      const overlay = document.querySelector('.nav-overlay');
      const userPopover = document.getElementById('userDropdownPopover');

      if (mainNav && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      if (userPopover && userPopover.classList.contains('show')) {
        userPopover.classList.remove('show');
      }
    }
  });
}
