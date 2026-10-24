/**
 * ==============================================================================
 * TechGear Store - Reusable UI Components System (js/components.js)
 * Triết lý: "Viết một lần dùng nhiều nơi" (DRY - Single Source of Truth)
 * Môn học: WEB1044 - Lập trình JavaScript cơ bản - FPT Polytechnic
 * ==============================================================================
 * Module này cung cấp:
 * 1. Khung Header đồng nhất 100% cho tất cả các trang (TopBar, Logo, Search, User, Cart, Nav, Drawer).
 * 2. Khung Footer đồng nhất 100% chuẩn 4 cột thương mại điện tử.
 * 3. Tự động nhận diện trang hiện tại và kích hoạt trạng thái "active" trên menu.
 * 4. ĐỒNG BỘ THỜI GIAN THỰC (Realtime State Sync):
 *    - Đồng bộ giỏ hàng và tài khoản đa tab (Cross-tab via 'storage' event)
 *    - Đồng bộ khi chuyển tab / focus lại trang (Page Visibility & Focus)
 *    - Đồng bộ khi khôi phục trang từ BFCache (pageshow event)
 */

const TechGearComponents = {
  /**
   * Sinh mã HTML cho khối tài khoản người dùng trên Header (Tài khoản & Cửa sổ Popover)
   * @param {Object|null} currentUser
   */
  getUserActionHTML: function (currentUser) {
    if (currentUser) {
      const initials = currentUser.fullname
        ? currentUser.fullname.split(' ').pop().charAt(0).toUpperCase()
        : 'U';

      return `
        <div class="user-menu-wrapper" id="userMenuWrapper">
          <button type="button" class="user-logged-btn" id="userMenuToggle" aria-haspopup="true" aria-expanded="false" title="Tài khoản ${currentUser.fullname}">
            <div class="user-logged-avatar">${initials}</div>
            <div class="action-btn__text" style="text-align: left;">
              <span class="action-btn__label" style="font-size: 0.72rem;">Xin chào</span>
              <span class="action-btn__value" style="max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${currentUser.fullname}
              </span>
            </div>
            <i class="fa-solid fa-chevron-down" style="font-size: 0.72rem; color: var(--text-muted); margin-left: 4px;"></i>
          </button>

          <!-- Cửa sổ bật ra khi ấn vào icon người dùng (LAB 8) -->
          <div class="user-dropdown-popover" id="userDropdownPopover" role="menu">
            <div class="user-dropdown-header">
              <div class="user-dropdown-name">${currentUser.fullname}</div>
              <div class="user-dropdown-email">${currentUser.email}</div>
            </div>
            <ul class="user-dropdown-links">
              <li>
                <a href="register.html"><i class="fa-solid fa-id-card"></i> Hồ Sơ Tài Khoản</a>
              </li>
              <li>
                <a href="cart.html"><i class="fa-solid fa-bag-shopping"></i> Giỏ Hàng Của Bạn</a>
              </li>
              <li>
                <a href="checkout.html"><i class="fa-solid fa-receipt"></i> Đơn Hàng & Thanh Toán</a>
              </li>
              <li>
                <a href="contact.html"><i class="fa-solid fa-headset"></i> Trung Tâm Trợ Giúp</a>
              </li>
              <li class="logout-item">
                <button type="button" id="btnLogoutHeader">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng Xuất Tài Khoản
                </button>
              </li>
            </ul>
          </div>
        </div>
      `;
    }

    // Trạng thái Khách chưa đăng nhập
    return `
      <div class="user-menu-wrapper" id="userMenuWrapper">
        <button type="button" class="user-logged-btn user-guest-btn" id="userMenuToggle" aria-haspopup="true" aria-expanded="false" title="Tài khoản / Đăng nhập">
          <div class="user-logged-avatar user-guest-avatar">
            <i class="fa-regular fa-user"></i>
          </div>
          <div class="action-btn__text" style="text-align: left;">
            <span class="action-btn__label" style="font-size: 0.72rem;">Xin chào</span>
            <span class="action-btn__value" style="font-size: 0.88rem;">Tài khoản</span>
          </div>
          <i class="fa-solid fa-chevron-down" style="font-size: 0.72rem; color: var(--text-muted); margin-left: 4px;"></i>
        </button>

        <!-- Cửa sổ bật ra khi ấn vào icon tài khoản (Khách) -->
        <div class="user-dropdown-popover" id="userDropdownPopover" role="menu">
          <div class="user-dropdown-header">
            <div class="user-dropdown-name">Chào mừng đến với TechGear</div>
            <div class="user-dropdown-email">Đăng nhập để nhận ưu đãi thành viên</div>
          </div>
          <div style="padding: 12px 16px 8px;">
            <a href="register.html?mode=login" class="btn btn-primary btn-sm btn-block" style="margin-bottom: 8px; width: 100%; text-align: center; justify-content: center;">
              <i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập
            </a>
            <a href="register.html?mode=register" class="btn btn-outline btn-sm btn-block" style="width: 100%; text-align: center; justify-content: center;">
              <i class="fa-solid fa-user-plus"></i> Đăng Ký Tài Khoản
            </a>
          </div>
          <ul class="user-dropdown-links" style="border-top: 1px solid var(--border-color); margin-top: 6px;">
            <li>
              <button type="button" id="btnQuickDemoLogin" style="color: var(--primary-color); font-weight: 600;">
                <i class="fa-solid fa-bolt"></i> Đăng nhập mẫu: Sinh Viên FPT
              </button>
            </li>
            <li>
              <a href="cart.html"><i class="fa-solid fa-bag-shopping"></i> Giỏ Hàng Của Bạn</a>
            </li>
            <li>
              <a href="contact.html"><i class="fa-solid fa-headset"></i> Trung Tâm Trợ Giúp</a>
            </li>
          </ul>
        </div>
      </div>
    `;
  },

  /**
   * Sinh mã HTML cho Popover Giỏ Hàng mini xổ xuống kiểu Shopee
   */
  getMiniCartHTML: function () {
    const storage = window.TechGearStorage || localStorage;
    let cart = [];
    try {
      cart = JSON.parse(storage.getItem('techgear_cart')) || [];
    } catch (e) {
      cart = [];
    }

    if (cart.length === 0) {
      return `
        <div class="cart-popover-header">
          <span><i class="fa-solid fa-bag-shopping"></i> Giỏ Hàng Của Bạn</span>
        </div>
        <div class="cart-popover-empty">
          <i class="fa-solid fa-cart-arrow-down"></i>
          <p>Chưa có sản phẩm nào trong giỏ hàng</p>
          <a href="products.html" class="btn btn-outline btn-sm">Khám Phá Mua Sắm Ngay</a>
        </div>
      `;
    }

    const totalQty = cart.reduce((sum, item) => sum + (item.soLuong || 1), 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.gia * (item.soLuong || 1)), 0);
    const priceText = typeof dinhDangTien === 'function' ? dinhDangTien(subtotal) : `${subtotal.toLocaleString('vi-VN')}đ`;

    let itemsHTML = '';
    // Lấy tối đa 5 sản phẩm mới nhất trong giỏ hàng
    const recentItems = cart.slice(-5).reverse();
    recentItems.forEach(item => {
      const itemPrice = typeof dinhDangTien === 'function' ? dinhDangTien(item.gia) : `${item.gia.toLocaleString('vi-VN')}đ`;
      itemsHTML += `
        <li>
          <a href="detail.html?id=${item.id}" class="cart-popover-item" title="Xem chi tiết ${item.ten}">
            <img src="${item.hinhAnh}" alt="${item.ten}" class="cart-popover-img">
            <div class="cart-popover-info">
              <div class="cart-popover-name">${item.ten}</div>
              <div class="cart-popover-meta">${item.bienThe || 'Chính Hãng VN/A'}</div>
            </div>
            <div class="cart-popover-price">
              ${itemPrice}
              <div class="cart-popover-qty">x ${item.soLuong || 1}</div>
            </div>
          </a>
        </li>
      `;
    });

    return `
      <div class="cart-popover-header">
        <span><i class="fa-solid fa-bag-shopping"></i> Sản Phẩm Mới Thêm</span>
        <span style="font-size: 0.74rem; font-weight: 600; color: var(--primary-color);">${totalQty} món</span>
      </div>
      <ul class="cart-popover-list">
        ${itemsHTML}
      </ul>
      <div class="cart-popover-footer">
        <div class="cart-popover-total">
          Tạm tính: <strong>${priceText}</strong>
        </div>
        <a href="cart.html" class="btn btn-primary btn-sm">
          Xem Giỏ Hàng <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    `;
  },

  /**
   * Sinh mã HTML cho nút Giỏ hàng kèm Popover xổ danh sách kiểu Shopee
   */
  getCartActionHTML: function (cartTotals) {
    const priceText = typeof dinhDangTien === 'function' && cartTotals.subtotal > 0
      ? dinhDangTien(cartTotals.subtotal)
      : (cartTotals.subtotal > 0 ? `${cartTotals.subtotal.toLocaleString('vi-VN')}đ` : '0đ');

    return `
      <div class="cart-menu-wrapper" id="cartMenuWrapper">
        <a href="cart.html" class="action-btn header-cart-btn" id="headerCartBtn" aria-haspopup="true" aria-expanded="false" title="Giỏ hàng của bạn">
          <div class="action-btn__icon">
            <i class="fa-solid fa-cart-shopping"></i>
            <span class="action-btn__badge">${cartTotals.count}</span>
          </div>
          <div class="action-btn__text">
            <span class="action-btn__label">Giỏ hàng</span>
            <span class="action-btn__value">${priceText}</span>
          </div>
        </a>

        <!-- CỬA SỔ POPUP MINI CART KIỂU SHOPEE -->
        <div class="cart-dropdown-popover" id="cartDropdownPopover" role="menu">
          ${this.getMiniCartHTML()}
        </div>
      </div>
    `;
  },

  /**
   * Lấy tổng tiền và số lượng giỏ hàng hiện tại một cách an toàn
   */
  getCartTotals: function () {
    if (window.TechGearCart && typeof window.TechGearCart.calculateTotals === 'function') {
      return window.TechGearCart.calculateTotals();
    }
    try {
      const storage = window.TechGearStorage || localStorage;
      const rawCart = JSON.parse(storage.getItem('techgear_cart')) || [];
      return {
        count: rawCart.reduce((sum, item) => sum + (item.soLuong || 1), 0),
        subtotal: rawCart.reduce((sum, item) => sum + (item.gia * (item.soLuong || 1)), 0)
      };
    } catch (e) {
      return { count: 0, subtotal: 0 };
    }
  },

  /**
   * 1. Sinh mã HTML cho toàn bộ Hệ Thống Header & Navigation
   * @param {string} activeKey - 'home' | 'products' | 'detail' | 'cart' | 'checkout' | 'contact' | 'auth'
   */
  getHeaderHTML: function (activeKey = 'home') {
    // 1. Kiểm tra trạng thái đăng nhập từ TechGearStorage / localStorage (LAB 8)
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

    // 2. Kiểm tra giỏ hàng từ localStorage (LAB 7)
    const cartTotals = this.getCartTotals();

    // 3. Khối hiển thị người dùng và giỏ hàng trên Header
    const userActionHTML = this.getUserActionHTML(currentUser);
    const cartActionHTML = this.getCartActionHTML(cartTotals);

    return `
      <!-- 1. TOP BAR ĐỒNG NHẤT -->
      <div class="top-bar">
        <div class="container top-bar__inner">
          <div class="top-bar__left">
            <div class="top-bar__item">
              <i class="fa-solid fa-phone-volume"></i>
              <span>Hotline: <strong>1900 6868</strong> (08:00 - 21:30)</span>
            </div>
            <div class="top-bar__item">
              <i class="fa-solid fa-truck-fast"></i>
              <span>Miễn phí giao hàng đơn từ 500.000đ</span>
            </div>
          </div>
          <div class="top-bar__right">
            <div class="top-bar__item">
              <i class="fa-solid fa-boxes-stacked"></i>
              <a href="products.html" class="top-bar__link">Tất Cả Sản Phẩm</a>
            </div>
            <div class="top-bar__item">
              <i class="fa-solid fa-location-dot"></i>
              <a href="contact.html" class="top-bar__link">Showroom FPT Poly</a>
            </div>
            <div class="top-bar__item">
              <i class="fa-solid fa-headset"></i>
              <a href="contact.html" class="top-bar__link">Liên Hệ & Góp Ý</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. SITE HEADER CHÍNH (Thiết kế hiện đại, tinh gọn theo chuẩn sàn TMĐT) -->
      <div class="site-header">
        <div class="container header-main">
          <div class="header-main__inner">
            <!-- Nút Hamburger Menu Mobile (Chỉ hiện trên mobile) -->
            <button type="button" class="mobile-toggle" id="mobileMenuBtn" aria-label="Mở menu điều hướng">
              <i class="fa-solid fa-bars"></i>
            </button>

            <!-- Logo Cửa Hàng (Nhấn vào là trở về Trang Chủ) -->
            <a href="index.html" class="site-logo" title="Trang chủ TechGear Store">
              <div class="site-logo__icon"><i class="fa-solid fa-microchip"></i></div>
              <span>Tech</span>Gear
            </a>

            <!-- Thanh Tìm Kiếm + Gợi Ý Danh Mục Nhanh Kiểu Shopee -->
            <div class="header-search">
              <form class="header-search__form" action="products.html" method="GET">
                <input type="text" name="q" class="header-search__input" placeholder="Tìm kiếm điện thoại, laptop, phụ kiện công nghệ..." autocomplete="off">
                <button type="submit" class="header-search__btn" aria-label="Tìm kiếm">
                  <i class="fa-solid fa-magnifying-glass"></i>
                </button>
              </form>
              <div class="header-search__tags">
                <a href="products.html?category=dienthoai">Điện thoại</a>
                <a href="products.html?category=laptop">Laptop</a>
                <a href="products.html?category=tainghe">Tai nghe</a>
                <a href="products.html?category=dongho">Đồng hồ</a>
                <a href="products.html?category=banphim">Bàn phím cơ</a>
                <a href="products.html?category=maytinhbang">Máy tính bảng</a>
                <a href="products.html" class="tag-highlight">Khám phá tất cả <i class="fa-solid fa-arrow-right"></i></a>
              </div>
            </div>

            <!-- Các Hành Động: Tài Khoản & Giỏ Hàng Có Dropdown Popover -->
            <div class="header-actions">
              <div class="user-action-container">
                ${userActionHTML}
              </div>

              <!-- Giỏ Hàng Kiểu Shopee (Xổ Popup Danh Sách) -->
              <div class="cart-action-container">
                ${cartActionHTML}
              </div>
            </div>
          </div>
        </div>

        <!-- 3. MOBILE MENU DRAWER (Chỉ hoạt động khi mở trên điện thoại / tablet) -->
        <nav class="main-nav" id="mainNav" aria-label="Mobile Navigation Drawer">
          <div class="mobile-nav-header" style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border-color);">
            <div class="site-logo" style="font-size: 1.3rem;">
              <div class="site-logo__icon" style="width: 32px; height: 32px; font-size: 1rem;"><i class="fa-solid fa-microchip"></i></div>
              <span>Tech</span>Gear
            </div>
            <button type="button" id="mobileDrawerClose" style="background: none; border: none; font-size: 1.3rem; color: var(--text-muted); cursor: pointer;" aria-label="Đóng menu">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <ul class="nav-menu" style="flex-direction: column; align-items: stretch; gap: 4px;">
            <li class="nav-menu__item">
              <a href="index.html" class="nav-menu__link"><i class="fa-solid fa-house"></i> Trang Chủ</a>
            </li>
            <li class="nav-menu__item">
              <a href="products.html" class="nav-menu__link"><i class="fa-solid fa-boxes-stacked"></i> Tất Cả Sản Phẩm</a>
            </li>
            <li class="nav-menu__item">
              <a href="products.html?category=dienthoai" class="nav-menu__link"><i class="fa-solid fa-mobile-screen-button"></i> Điện Thoại</a>
            </li>
            <li class="nav-menu__item">
              <a href="products.html?category=laptop" class="nav-menu__link"><i class="fa-solid fa-laptop"></i> Laptop & MacBook</a>
            </li>
            <li class="nav-menu__item">
              <a href="products.html?category=tainghe" class="nav-menu__link"><i class="fa-solid fa-headphones"></i> Tai Nghe & Âm Thanh</a>
            </li>
            <li class="nav-menu__item">
              <a href="products.html?category=banphim" class="nav-menu__link"><i class="fa-solid fa-keyboard"></i> Phụ Kiện Gaming</a>
            </li>
            <li class="nav-menu__item" style="border-top: 1px solid var(--border-color); margin-top: 8px; padding-top: 8px;">
              <a href="cart.html" class="nav-menu__link"><i class="fa-solid fa-bag-shopping"></i> Giỏ Hàng Của Bạn</a>
            </li>
            <li class="nav-menu__item">
              <a href="register.html" class="nav-menu__link"><i class="fa-solid fa-circle-user"></i> Quản Lý Tài Khoản</a>
            </li>
            <li class="nav-menu__item">
              <a href="contact.html" class="nav-menu__link"><i class="fa-solid fa-headset"></i> Hỗ Trợ & Liên Hệ</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Lớp Phủ Mờ Khi Mở Menu Mobile -->
      <div class="nav-overlay" id="navOverlay"></div>
    `;
  },

  /**
   * 2. Sinh mã HTML cho Footer Đồng Nhất 4 Cột
   */
  getFooterHTML: function () {
    return `
      <div class="footer-top">
        <div class="container footer-grid">
          <!-- Cột 1: Thông tin thương hiệu & Showroom -->
          <div>
            <h3 class="footer-col__title">Về TechGear Store</h3>
            <p class="footer-desc">Hệ thống phân phối ủy quyền thiết bị công nghệ & phụ kiện cao cấp chính hãng hàng đầu tại Việt Nam.</p>
            <div style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-top: 12px;">
              <div><i class="fa-solid fa-location-dot" style="color: var(--primary-color); width: 18px;"></i> Tòa nhà FPT Polytechnic, Phố Trịnh Văn Bô, Nam Từ Liêm, Hà Nội.</div>
              <div style="margin-top: 6px;"><i class="fa-solid fa-phone" style="color: var(--primary-color); width: 18px;"></i> Hotline: <strong>1900 6868</strong> (Miễn phí)</div>
              <div style="margin-top: 6px;"><i class="fa-solid fa-envelope" style="color: var(--primary-color); width: 18px;"></i> Email: support@techgear.poly.vn</div>
            </div>
          </div>

          <!-- Cột 2: Chính sách mua hàng -->
          <div>
            <h3 class="footer-col__title">Chính Sách & Hỗ Trợ</h3>
            <div class="footer-links">
              <a href="contact.html"><i class="fa-solid fa-chevron-right"></i> Chính sách bảo hành 1 đổi 1</a>
              <a href="contact.html"><i class="fa-solid fa-chevron-right"></i> Chính sách vận chuyển siêu tốc 2H</a>
              <a href="contact.html"><i class="fa-solid fa-chevron-right"></i> Bảo mật thông tin khách hàng</a>
              <a href="contact.html"><i class="fa-solid fa-chevron-right"></i> Hướng dẫn mua hàng & thanh toán</a>
            </div>
          </div>

          <!-- Cột 3: Liên kết nhanh -->
          <div>
            <h3 class="footer-col__title">Liên Kết Nhanh</h3>
            <div class="footer-links">
              <a href="index.html"><i class="fa-solid fa-chevron-right"></i> Trang chủ TechGear</a>
              <a href="products.html"><i class="fa-solid fa-chevron-right"></i> Danh sách sản phẩm khuyến mãi</a>
              <a href="cart.html"><i class="fa-solid fa-chevron-right"></i> Giỏ hàng của bạn</a>
              <a href="checkout.html"><i class="fa-solid fa-chevron-right"></i> Thanh toán đơn hàng</a>
              <a href="register.html"><i class="fa-solid fa-chevron-right"></i> Quản lý tài khoản thành viên VIP</a>
            </div>
          </div>

          <!-- Cột 4: Đăng ký nhận tin & Mạng xã hội -->
          <div>
            <h3 class="footer-col__title">Đăng Ký Nhận Tin</h3>
            <p class="footer-desc">Đăng ký để nhận ngay Voucher 500.000đ cho đơn hàng đầu tiên và cập nhật ưu đãi công nghệ mới nhất.</p>
            <form class="newsletter-form" onsubmit="event.preventDefault(); window.showToast('Đăng ký nhận tin', 'Cảm ơn bạn đã đăng ký nhận bản tin khuyến mãi!', 'success'); this.reset();">
              <input type="email" class="newsletter-input" placeholder="Nhập địa chỉ email của bạn..." required>
              <button type="submit" class="newsletter-btn">Gửi</button>
            </form>
            <div class="footer-socials">
              <a href="#" class="social-link" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#" class="social-link" aria-label="Youtube"><i class="fa-brands fa-youtube"></i></a>
              <a href="#" class="social-link" aria-label="Tiktok"><i class="fa-brands fa-tiktok"></i></a>
              <a href="#" class="social-link" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>

      <!-- Chân trang dưới cùng -->
      <div class="footer-bottom">
        <div class="container footer-bottom__inner">
          <div>
            &copy; 2026 TechGear Store - Assignment Môn WEB1044 (Lập trình JavaScript cơ bản - FPT Polytechnic).
          </div>
          <div class="payment-methods">
            <i class="fa-brands fa-cc-visa" title="Visa"></i>
            <i class="fa-brands fa-cc-mastercard" title="Mastercard"></i>
            <i class="fa-brands fa-cc-apple-pay" title="Apple Pay"></i>
            <i class="fa-solid fa-qrcode" title="VietQR"></i>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 3. Khởi tạo và gắn toàn bộ giao diện cho Header và Footer
   */
  init: function () {
    // 1. Render Header
    const headerEl = document.getElementById('siteHeader');
    if (headerEl) {
      const activeKey = headerEl.getAttribute('data-active') || this.detectActivePage();
      headerEl.innerHTML = this.getHeaderHTML(activeKey);
    }

    // 2. Render Footer
    const footerEl = document.getElementById('siteFooter');
    if (footerEl) {
      footerEl.innerHTML = this.getFooterHTML();
    }

    // 3. Gắn các sự kiện tương tác
    this.attachHeaderEvents();

    // 4. Đồng bộ lại liên kết nội bộ trên môi trường file:///
    if (window.TechGearStorage && typeof window.TechGearStorage.refreshInternalLinks === 'function') {
      window.TechGearStorage.refreshInternalLinks();
    }
  },

  /**
   * Tự động nhận diện trang dựa vào URL nếu không có data-active
   */
  detectActivePage: function () {
    const path = window.location.pathname;
    if (path.endsWith('products.html')) return 'products';
    if (path.endsWith('detail.html')) return 'detail';
    if (path.endsWith('cart.html')) return 'cart';
    if (path.endsWith('checkout.html')) return 'checkout';
    if (path.endsWith('contact.html')) return 'contact';
    if (path.endsWith('register.html')) return 'auth';
    return 'home';
  },

  /**
   * Gắn các sự kiện click, dropdown, drawer trên Header
   */
  attachHeaderEvents: function () {
    // 1. Toggle Mobile Drawer
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileClose = document.getElementById('mobileDrawerClose');
    const mainNav = document.getElementById('mainNav');
    const navOverlay = document.getElementById('navOverlay');

    if (mobileBtn && mainNav) {
      function openMenu() {
        mainNav.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeMenu() {
        mainNav.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      mobileBtn.onclick = function (e) {
        e.stopPropagation();
        if (mainNav.classList.contains('active')) closeMenu();
        else openMenu();
      };

      if (mobileClose) mobileClose.onclick = closeMenu;
      if (navOverlay) navOverlay.onclick = closeMenu;

      const navLinks = mainNav.querySelectorAll('.nav-menu__link');
      navLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // 2. Gắn sự kiện cho dropdown tài khoản (bật ra popup)
    this.attachUserDropdownEvents();

    // 3. Gắn sự kiện cho popup giỏ hàng kiểu Shopee
    this.attachCartDropdownEvents();
  },

  /**
   * Gắn sự kiện cho dropdown giỏ hàng mini kiểu Shopee
   */
  attachCartDropdownEvents: function () {
    const cartWrapper = document.getElementById('cartMenuWrapper');
    const cartPopover = document.getElementById('cartDropdownPopover');
    const cartBtn = document.getElementById('headerCartBtn');

    if (!cartWrapper || !cartPopover) return;

    if (cartBtn) {
      cartBtn.onclick = function (e) {
        // Trên thiết bị mobile / touch, chạm vào nút giỏ hàng sẽ toggle popover trước nếu chưa mở
        if (window.innerWidth <= 768) {
          const isOpen = cartPopover.classList.contains('show');
          if (!isOpen) {
            e.preventDefault();
            e.stopPropagation();
            cartPopover.classList.add('show');
            cartBtn.setAttribute('aria-expanded', 'true');
          }
        }
      };
    }

    document.addEventListener('click', function (e) {
      if (cartWrapper && !cartWrapper.contains(e.target)) {
        cartPopover.classList.remove('show');
        if (cartBtn) cartBtn.setAttribute('aria-expanded', 'false');
      }
    });
  },

  /**
   * Gắn sự kiện cho user dropdown popover và nút đăng xuất
   */
  attachUserDropdownEvents: function () {
    const userToggle = document.getElementById('userMenuToggle');
    const userPopover = document.getElementById('userDropdownPopover');
    const logoutBtn = document.getElementById('btnLogoutHeader');
    const quickDemoBtn = document.getElementById('btnQuickDemoLogin');

    if (userToggle && userPopover) {
      userToggle.onclick = function (e) {
        e.stopPropagation();
        const isOpen = userPopover.classList.contains('show');
        userPopover.classList.toggle('show', !isOpen);
        userToggle.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      };

      document.addEventListener('click', function (e) {
        if (!userToggle.contains(e.target) && !userPopover.contains(e.target)) {
          userPopover.classList.remove('show');
          userToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Đăng nhập nhanh tài khoản mẫu Sinh Viên FPT
    if (quickDemoBtn) {
      quickDemoBtn.onclick = function (e) {
        e.stopPropagation();
        const demoUser = {
          fullname: 'Sinh Viên FPT',
          email: 'student@fpt.edu.vn',
          phone: '0988123456'
        };
        const storage = window.TechGearStorage || localStorage;
        storage.setItem('techgear_current_user', JSON.stringify(demoUser));
        if (window.showToast) {
          window.showToast('Đăng nhập thành công', 'Chào mừng bạn Sinh Viên FPT!', 'success');
        }
        window.dispatchEvent(new CustomEvent('techgear:statechange', { detail: { type: 'auth' } }));
        TechGearComponents.syncAll();
      };
    }

    if (logoutBtn) {
      logoutBtn.onclick = function () {
        if (window.TechGearStorage) {
          window.TechGearStorage.removeItem('techgear_current_user');
        } else {
          localStorage.removeItem('techgear_current_user');
        }

        if (typeof window.showToast === 'function') {
          window.showToast('Đăng xuất', 'Bạn đã đăng xuất tài khoản thành công.', 'info');
        }

        // Bắn Custom Event đồng bộ tức thì mọi nơi
        window.dispatchEvent(new CustomEvent('techgear:statechange', { detail: { type: 'auth' } }));
        TechGearComponents.syncAll();
      };
    }
  },

  /**
   * Cập nhật trạng thái đăng nhập trên Header mà không cần tải lại trang
   */
  updateHeaderAuth: function () {
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

    // 1. Cập nhật khối User Action
    const userContainers = document.querySelectorAll('.user-action-container');
    userContainers.forEach(container => {
      container.innerHTML = this.getUserActionHTML(currentUser);
    });

    // 2. Gắn lại sự kiện cho dropdown
    this.attachUserDropdownEvents();
  },

  /**
   * Cập nhật số lượng và tổng tiền giỏ hàng trên Header mà không cần tải lại trang
   */
  updateCartBadge: function () {
    const totals = this.getCartTotals();

    const badges = document.querySelectorAll('.action-btn__badge');
    badges.forEach(b => b.textContent = totals.count);

    const priceEls = document.querySelectorAll('.cart-menu-wrapper .action-btn__value, a[href="cart.html"] .action-btn__value');
    const formatted = typeof dinhDangTien === 'function' && totals.subtotal > 0
      ? dinhDangTien(totals.subtotal)
      : (totals.subtotal > 0 ? `${totals.subtotal.toLocaleString('vi-VN')}đ` : '0đ');
    priceEls.forEach(p => p.textContent = formatted);

    // Cập nhật lại nội dung danh sách đơn hàng mini trong Cart Popover kiểu Shopee
    const cartPopover = document.getElementById('cartDropdownPopover');
    if (cartPopover) {
      cartPopover.innerHTML = this.getMiniCartHTML();
      if (window.TechGearStorage && typeof window.TechGearStorage.refreshInternalLinks === 'function') {
        window.TechGearStorage.refreshInternalLinks();
      }
    }
  },

  /**
   * TỔNG ĐỒNG BỘ TOÀN DIỆN (REALTIME SYNC ALL)
   * Đồng bộ tức thì Header, Cart Badge, Cart Table, Checkout Order, User Dashboard
   */
  syncAll: function () {
    // 1. Đồng bộ Header User
    this.updateHeaderAuth();

    // 2. Đồng bộ Header Cart
    this.updateCartBadge();

    // 3. Nếu đang ở trang cart.html -> re-render danh sách sản phẩm
    if (window.TechGearCart && typeof window.TechGearCart.renderCartPage === 'function') {
      const isCartPage = document.querySelector('.cart-table-card') || document.querySelector('.cart-layout');
      if (isCartPage) {
        window.TechGearCart.renderCartPage();
      }
    }

    // 4. Nếu đang ở trang checkout.html -> re-render tóm tắt thanh toán
    if (window.TechGearCart && typeof window.TechGearCart.renderCheckoutPage === 'function') {
      const isCheckoutPage = document.getElementById('checkoutContainer');
      if (isCheckoutPage) {
        window.TechGearCart.renderCheckoutPage();
      }
    }

    // 5. Nếu đang ở trang register.html -> re-render form đăng nhập / profile dashboard
    if (typeof window.checkUserAuthStateOnPage === 'function') {
      window.checkUserAuthStateOnPage();
    }

    // 6. Cập nhật lại liên kết trên môi trường file:///
    if (window.TechGearStorage && typeof window.TechGearStorage.refreshInternalLinks === 'function') {
      window.TechGearStorage.refreshInternalLinks();
    }
  }
};

// Đăng ký toàn cục
window.TechGearComponents = TechGearComponents;

// ==============================================================================
// BỘ LẮNG NGHE ĐỒNG BỘ THỜI GIAN THỰC (REALTIME CROSS-TAB & VISIBILITY OBSERVERS)
// ==============================================================================

// 1. Đồng bộ liên tab (Cross-tab sync qua sự kiện 'storage' của trình duyệt)
window.addEventListener('storage', (event) => {
  // Bất kỳ tab nào thêm/sửa/xóa giỏ hàng hoặc đăng nhập/đăng xuất
  if (
    !event.key ||
    event.key === 'techgear_cart' ||
    event.key === 'techgear_current_user' ||
    event.key === 'techgear_coupon'
  ) {
    TechGearComponents.syncAll();
  }
});

// 2. Đồng bộ trong cùng một tab qua CustomEvent
window.addEventListener('techgear:statechange', () => {
  TechGearComponents.syncAll();
});

// 3. Đồng bộ khi người dùng click chuyển tab quay lại trang (Tab Focus & VisibilityChange)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (window.TechGearStorage && typeof window.TechGearStorage.hydrateFromWindowName === 'function') {
      window.TechGearStorage.hydrateFromWindowName();
    }
    TechGearComponents.syncAll();
  }
});
window.addEventListener('focus', () => {
  if (window.TechGearStorage && typeof window.TechGearStorage.hydrateFromWindowName === 'function') {
    window.TechGearStorage.hydrateFromWindowName();
  }
  TechGearComponents.syncAll();
});

// 4. Đồng bộ khi trang được khôi phục từ BFCache (Back/Forward Cache của trình duyệt)
window.addEventListener('pageshow', (event) => {
  if (window.TechGearStorage && typeof window.TechGearStorage.hydrateFromWindowName === 'function') {
    window.TechGearStorage.hydrateFromWindowName();
  }
  TechGearComponents.syncAll();
});

// Khởi chạy khi DOM sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => TechGearComponents.init());
} else {
  TechGearComponents.init();
}
