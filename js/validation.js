/**
 * ==============================================================================
 * TechGear Store - Form Validation Module (js/validation.js)
 * Assignment WEB1044 - Lập trình JavaScript cơ bản - FPT Polytechnic
 * ==============================================================================
 * Các tính năng chính:
 * 1. Kiểm tra tính hợp lệ Form Đăng ký (Register Form):
 *    - Họ và tên: Bắt buộc, tối thiểu 3 ký tự.
 *    - Email: Bắt buộc, kiểm tra Regex định dạng email.
 *    - Số điện thoại: Bắt buộc, 10 số, đầu số Việt Nam (03, 05, 07, 08, 09).
 *    - Mật khẩu: Bắt buộc, tối thiểu 6 ký tự.
 *    - Xác nhận mật khẩu: Phải trùng khớp với mật khẩu.
 *    - Đồng ý điều khoản: Bắt buộc tích chọn checkbox.
 * 2. Kiểm tra tính hợp lệ Form Đăng nhập (Login Form).
 * 3. Kiểm tra tính hợp lệ Form Liên hệ (Contact Form).
 * 4. Tự động xóa lỗi khi người dùng gõ lại (Realtime input feedback).
 * 5. Báo lỗi thân thiện bằng DOM Manipulation (viền đỏ & dòng chữ cảnh báo).
 */

document.addEventListener('DOMContentLoaded', () => {
  initRegisterValidation();
  initLoginValidation();
  initContactValidation();
  initAuthTabs();
  checkUserAuthStateOnPage();
});

// --------------------------------------------------------------------------
// LAB 8: Kiểm tra trạng thái tài khoản và render Dashboard nếu đã đăng nhập
// --------------------------------------------------------------------------
function checkUserAuthStateOnPage() {
  const profileDashboard = document.getElementById('userProfileDashboard');
  const authWrapperBox = document.getElementById('authWrapperBox');
  const breadcrumbSpan = document.getElementById('authBreadcrumbTitle');

  if (!profileDashboard || !authWrapperBox) return;

  const storage = window.TechGearStorage || localStorage;
  const rawUser = storage.getItem('techgear_current_user');
  let currentUser = null;
  if (rawUser) {
    try {
      currentUser = JSON.parse(rawUser);
    } catch (e) {
      currentUser = null;
    }
  }

  if (currentUser) {
    // ĐÃ ĐĂNG NHẬP: Ẩn form đăng ký/đăng nhập, hiển thị Profile Dashboard
    authWrapperBox.style.display = 'none';
    profileDashboard.style.display = 'block';
    if (breadcrumbSpan) breadcrumbSpan.textContent = 'Hồ Sơ Tài Khoản Của Bạn';

    const initials = currentUser.fullname
      ? currentUser.fullname.split(' ').pop().charAt(0).toUpperCase()
      : 'U';

    // Đọc lịch sử đơn hàng từ TechGearStorage (LAB 7)
    let userOrders = [];
    try {
      const rawOrders = storage.getItem('techgear_orders');
      userOrders = JSON.parse(rawOrders) || [];
    } catch (e) {
      userOrders = [];
    }

    let ordersHTML = '';
    if (userOrders.length > 0) {
      ordersHTML = userOrders.slice(0, 3).map(ord => `
        <div class="dashboard-order-row">
          <div>
            <strong>Mã ĐH: ${ord.orderId}</strong>
            <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 8px;">${ord.orderDate}</span>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            ${ord.items ? ord.items.length : 1} sản phẩm | ${ord.paymentMethod}
          </div>
          <div>
            <span style="color: #dc2626; font-weight: 700;">
              ${typeof dinhDangTien === 'function' ? dinhDangTien(ord.totals ? ord.totals.total : 0) : 'Đã thanh toán'}
            </span>
            <span style="margin-left: 8px; font-size: 0.75rem; background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 99px; font-weight: 600;">
              ${ord.status || 'Đang xử lý'}
            </span>
          </div>
        </div>
      `).join('');
    } else {
      ordersHTML = `
        <div style="text-align: center; padding: 20px 10px; color: var(--text-muted); font-size: 0.9rem;">
          <i class="fa-solid fa-receipt" style="font-size: 1.8rem; margin-bottom: 8px; color: #cbd5e1; display: block;"></i>
          Bạn chưa có đơn hàng nào tại TechGear Store.
        </div>
      `;
    }

    profileDashboard.innerHTML = `
      <!-- Header Dashboard -->
      <div class="dashboard-header">
        <div class="dashboard-avatar-big">${initials}</div>
        <div class="dashboard-user-info">
          <div class="dashboard-welcome">Chào mừng trở lại,</div>
          <h2 class="dashboard-name">${currentUser.fullname}</h2>
          <div class="dashboard-tags">
            <span class="badge-status-online"><i class="fa-solid fa-circle-check"></i> Đang Đăng Nhập</span>
            <span class="badge-vip-member"><i class="fa-solid fa-crown"></i> Thành Viên VIP TechGear</span>
          </div>
        </div>
      </div>

      <!-- Lưới thông tin tài khoản -->
      <div class="dashboard-info-grid">
        <div class="dashboard-info-item">
          <span class="info-label"><i class="fa-regular fa-user"></i> Họ và tên:</span>
          <span class="info-val">${currentUser.fullname}</span>
        </div>
        <div class="dashboard-info-item">
          <span class="info-label"><i class="fa-regular fa-envelope"></i> Email:</span>
          <span class="info-val">${currentUser.email}</span>
        </div>
        <div class="dashboard-info-item">
          <span class="info-label"><i class="fa-solid fa-phone"></i> Số điện thoại:</span>
          <span class="info-val">${currentUser.phone || '0988 123 456'}</span>
        </div>
        <div class="dashboard-info-item">
          <span class="info-label"><i class="fa-solid fa-shield-halved"></i> Bảo mật tài khoản:</span>
          <span class="info-val" style="color: var(--success-color);">Đã xác thực 100%</span>
        </div>
      </div>

      <!-- Đơn hàng gần đây -->
      <div class="dashboard-orders-card">
        <h3 class="dashboard-orders-title">
          <i class="fa-solid fa-box-open"></i> Đơn Hàng Gần Đây Của Bạn (${userOrders.length})
        </h3>
        <div>${ordersHTML}</div>
      </div>

      <!-- Các nút thao tác -->
      <div class="dashboard-actions">
        <a href="products.html" class="btn btn-primary">
          <i class="fa-solid fa-cart-shopping"></i> Tiếp Tục Mua Sắm
        </a>
        <a href="cart.html" class="btn btn-outline">
          <i class="fa-solid fa-bag-shopping"></i> Xem Giỏ Hàng
        </a>
        <button type="button" id="btnDashboardLogout" class="btn btn-outline" style="color: var(--danger-color); border-color: #fecaca;">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng Xuất
        </button>
      </div>

      <div style="text-align: center; margin-top: 18px; border-top: 1px solid var(--border-color); padding-top: 14px;">
        <button type="button" id="btnSwitchAccount" style="background: none; border: none; color: var(--primary-color); font-size: 0.88rem; cursor: pointer; text-decoration: underline; font-weight: 600;">
          <i class="fa-solid fa-user-plus"></i> Đăng xuất để đăng ký hoặc đăng nhập tài khoản khác
        </button>
      </div>
    `;

    // Gắn sự kiện Đăng xuất trên Dashboard
    const logoutBtn = document.getElementById('btnDashboardLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        const storage = window.TechGearStorage || localStorage;
        storage.removeItem('techgear_current_user');
        window.dispatchEvent(new CustomEvent('techgear:statechange', { detail: { type: 'auth' } }));
        if (typeof window.showToast === 'function') {
          window.showToast('Đăng xuất', 'Bạn đã đăng xuất tài khoản thành công.', 'info');
        }
        if (window.TechGearComponents && typeof window.TechGearComponents.syncAll === 'function') {
          window.TechGearComponents.syncAll();
        } else {
          if (typeof window.updateUserHeaderUI === 'function') {
            window.updateUserHeaderUI();
          }
          checkUserAuthStateOnPage();
        }
      });
    }

    // Gắn sự kiện Chuyển tài khoản khác
    const switchBtn = document.getElementById('btnSwitchAccount');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => {
        if (confirm('Bạn có muốn đăng xuất tài khoản hiện tại để đăng ký hoặc đăng nhập tài khoản khác?')) {
          const storage = window.TechGearStorage || localStorage;
          storage.removeItem('techgear_current_user');
          window.dispatchEvent(new CustomEvent('techgear:statechange', { detail: { type: 'auth' } }));
          if (window.TechGearComponents && typeof window.TechGearComponents.syncAll === 'function') {
            window.TechGearComponents.syncAll();
          } else {
            if (typeof window.updateUserHeaderUI === 'function') {
              window.updateUserHeaderUI();
            }
            checkUserAuthStateOnPage();
          }
          const regTab = document.querySelector('.auth-tab[data-target="registerTabContent"]');
          if (regTab) regTab.click();
        }
      });
    }

  } else {
    // CHƯA ĐĂNG NHẬP: Hiển thị form đăng ký / đăng nhập
    profileDashboard.style.display = 'none';
    authWrapperBox.style.display = 'block';
    if (breadcrumbSpan) breadcrumbSpan.textContent = 'Đăng ký & Đăng nhập';
  }
}

window.checkUserAuthStateOnPage = checkUserAuthStateOnPage;

// Biểu thức chính quy (Regex) kiểm tra Email chuẩn
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Biểu thức chính quy kiểm tra số điện thoại Việt Nam 10 chữ số
const PHONE_REGEX = /^(03|05|07|08|09)[0-9]{8}$/;

/**
 * Hiển thị lỗi cho một ô nhập liệu (Tuân thủ chuẩn Accessibility WCAG 2.1)
 * @param {HTMLElement} inputElement
 * @param {string} message
 */
function showError(inputElement, message) {
  if (!inputElement) return;

  inputElement.classList.add('is-invalid');
  inputElement.setAttribute('aria-invalid', 'true');

  const parent = inputElement.closest('.form-group');
  if (parent) {
    let errorElem = parent.querySelector('.error-message');
    if (!errorElem) {
      errorElem = document.createElement('div');
      errorElem.className = 'error-message';
      parent.appendChild(errorElem);
    }
    const errorId = inputElement.id ? `${inputElement.id}-error` : `err-${Math.random().toString(36).substr(2, 9)}`;
    errorElem.id = errorId;
    errorElem.setAttribute('role', 'alert');
    errorElem.innerHTML = `<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> <span>${message}</span>`;
    errorElem.style.display = 'flex';
    inputElement.setAttribute('aria-describedby', errorId);
  }
}

/**
 * Xóa trạng thái lỗi của ô nhập liệu
 * @param {HTMLElement} inputElement
 */
function clearError(inputElement) {
  if (!inputElement) return;

  inputElement.classList.remove('is-invalid');
  inputElement.removeAttribute('aria-invalid');
  inputElement.removeAttribute('aria-describedby');

  const parent = inputElement.closest('.form-group');
  if (parent) {
    const errorElem = parent.querySelector('.error-message');
    if (errorElem) {
      errorElem.style.display = 'none';
      errorElem.textContent = '';
    }
  }
}

/**
 * Gắn sự kiện xóa lỗi tự động khi người dùng gõ phím
 * @param {HTMLElement} inputElement
 */
function attachRealtimeClear(inputElement) {
  if (!inputElement) return;
  inputElement.addEventListener('input', () => clearError(inputElement));
  inputElement.addEventListener('change', () => clearError(inputElement));
}

// --------------------------------------------------------------------------
// LAB 8: Quản lý danh sách tài khoản người dùng qua localStorage
// --------------------------------------------------------------------------
const USERS_STORAGE_KEY = 'techgear_users';
const CURRENT_USER_KEY = 'techgear_current_user';

function getRegisteredUsers() {
  const defaultUsers = [
    {
      fullname: "Sinh Viên FPT",
      email: "student@fpt.edu.vn",
      phone: "0988123456",
      password: "password123"
    }
  ];

  const storage = window.TechGearStorage || localStorage;
  let users = [];
  try {
    const raw = storage.getItem(USERS_STORAGE_KEY);
    users = JSON.parse(raw) || [];
  } catch (e) {
    users = [];
  }

  // Khởi tạo tài khoản mẫu nếu chưa có dữ liệu trong storage
  if (users.length === 0) {
    storage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return users;
}

function saveRegisteredUsers(users) {
  const storage = window.TechGearStorage || localStorage;
  storage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * 1. Khởi tạo kiểm tra Form Đăng ký (Register Form - LAB 8 & LAB 6)
 */
function initRegisterValidation() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  const fullnameInput = document.getElementById('regFullname');
  const emailInput = document.getElementById('regEmail');
  const phoneInput = document.getElementById('regPhone');
  const passwordInput = document.getElementById('regPassword');
  const confirmPasswordInput = document.getElementById('regConfirmPassword');
  const termsCheckbox = document.getElementById('regTerms');

  // LAB 6: Gắn sự kiện input/change realtime xóa lỗi
  [fullnameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput, termsCheckbox].forEach(
    attachRealtimeClear
  );

  // LAB 6: Sự kiện submit Form Đăng ký
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    const users = getRegisteredUsers();

    // 1. Kiểm tra Họ và tên
    if (!fullnameInput.value.trim()) {
      showError(fullnameInput, 'Vui lòng nhập họ và tên của bạn.');
      isValid = false;
    } else if (fullnameInput.value.trim().length < 3) {
      showError(fullnameInput, 'Họ và tên phải có ít nhất 3 ký tự.');
      isValid = false;
    } else {
      clearError(fullnameInput);
    }

    // 2. Kiểm tra Email & Trùng lặp tài khoản trong localStorage
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      showError(emailInput, 'Vui lòng nhập địa chỉ email.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(emailValue)) {
      showError(emailInput, 'Email không hợp lệ (Ví dụ: student@fpt.edu.vn).');
      isValid = false;
    } else if (users.some(u => u.email.toLowerCase() === emailValue.toLowerCase())) {
      showError(emailInput, 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // 3. Kiểm tra Số điện thoại Việt Nam
    if (!phoneInput.value.trim()) {
      showError(phoneInput, 'Vui lòng nhập số điện thoại.');
      isValid = false;
    } else if (!PHONE_REGEX.test(phoneInput.value.trim())) {
      showError(phoneInput, 'Số điện thoại phải có 10 số (Bắt đầu bằng 03, 05, 07, 08, 09).');
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    // 4. Kiểm tra Mật khẩu
    if (!passwordInput.value) {
      showError(passwordInput, 'Vui lòng nhập mật khẩu.');
      isValid = false;
    } else if (passwordInput.value.length < 6) {
      showError(passwordInput, 'Mật khẩu phải chứa ít nhất 6 ký tự.');
      isValid = false;
    } else {
      clearError(passwordInput);
    }

    // 5. Kiểm tra Xác nhận mật khẩu
    if (!confirmPasswordInput.value) {
      showError(confirmPasswordInput, 'Vui lòng xác nhận lại mật khẩu.');
      isValid = false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
      showError(confirmPasswordInput, 'Mật khẩu xác nhận không trùng khớp.');
      isValid = false;
    } else {
      clearError(confirmPasswordInput);
    }

    // 6. Kiểm tra Checkbox điều khoản
    if (termsCheckbox && !termsCheckbox.checked) {
      showError(termsCheckbox, 'Bạn cần đồng ý với điều khoản sử dụng.');
      isValid = false;
    } else if (termsCheckbox) {
      clearError(termsCheckbox);
    }

    // Nếu toàn bộ dữ liệu hợp lệ: Lưu tài khoản vào localStorage (LAB 8)
    if (isValid) {
      const newUser = {
        fullname: fullnameInput.value.trim(),
        email: emailValue,
        phone: phoneInput.value.trim(),
        password: passwordInput.value
      };

      users.push(newUser);
      saveRegisteredUsers(users);

      if (typeof window.showToast === 'function') {
        window.showToast('Đăng ký thành công', `Chào mừng ${newUser.fullname}! Vui lòng đăng nhập.`, 'success');
      } else {
        alert(`Chúc mừng ${newUser.fullname}, bạn đã đăng ký tài khoản thành công!`);
      }

      registerForm.reset();

      // Tự động chuyển sang tab Đăng Nhập và điền sẵn email
      const loginTabBtn = document.querySelector('.auth-tab[data-target="loginTabContent"]');
      if (loginTabBtn) {
        loginTabBtn.click();
        const loginEmailInput = document.getElementById('loginEmail');
        if (loginEmailInput) {
          loginEmailInput.value = newUser.email;
        }
      }
    }
  });
}

/**
 * 2. Khởi tạo kiểm tra Form Đăng nhập (Login Form - LAB 8 & LAB 6)
 */
function initLoginValidation() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  [emailInput, passwordInput].forEach(attachRealtimeClear);

  // LAB 6: Sự kiện submit Form Đăng nhập
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    const emailValue = emailInput.value.trim();
    const passValue = passwordInput.value;

    if (!emailValue) {
      showError(emailInput, 'Vui lòng nhập email đăng nhập.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(emailValue)) {
      showError(emailInput, 'Định dạng email không hợp lệ.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (!passValue) {
      showError(passwordInput, 'Vui lòng nhập mật khẩu.');
      isValid = false;
    } else {
      clearError(passwordInput);
    }

    // Nếu cú pháp hợp lệ: Đối chiếu thông tin trong localStorage (LAB 8)
    if (isValid) {
      const users = getRegisteredUsers();
      const matchedUser = users.find(
        u => u.email.toLowerCase() === emailValue.toLowerCase() && u.password === passValue
      );

      if (!matchedUser) {
        showError(passwordInput, 'Email hoặc mật khẩu không chính xác.');
        return;
      }

      // Đăng nhập đúng: Lưu trạng thái đăng nhập vào TechGearStorage (LAB 8)
      const storage = window.TechGearStorage || localStorage;
      storage.setItem(CURRENT_USER_KEY, JSON.stringify(matchedUser));

      // Bắn sự kiện đồng bộ tức thì trên toàn bộ hệ thống & các tab
      window.dispatchEvent(new CustomEvent('techgear:statechange', { detail: { type: 'auth' } }));
      if (window.TechGearComponents && typeof window.TechGearComponents.syncAll === 'function') {
        window.TechGearComponents.syncAll();
      } else if (typeof window.updateUserHeaderUI === 'function') {
        window.updateUserHeaderUI();
      }

      if (typeof window.showToast === 'function') {
        window.showToast('Đăng nhập thành công', `Xin chào, ${matchedUser.fullname}! Đang chuyển hướng...`, 'success');
      } else {
        alert(`Xin chào, ${matchedUser.fullname}! Đăng nhập thành công.`);
      }

      loginForm.reset();

      setTimeout(() => {
        if (window.TechGearStorage && typeof window.TechGearStorage.navigate === 'function') {
          window.TechGearStorage.navigate('index.html');
        } else {
          window.location.href = 'index.html';
        }
      }, 1000);
    }
  });
}

/**
 * 3. Khởi tạo kiểm tra Form Liên hệ (Contact Form)
 */
function initContactValidation() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');

  [nameInput, emailInput, phoneInput, subjectInput, messageInput].forEach(attachRealtimeClear);

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (!nameInput.value.trim()) {
      showError(nameInput, 'Vui lòng nhập họ và tên của bạn.');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, 'Vui lòng cung cấp email liên hệ.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(emailInput.value.trim())) {
      showError(emailInput, 'Email không đúng định dạng.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (phoneInput && phoneInput.value.trim() && !PHONE_REGEX.test(phoneInput.value.trim())) {
      showError(phoneInput, 'Số điện thoại không hợp lệ (10 số).');
      isValid = false;
    } else if (phoneInput) {
      clearError(phoneInput);
    }

    if (!subjectInput.value.trim()) {
      showError(subjectInput, 'Vui lòng nhập chủ đề liên hệ.');
      isValid = false;
    } else {
      clearError(subjectInput);
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, 'Vui lòng nhập nội dung tin nhắn.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'Nội dung tin nhắn cần ít nhất 10 ký tự.');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      if (typeof window.showToast === 'function') {
        window.showToast('Gửi tin nhắn thành công', 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.', 'success');
      } else {
        alert('Cảm ơn bạn đã gửi liên hệ! TechGear sẽ phản hồi trong vòng 24h.');
      }
      contactForm.reset();
    }
  });
}

/**
 * 4. Chuyển đổi qua lại giữa tab Đăng ký và Đăng nhập (Hỗ trợ phím mũi tên theo chuẩn WAI-ARIA)
 */
function initAuthTabs() {
  const tabsContainer = document.querySelector('.auth-tabs');
  const tabs = document.querySelectorAll('.auth-tab');
  const tabContents = document.querySelectorAll('.auth-tab-content');

  if (!tabsContainer || tabs.length === 0 || tabContents.length === 0) return;

  tabsContainer.setAttribute('role', 'tablist');
  tabsContainer.setAttribute('aria-label', 'Chuyển đổi đăng ký và đăng nhập');

  tabs.forEach((tab, index) => {
    const targetId = tab.getAttribute('data-target');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
    tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
    if (targetId) tab.setAttribute('aria-controls', targetId);

    function activateTab() {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      tabContents.forEach((c) => {
        c.style.display = 'none';
        c.setAttribute('role', 'tabpanel');
        c.setAttribute('aria-hidden', 'true');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      tab.focus();

      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
        targetContent.setAttribute('aria-hidden', 'false');
      }
    }

    tab.addEventListener('click', activateTab);

    // Điều hướng bằng phím mũi tên trái / phải
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % tabs.length;
        tabs[nextIndex].click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + tabs.length) % tabs.length;
        tabs[prevIndex].click();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab();
      }
    });
  });

  // Tự động chuyển tab theo tham số URL (?mode=register hoặc hash #register)
  try {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const hash = window.location.hash || '';

    if (mode === 'register' || hash.includes('register')) {
      const regTab = document.querySelector('.auth-tab[data-target="registerTabContent"]');
      if (regTab) regTab.click();
    } else if (mode === 'login' || hash.includes('login')) {
      const loginTab = document.querySelector('.auth-tab[data-target="loginTabContent"]');
      if (loginTab) loginTab.click();
    }
  } catch (e) {}
}
