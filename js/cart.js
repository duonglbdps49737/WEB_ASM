/**
 * ==============================================================================
 * TechGear Store - Cart & Checkout Module (js/cart.js)
 * Môn học: WEB1044 - Lập trình JavaScript cơ bản - FPT Polytechnic
 * ==============================================================================
 * ĐÁP ỨNG TIÊU CHÍ CỐT LÕI:
 * - LAB 7: Ứng dụng localStorage và sessionStorage làm trang giỏ hàng và thanh toán:
 *          + Lưu trữ mảng giỏ hàng qua khóa 'techgear_cart'
 *          + Thêm sản phẩm, tăng/giảm số lượng, xóa từng món, xóa tất cả
 *          + Áp dụng mã giảm giá qua sessionStorage / localStorage
 *          + Tự động tính toán Tạm tính, Giảm giá, Phí ship, Tổng tiền
 *          + Lưu trữ đơn hàng thành công vào khóa 'techgear_orders'
 * - LAB 6: Xử lý tối thiểu 5 loại sự kiện khác nhau:
 *          1. Sự kiện 'click': Tăng/giảm số lượng, Xóa món hàng, Đặt hàng, Áp dụng mã
 *          2. Sự kiện 'change': Thay đổi số lượng ô input, Chọn phương thức thanh toán
 *          3. Sự kiện 'input': Nhập mã voucher tự động viết hoa và kiểm tra
 *          4. Sự kiện 'submit': Gửi form đặt hàng và lưu đơn hàng
 *          5. Sự kiện 'DOMContentLoaded': Tải và khởi tạo giỏ hàng khi trang mở
 */

// Định nghĩa đối tượng quản lý Giỏ hàng TechGearCart
const TechGearCart = {
  CART_KEY: 'techgear_cart',
  COUPON_KEY: 'techgear_coupon',
  ORDERS_KEY: 'techgear_orders',

  /**
   * 1. Lấy danh sách sản phẩm trong giỏ hàng từ localStorage (LAB 7)
   */
  getCart: function () {
    const storage = window.TechGearStorage || localStorage;
    const initialized = storage.getItem('techgear_cart_initialized');
    const data = storage.getItem(this.CART_KEY);

    if (!initialized) {
      // Chỉ khởi tạo 2 sản phẩm mẫu ở LẦN ĐẦU TIÊN MỞ TRANG
      storage.setItem('techgear_cart_initialized', 'true');
      const defaultCart = [
        {
          id: 1,
          ten: "iPhone 15 Pro Max 256GB Titan Tự Nhiên",
          gia: 29990000,
          hinhAnh: "images/products/iphone15.jpg",
          soLuong: 1,
          bienThe: "Màu: Titan Tự Nhiên | 256GB"
        },
        {
          id: 3,
          ten: "Tai nghe Apple AirPods Pro 2 Type-C MagSafe",
          gia: 5490000,
          hinhAnh: "images/products/airpods-pro.jpg",
          soLuong: 1,
          bienThe: "Hộp sạc MagSafe | Chính hãng"
        }
      ];
      this.saveCart(defaultCart);
      return defaultCart;
    }

    if (!data) return [];
    try {
      return JSON.parse(data) || [];
    } catch (e) {
      return [];
    }
  },

  /**
   * 2. Lưu danh sách sản phẩm vào localStorage (LAB 7)
   */
  saveCart: function (cartArray) {
    const storage = window.TechGearStorage || localStorage;
    storage.setItem(this.CART_KEY, JSON.stringify(cartArray));
    this.updateHeaderBadge();
    window.dispatchEvent(new CustomEvent('techgear:statechange', { detail: { type: 'cart' } }));
  },

  /**
   * 3. Thêm sản phẩm vào giỏ hàng (LAB 7)
   */
  addItem: function (productId, quantity = 1, options = {}) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    // Lấy thông tin từ danhSachSanPham trong products.js
    let productInfo = null;
    if (typeof danhSachSanPham !== 'undefined') {
      productInfo = danhSachSanPham.find(p => p.id === productId);
    }

    if (!productInfo) {
      console.warn("Không tìm thấy thông tin sản phẩm có ID:", productId);
      return;
    }

    if (existingIndex > -1) {
      // Đã có trong giỏ hàng: Tăng số lượng
      cart[existingIndex].soLuong += quantity;
    } else {
      // Chưa có: Thêm mới
      cart.push({
        id: productInfo.id,
        ten: productInfo.ten,
        gia: productInfo.gia,
        hinhAnh: productInfo.hinhAnh,
        soLuong: quantity,
        bienThe: options.bienThe || "Chính Hãng VN/A | Bảo hành 12T"
      });
    }

    this.saveCart(cart);

    // Thông báo Toast cho người dùng
    if (typeof window.showToast === 'function') {
      window.showToast(
        'Đã thêm vào giỏ hàng',
        `Đã thêm ${quantity} x "${productInfo.ten}" vào giỏ hàng!`,
        'success'
      );
    }
  },

  /**
   * 4. Cập nhật số lượng của một mặt hàng
   */
  updateQuantity: function (productId, newQuantity) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === productId);

    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(productId);
        return;
      } else {
        item.soLuong = Math.min(newQuantity, 99); // Khống chế tối đa 99
      }
      this.saveCart(cart);
      this.renderCartPage();
    }
  },

  /**
   * 5. Xóa một sản phẩm khỏi giỏ hàng
   */
  removeItem: function (productId) {
    let cart = this.getCart();
    cart = cart.filter(i => i.id !== productId);
    this.saveCart(cart);
    this.renderCartPage();

    if (typeof window.showToast === 'function') {
      window.showToast('Giỏ hàng', 'Đã xóa sản phẩm khỏi giỏ hàng.', 'info');
    }
  },

  /**
   * 6. Xóa tất cả sản phẩm trong giỏ hàng
   */
  clearCart: function () {
    this.saveCart([]);
    this.renderCartPage();

    if (typeof window.showToast === 'function') {
      window.showToast('Giỏ hàng', 'Đã dọn sạch toàn bộ giỏ hàng!', 'info');
    }
  },

  /**
   * 7. Quản lý mã giảm giá Coupon (Lưu bằng sessionStorage)
   */
  getCoupon: function () {
    const raw = sessionStorage.getItem(this.COUPON_KEY);
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  applyCoupon: function (code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Vui lòng nhập mã giảm giá.' };

    if (cleanCode === 'POLYTECH') {
      const coupon = { code: 'POLYTECH', type: 'fixed', value: 500000, desc: 'Giảm 500.000đ từ FPT Poly' };
      sessionStorage.setItem(this.COUPON_KEY, JSON.stringify(coupon));
      return { success: true, message: 'Áp dụng mã POLYTECH thành công! Giảm 500.000đ.' };
    } else if (cleanCode === 'SALE10') {
      const coupon = { code: 'SALE10', type: 'percent', value: 10, desc: 'Giảm 10% tổng đơn' };
      sessionStorage.setItem(this.COUPON_KEY, JSON.stringify(coupon));
      return { success: true, message: 'Áp dụng mã SALE10 thành công! Giảm 10%.' };
    } else if (cleanCode === 'FREESHIP') {
      const coupon = { code: 'FREESHIP', type: 'shipping', value: 0, desc: 'Miễn phí vận chuyển toàn quốc' };
      sessionStorage.setItem(this.COUPON_KEY, JSON.stringify(coupon));
      return { success: true, message: 'Áp dụng mã FREESHIP thành công! Miễn phí ship.' };
    } else {
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
    }
  },

  removeCoupon: function () {
    sessionStorage.removeItem(this.COUPON_KEY);
  },

  /**
   * 8. Tính toán các khoản tiền trong giỏ hàng
   */
  calculateTotals: function () {
    const cart = this.getCart();
    let subtotal = 0;
    let count = 0;

    cart.forEach(item => {
      subtotal += item.gia * item.soLuong;
      count += item.soLuong;
    });

    // Mặc định miễn phí ship cho đơn từ 500.000đ, dưới 500k thì phí 30.000đ
    let shipping = subtotal > 0 ? (subtotal >= 500000 ? 0 : 30000) : 0;
    let discount = 0;

    const coupon = this.getCoupon();
    if (coupon && subtotal > 0) {
      if (coupon.type === 'fixed') {
        discount = Math.min(coupon.value, subtotal);
      } else if (coupon.type === 'percent') {
        discount = Math.round(subtotal * (coupon.value / 100));
      } else if (coupon.type === 'shipping') {
        shipping = 0;
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      discount,
      shipping,
      total,
      count,
      itemTypes: cart.length,
      coupon
    };
  },

  /**
   * 9. Cập nhật số lượng trên Header ở mọi trang
   */
  updateHeaderBadge: function () {
    const totals = this.calculateTotals();
    const badges = document.querySelectorAll('.action-btn__badge');
    const headerPriceValues = document.querySelectorAll('.action-btn a[href="cart.html"] .action-btn__value');

    badges.forEach(badge => {
      badge.textContent = totals.count;
    });

    const headerCartVal = document.querySelector('a[href="cart.html"] .action-btn__value');
    if (headerCartVal && typeof dinhDangTien === 'function') {
      headerCartVal.textContent = totals.subtotal > 0 ? dinhDangTien(totals.subtotal) : '0đ';
    }

    // Đồng bộ tức thì với Reusable Component Header (Single Source of Truth)
    if (window.TechGearComponents && typeof window.TechGearComponents.updateCartBadge === 'function') {
      window.TechGearComponents.updateCartBadge();
    }
  },

  /**
   * 10. LAB 7: Render toàn bộ giao diện trang Giỏ hàng (cart.html)
   */
  renderCartPage: function () {
    const cartTableCard = document.querySelector('.cart-table-card');
    if (!cartTableCard) return; // Không phải trang cart.html

    const cart = this.getCart();
    const totals = this.calculateTotals();

    const cartTitleCount = document.querySelector('.cart-title-count');
    if (cartTitleCount) {
      cartTitleCount.textContent = `(${totals.itemTypes} sản phẩm)`;
    }

    // Nếu giỏ hàng trống: Hiển thị Empty State
    if (cart.length === 0) {
      cartTableCard.innerHTML = `
        <div class="empty-state" role="status">
          <div class="empty-state__icon">
            <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
          </div>
          <h3 class="empty-state__title">Giỏ hàng của bạn đang trống</h3>
          <p class="empty-state__desc">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá ngay các sản phẩm công nghệ chính hãng giá tốt tại TechGear Store!
          </p>
          <a href="products.html" class="btn btn-primary btn-lg">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Khám phá sản phẩm ngay
          </a>
        </div>
      `;

      // Cập nhật tóm tắt bên phải
      this.updateSummaryUI(totals, true);
      return;
    }

    // Render bảng sản phẩm
    let rowsHTML = '';
    cart.forEach(item => {
      const itemSubtotal = item.gia * item.soLuong;
      const priceFormatted = typeof dinhDangTien === 'function' ? dinhDangTien(item.gia) : `${item.gia}đ`;
      const subtotalFormatted = typeof dinhDangTien === 'function' ? dinhDangTien(itemSubtotal) : `${itemSubtotal}đ`;

      rowsHTML += `
        <tr data-product-id="${item.id}">
          <td>
            <div class="cart-product-info">
              <img src="${item.hinhAnh}" alt="${item.ten}" class="cart-product-img">
              <div>
                <h4 class="cart-product-name"><a href="detail.html?id=${item.id}" onclick="if (typeof luuSanPhamVaoSession === 'function') luuSanPhamVaoSession(${item.id})">${item.ten}</a></h4>
                <span class="cart-product-variant">${item.bienThe || 'Chính hãng'}</span>
              </div>
            </div>
          </td>
          <td><span class="cart-price">${priceFormatted}</span></td>
          <td>
            <div class="qty-picker">
              <!-- LAB 6: Sự kiện click giảm số lượng -->
              <button type="button" class="qty-btn qty-minus-cart" data-id="${item.id}" aria-label="Giảm">
                <i class="fa-solid fa-minus" aria-hidden="true"></i>
              </button>
              <!-- LAB 6: Sự kiện change nhập trực tiếp số lượng -->
              <input type="number" class="qty-input qty-input-cart" data-id="${item.id}" value="${item.soLuong}" min="1" max="99" aria-label="Số lượng">
              <!-- LAB 6: Sự kiện click tăng số lượng -->
              <button type="button" class="qty-btn qty-plus-cart" data-id="${item.id}" aria-label="Tăng">
                <i class="fa-solid fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </td>
          <td><span class="cart-subtotal" style="font-weight: 700; color: var(--primary-color);">${subtotalFormatted}</span></td>
          <td>
            <!-- LAB 6: Sự kiện click xóa một mặt hàng -->
            <button type="button" class="cart-remove-btn" data-id="${item.id}" title="Xóa mặt hàng này" aria-label="Xóa ${item.ten}">
              <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      `;
    });

    cartTableCard.innerHTML = `
      <table class="cart-table" aria-label="Danh sách sản phẩm trong giỏ hàng">
        <thead>
          <tr>
            <th scope="col">Sản Phẩm</th>
            <th scope="col">Đơn Giá</th>
            <th scope="col">Số Lượng</th>
            <th scope="col">Thành Tiền</th>
            <th scope="col"><span class="sr-only">Thao tác</span></th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 14px;">
        <a href="products.html" class="btn btn-outline">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Tiếp tục mua hàng
        </a>
        <!-- LAB 6: Sự kiện click xóa tất cả giỏ hàng -->
        <button type="button" id="clearCartBtn" class="btn btn-outline" style="color: var(--danger-color); border-color: #fecaca;">
          <i class="fa-regular fa-trash-can" aria-hidden="true"></i> Xóa tất cả giỏ hàng
        </button>
      </div>
    `;

    // Cập nhật tóm tắt bên phải
    this.updateSummaryUI(totals, false);

    // Gắn các sự kiện (LAB 6)
    this.attachCartEvents();
  },

  /**
   * Cập nhật khối tổng kết bên cột phải (Order Summary)
   */
  updateSummaryUI: function (totals, isEmpty = false) {
    const subtotalElem = document.getElementById('summarySubtotal');
    const discountElem = document.getElementById('summaryDiscount');
    const shippingElem = document.getElementById('summaryShipping');
    const totalElem = document.querySelector('.summary-total-price');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const fnDinhDang = typeof dinhDangTien === 'function' ? dinhDangTien : (val => `${val}đ`);

    if (isEmpty) {
      if (subtotalElem) subtotalElem.textContent = '0đ';
      if (discountElem) discountElem.textContent = '0đ';
      if (shippingElem) shippingElem.textContent = '0đ';
      if (totalElem) totalElem.textContent = '0đ';
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
      }
      return;
    }

    if (subtotalElem) subtotalElem.textContent = fnDinhDang(totals.subtotal);
    if (discountElem) {
      discountElem.textContent = totals.discount > 0 ? `-${fnDinhDang(totals.discount)}` : '0đ';
    }
    if (shippingElem) {
      shippingElem.textContent = totals.shipping === 0 ? 'Miễn phí (0đ)' : fnDinhDang(totals.shipping);
    }
    if (totalElem) {
      totalElem.textContent = fnDinhDang(totals.total);
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.cursor = 'pointer';
      // LAB 6: Sự kiện click chuyển sang trang thanh toán
      checkoutBtn.onclick = function () {
        if (window.TechGearStorage) {
          window.TechGearStorage.navigate('checkout.html');
        } else {
          window.location.href = 'checkout.html';
        }
      };
    }
  },

  /**
   * LAB 6: Gắn các sự kiện (click, change, input) cho trang Giỏ hàng
   */
  attachCartEvents: function () {
    const self = this;

    // 1. LAB 6 - Sự kiện click: Nút Giảm số lượng
    document.querySelectorAll('.qty-minus-cart').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = parseInt(this.getAttribute('data-id'), 10);
        const row = this.closest('tr');
        const input = row.querySelector('.qty-input-cart');
        let currentQty = parseInt(input.value, 10) || 1;
        self.updateQuantity(id, currentQty - 1);
      });
    });

    // 2. LAB 6 - Sự kiện click: Nút Tăng số lượng
    document.querySelectorAll('.qty-plus-cart').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = parseInt(this.getAttribute('data-id'), 10);
        const row = this.closest('tr');
        const input = row.querySelector('.qty-input-cart');
        let currentQty = parseInt(input.value, 10) || 1;
        self.updateQuantity(id, currentQty + 1);
      });
    });

    // 3. LAB 6 - Sự kiện change: Gõ trực tiếp số lượng vào input
    document.querySelectorAll('.qty-input-cart').forEach(input => {
      input.addEventListener('change', function () {
        const id = parseInt(this.getAttribute('data-id'), 10);
        let val = parseInt(this.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        self.updateQuantity(id, val);
      });
    });

    // 4. LAB 6 - Sự kiện click: Xóa từng món hàng
    document.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = parseInt(this.getAttribute('data-id'), 10);
        self.removeItem(id);
      });
    });

    // 5. LAB 6 - Sự kiện click: Xóa tất cả giỏ hàng
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?')) {
          self.clearCart();
        }
      });
    }

    // 6. LAB 6 - Sự kiện click & input: Áp dụng mã giảm giá
    const couponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponInput');
    if (couponBtn && couponInput) {
      // LAB 6: Sự kiện input tự động viết hoa mã
      couponInput.addEventListener('input', function () {
        this.value = this.value.toUpperCase();
      });

      // LAB 6: Sự kiện click áp dụng
      couponBtn.onclick = function () {
        const res = self.applyCoupon(couponInput.value);
        if (res.success) {
          if (typeof window.showToast === 'function') {
            window.showToast('Mã giảm giá', res.message, 'success');
          } else {
            alert(res.message);
          }
          self.renderCartPage();
        } else {
          if (typeof window.showToast === 'function') {
            window.showToast('Lỗi mã giảm giá', res.message, 'error');
          } else {
            alert(res.message);
          }
        }
      };
    }
  },

  /**
   * 11. LAB 7: Render toàn bộ giao diện trang Thanh Toán (checkout.html)
   */
  renderCheckoutPage: function () {
    const checkoutContainer = document.getElementById('checkoutContainer');
    if (!checkoutContainer) return; // Không phải trang checkout.html

    const cart = this.getCart();
    const totals = this.calculateTotals();

    // Nếu giỏ hàng trống, không cho thanh toán
    if (cart.length === 0) {
      checkoutContainer.innerHTML = `
        <div class="empty-state" role="status" style="max-width: 600px; margin: 40px auto;">
          <div class="empty-state__icon"><i class="fa-solid fa-cart-plus"></i></div>
          <h2 class="empty-state__title">Giỏ hàng của bạn đang trống</h2>
          <p class="empty-state__desc">Vui lòng chọn ít nhất một sản phẩm công nghệ trước khi tiến hành thanh toán đơn hàng.</p>
          <a href="products.html" class="btn btn-primary btn-lg">Quay lại mua sắm</a>
        </div>
      `;
      return;
    }

    const fnDinhDang = typeof dinhDangTien === 'function' ? dinhDangTien : (val => `${val}đ`);

    // Render danh sách sản phẩm tóm tắt ở cột phải
    const orderItemsContainer = document.getElementById('checkoutOrderItems');
    if (orderItemsContainer) {
      orderItemsContainer.innerHTML = cart.map(item => `
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px dashed var(--border-color);">
          <img src="${item.hinhAnh}" alt="${item.ten}" style="width: 54px; height: 54px; object-fit: contain; background: #f8fafc; border-radius: var(--radius-sm); border: 1px solid var(--border-color); padding: 4px;">
          <div style="flex: 1;">
            <h5 style="font-size: 0.9rem; font-weight: 600; color: var(--text-main); margin-bottom: 4px;">${item.ten}</h5>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Số lượng: <strong>x${item.soLuong}</strong></div>
          </div>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.92rem;">
            ${fnDinhDang(item.gia * item.soLuong)}
          </div>
        </div>
      `).join('');
    }

    // Điền các con số
    const coSubtotal = document.getElementById('checkoutSubtotal');
    const coDiscount = document.getElementById('checkoutDiscount');
    const coShipping = document.getElementById('checkoutShipping');
    const coTotal = document.getElementById('checkoutTotal');

    if (coSubtotal) coSubtotal.textContent = fnDinhDang(totals.subtotal);
    if (coDiscount) coDiscount.textContent = totals.discount > 0 ? `-${fnDinhDang(totals.discount)}` : '0đ';
    if (coShipping) coShipping.textContent = totals.shipping === 0 ? 'Miễn phí (0đ)' : fnDinhDang(totals.shipping);
    if (coTotal) coTotal.textContent = fnDinhDang(totals.total);

    // Điền sẵn thông tin người dùng nếu đã đăng nhập (LAB 8)
    const storage = window.TechGearStorage || localStorage;
    const currentUserRaw = storage.getItem('techgear_current_user');
    if (currentUserRaw) {
      try {
        const u = JSON.parse(currentUserRaw);
        const nameInput = document.getElementById('orderFullname');
        const phoneInput = document.getElementById('orderPhone');
        const emailInput = document.getElementById('orderEmail');
        if (nameInput && !nameInput.value) nameInput.value = u.fullname || '';
        if (phoneInput && !phoneInput.value) phoneInput.value = u.phone || '';
        if (emailInput && !emailInput.value) emailInput.value = u.email || '';
      } catch (err) {}
    }

    // Gắn sự kiện cho trang thanh toán (LAB 6 & LAB 7)
    this.attachCheckoutEvents(totals);
  },

  /**
   * LAB 6: Gắn sự kiện cho trang Thanh toán (checkout.html)
   */
  attachCheckoutEvents: function (totals) {
    const self = this;
    const checkoutForm = document.getElementById('orderForm');
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const qrInfoBox = document.getElementById('qrTransferInfo');

    // 1. LAB 6 - Sự kiện change: Đổi phương thức thanh toán hiển thị QR / hướng dẫn
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        // Cập nhật class active cho card
        document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('active'));
        const parentCard = this.closest('.payment-method-card');
        if (parentCard) parentCard.classList.add('active');

        if (this.value === 'banking') {
          if (qrInfoBox) qrInfoBox.classList.add('show');
        } else {
          if (qrInfoBox) qrInfoBox.classList.remove('show');
        }
      });
    });

    // 2. LAB 6 - Sự kiện submit: Gửi form đặt hàng
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullname = document.getElementById('orderFullname').value.trim();
        const phone = document.getElementById('orderPhone').value.trim();
        const email = document.getElementById('orderEmail').value.trim();
        const address = document.getElementById('orderAddress').value.trim();
        const note = document.getElementById('orderNote') ? document.getElementById('orderNote').value.trim() : '';
        const paymentMethodEl = document.querySelector('input[name="paymentMethod"]:checked');
        const paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'cod';

        // Kiểm tra cơ bản
        if (!fullname || !phone || !email || !address) {
          alert('Vui lòng điền đầy đủ các thông tin giao hàng có dấu *!');
          return;
        }

        // Tạo mã đơn hàng ngẫu nhiên chuyên nghiệp
        const orderId = `TG-${Math.floor(100000 + Math.random() * 900000)}`;
        const orderDate = new Date().toLocaleString('vi-VN');

        const newOrder = {
          orderId,
          orderDate,
          customer: { fullname, phone, email, address, note },
          paymentMethod: paymentMethod === 'banking' ? 'Chuyển khoản VietQR' : 'Thanh toán khi nhận hàng (COD)',
          items: self.getCart(),
          totals: totals,
          status: 'Đang xử lý'
        };

        // LAB 7: Lưu đơn hàng vào TechGearStorage khóa 'techgear_orders'
        const storage = window.TechGearStorage || localStorage;
        let orders = [];
        try {
          const rawOrders = storage.getItem(self.ORDERS_KEY);
          orders = JSON.parse(rawOrders) || [];
        } catch (err) {
          orders = [];
        }
        orders.unshift(newOrder);
        storage.setItem(self.ORDERS_KEY, JSON.stringify(orders));

        // LAB 7: Xóa sạch giỏ hàng sau khi đặt thành công
        self.saveCart([]);
        sessionStorage.removeItem(self.COUPON_KEY);

        // Hiển thị màn hình đặt hàng thành công
        self.showOrderSuccessUI(newOrder);
      });
    }
  },

  /**
   * Hiển thị giao diện hoàn tất đặt hàng
   */
  showOrderSuccessUI: function (order) {
    const checkoutContainer = document.getElementById('checkoutContainer');
    if (!checkoutContainer) return;

    const fnDinhDang = typeof dinhDangTien === 'function' ? dinhDangTien : (val => `${val}đ`);

    checkoutContainer.innerHTML = `
      <div class="order-success-card">
        <div class="order-success-icon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">
          Đặt Hàng Thành Công!
        </h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">
          Cảm ơn bạn <strong>${order.customer.fullname}</strong> đã mua sắm tại TechGear Store. Đơn hàng của bạn đang được đóng gói và chuẩn bị giao đi.
        </p>

        <div style="background-color: #f8fafc; border: 1.5px dashed var(--border-color); border-radius: var(--radius-md); padding: 20px; text-align: left; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-muted);">Mã đơn hàng:</span>
            <strong style="color: var(--primary-color); font-size: 1.05rem;">${order.orderId}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-muted);">Thời gian đặt:</span>
            <span>${order.orderDate}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-muted);">Hình thức thanh toán:</span>
            <span><strong>${order.paymentMethod}</strong></span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-muted);">Địa chỉ nhận hàng:</span>
            <span style="max-width: 65%; text-align: right;">${order.customer.address}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border-color); font-size: 1.1rem;">
            <span><strong>Tổng thanh toán:</strong></span>
            <strong style="color: #dc2626; font-size: 1.2rem;">${fnDinhDang(order.totals.total)}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <a href="index.html" class="btn btn-primary btn-lg">
            <i class="fa-solid fa-house"></i> Quay Về Trang Chủ
          </a>
          <a href="products.html" class="btn btn-outline btn-lg">
            <i class="fa-solid fa-cart-shopping"></i> Tiếp Tục Mua Sắm
          </a>
        </div>
      </div>
    `;

    // Cuộn màn hình lên đầu
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Đăng ký toàn cục
window.TechGearCart = TechGearCart;

// LAB 6: Sự kiện DOMContentLoaded khởi chạy giỏ hàng
document.addEventListener('DOMContentLoaded', () => {
  TechGearCart.updateHeaderBadge();
  TechGearCart.renderCartPage();
  TechGearCart.renderCheckoutPage();
});
