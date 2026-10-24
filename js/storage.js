/**
 * ==============================================================================
 * TechGear Store - Unified Storage & Cross-Page State Sync Engine (js/storage.js)
 * Môn học: WEB1044 - Lập trình JavaScript cơ bản - FPT Polytechnic
 * ==============================================================================
 * MỤC TIÊU VÀ ĐẶC TẢ KỸ THUẬT:
 * 1. ĐÁP ỨNG TIÊU CHÍ LAB 7 & LAB 8:
 *    - Sử dụng chuẩn localStorage & sessionStorage lưu trữ giỏ hàng, đơn hàng, tài khoản.
 * 2. ĐỒNG BỘ 100% TUYỆT ĐỐI GIỮA TẤT CẢ CÁC TRANG HTML:
 *    - Khi chạy trên Web Server (localhost / Live Server / http / https):
 *      Đồng bộ qua localStorage native và sự kiện 'storage' của trình duyệt.
 *    - Khi mở trực tiếp file nội bộ (file:/// protocol trên Mozilla Firefox, Chrome, Edge, Safari):
 *      Giải quyết triệt để rào cản "strict_origin_policy" (cơ chế bảo mật cách ly nguồn file của Firefox)
 *      bằng mô hình 3 lớp đồng bộ thông minh (3-Layer Sync Architecture):
 *        + Lớp 1: localStorage bản địa của từng file HTML
 *        + Lớp 2: window.name context mirroring (Bộ nhớ ngữ cảnh duyệt tab của HTML5)
 *        + Lớp 3: URL State Bridge (#tg_sync=...) tự động truyền tải trạng thái khi điều hướng
 *                 và lập tức dọn sạch thanh địa chỉ bằng window.history.replaceState()
 * 3. AN TOÀN VÀ TIN CẬY (FAIL-SAFE):
 *    - Bọc try-catch toàn diện, không bao giờ gây lỗi uncaught exception.
 *    - Tự động kích hoạt Custom Event 'techgear:statechange' để UI phản hồi tức thì.
 */

(function () {
  'use strict';

  // Danh sách các khóa dữ liệu cần đồng bộ xuyên suốt toàn bộ Website
  const SYNCED_KEYS = [
    'techgear_current_user',     // Thông tin tài khoản đang đăng nhập (LAB 8)
    'techgear_users',            // Danh sách các tài khoản đã đăng ký (LAB 8)
    'techgear_cart',             // Mảng các sản phẩm trong giỏ hàng (LAB 7)
    'techgear_cart_initialized', // Cờ đánh dấu đã nạp giỏ hàng mẫu lần đầu (tránh re-seed)
    'techgear_coupon',           // Mã giảm giá đang áp dụng (LAB 7)
    'techgear_orders',           // Danh sách đơn hàng đã đặt thành công (LAB 7)
    'techgear_recent_views',     // Danh sách sản phẩm đã xem gần đây (LAB 7)
    'techgear_detail_product_id' // ID sản phẩm đang xem trong phiên (LAB 5 & LAB 7)
  ];

  const STATE_PREFIX = '__techgear_state__:';
  const HASH_PREFIX = '#tg_sync=';

  const TechGearStorage = {
    keys: SYNCED_KEYS,

    /**
     * Khởi tạo tầng lưu trữ và đồng bộ hóa ngay khi nạp file JS
     */
    init: function () {
      // 1. Thử nạp trạng thái từ URL Hash (#tg_sync=...) nếu được truyền tới
      this.hydrateFromURL();

      // 2. Thử nạp trạng thái từ window.name
      this.hydrateFromWindowName();

      // 3. Sao lưu trạng thái hiện tại ngược trở lại window.name
      this.syncToWindowName();

      // 4. Nếu đang chạy giao thức file:///, kích hoạt cầu nối liên kết nội bộ
      if (this.isFileProtocol()) {
        this.attachFileUriBridge();
      }
    },

    /**
     * Kiểm tra xem trang có đang mở qua giao thức file:/// hay không
     */
    isFileProtocol: function () {
      try {
        return window.location.protocol === 'file:';
      } catch (e) {
        return false;
      }
    },

    /**
     * 1. Nạp dữ liệu từ URL Hash nếu có và dọn sạch thanh địa chỉ URL
     */
    hydrateFromURL: function () {
      try {
        const hash = window.location.hash || '';
        if (hash.startsWith(HASH_PREFIX)) {
          const encoded = hash.substring(HASH_PREFIX.length);
          if (encoded) {
            const jsonStr = decodeURIComponent(encoded);
            const payload = JSON.parse(jsonStr);

            if (payload && typeof payload === 'object') {
              // Đồng bộ toàn bộ các khóa trong SYNCED_KEYS:
              // Khóa có dữ liệu -> cập nhật; Khóa không có (bị xóa) -> xóa bỏ khỏi localStorage
              SYNCED_KEYS.forEach(key => {
                const val = payload[key];
                if (val !== null && val !== undefined) {
                  try {
                    localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
                  } catch (e) {}
                } else {
                  try {
                    localStorage.removeItem(key);
                  } catch (e) {}
                }
              });
            }
          }

          // Dọn sạch hash trên thanh địa chỉ để URL giữ nguyên chuẩn đẹp (VD: detail.html)
          try {
            if (window.history && typeof window.history.replaceState === 'function') {
              const cleanUrl = window.location.pathname + window.location.search;
              window.history.replaceState(null, document.title, cleanUrl);
            }
          } catch (e) {
            // Firefox trên file:/// ném SecurityError do origin null
          }

          // Đảm bảo thanh địa chỉ không còn lưu vết hash sync cũ
          try {
            if (window.location.hash && window.location.hash.startsWith(HASH_PREFIX)) {
              window.location.hash = '';
            }
          } catch (e) {}
        }
      } catch (err) {
        console.warn('[TechGearStorage] Lỗi khi nạp dữ liệu từ URL hash:', err);
      }
    },

    /**
     * 2. Nạp dữ liệu từ window.name (Nguồn chân lý - Single Source of Truth của Tab)
     */
    hydrateFromWindowName: function () {
      try {
        if (window.name && window.name.startsWith(STATE_PREFIX)) {
          const jsonStr = window.name.substring(STATE_PREFIX.length);
          const payload = JSON.parse(jsonStr);

          if (payload && typeof payload === 'object') {
            // Đồng bộ toàn bộ các khóa trong SYNCED_KEYS:
            // Khóa có trong window.name -> nạp; Khóa không có -> dọn sạch localStorage tương ứng
            SYNCED_KEYS.forEach(key => {
              const val = payload[key];
              if (val !== null && val !== undefined) {
                try {
                  localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
                } catch (e) {}
              } else {
                try {
                  localStorage.removeItem(key);
                } catch (e) {}
              }
            });
          }
        }
      } catch (err) {
        console.warn('[TechGearStorage] Lỗi khi nạp từ window.name:', err);
      }
    },

    /**
     * 3. Đồng bộ hóa toàn bộ trạng thái hiện tại vào window.name
     */
    syncToWindowName: function () {
      try {
        const payload = {};
        SYNCED_KEYS.forEach(key => {
          try {
            const val = localStorage.getItem(key);
            if (val !== null && val !== undefined) {
              payload[key] = val;
            }
          } catch (e) {}
        });
        window.name = STATE_PREFIX + JSON.stringify(payload);
      } catch (err) {}
    },

    /**
     * Đọc giá trị an toàn: Ưu tiên window.name nếu đã có phiên, fallback sang localStorage
     */
    getItem: function (key) {
      try {
        if (window.name && window.name.startsWith(STATE_PREFIX)) {
          const payload = JSON.parse(window.name.substring(STATE_PREFIX.length));
          if (payload && typeof payload === 'object') {
            if (payload[key] !== undefined && payload[key] !== null) {
              return payload[key];
            }
            // Nếu window.name đã kích hoạt phiên nhưng không có key này -> Đã bị xóa (VD: Đăng xuất)
            try {
              localStorage.removeItem(key);
            } catch (e) {}
            return null;
          }
        }
      } catch (e) {}

      try {
        const localVal = localStorage.getItem(key);
        if (localVal !== null) return localVal;
      } catch (e) {}

      return null;
    },

    /**
     * Ghi giá trị an toàn: Lưu vào localStorage + window.name + bắn event
     */
    setItem: function (key, value) {
      const strVal = typeof value === 'string' ? value : JSON.stringify(value);
      try {
        localStorage.setItem(key, strVal);
      } catch (e) {}

      this.syncToWindowName();

      // Bắn event đồng bộ tức thì
      try {
        window.dispatchEvent(new CustomEvent('techgear:statechange', { detail: { key, value: strVal } }));
      } catch (e) {}

      // Cập nhật lại liên kết trên file:/// nếu cần
      if (this.isFileProtocol()) {
        this.refreshInternalLinks();
      }
    },

    /**
     * Xóa giá trị an toàn: Xóa khỏi localStorage + window.name + xóa hash URL + bắn event
     */
    removeItem: function (key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {}

      try {
        if (window.name && window.name.startsWith(STATE_PREFIX)) {
          const payload = JSON.parse(window.name.substring(STATE_PREFIX.length));
          delete payload[key];
          window.name = STATE_PREFIX + JSON.stringify(payload);
        }
      } catch (e) {}

      // Dọn sạch hash trên URL nếu hash hiện tại chứa key vừa xóa (tránh F5 nạp lại)
      try {
        if (window.location.hash && window.location.hash.startsWith(HASH_PREFIX)) {
          try {
            if (window.history && typeof window.history.replaceState === 'function') {
              window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }
          } catch (e) {}
          if (window.location.hash && window.location.hash.startsWith(HASH_PREFIX)) {
            window.location.hash = '';
          }
        }
      } catch (e) {}

      try {
        window.dispatchEvent(new CustomEvent('techgear:statechange', { detail: { key, value: null } }));
      } catch (e) {}

      if (this.isFileProtocol()) {
        this.refreshInternalLinks();
      }
    },

    /**
     * Xuất toàn bộ dữ liệu cần đồng bộ thành một gói Object
     */
    getExportState: function () {
      const state = {};
      SYNCED_KEYS.forEach(key => {
        const val = this.getItem(key);
        if (val !== null && val !== undefined) {
          state[key] = val;
        }
      });
      return state;
    },

    /**
     * Tạo chuỗi Hash đồng bộ để gắn vào URL
     */
    createSyncHash: function () {
      try {
        const state = this.getExportState();
        return HASH_PREFIX + encodeURIComponent(JSON.stringify(state));
      } catch (e) {
        return '';
      }
    },

    /**
     * Chuẩn bị URL đích khi chuyển trang trên giao thức file:///
     */
    prepareUrl: function (url) {
      if (!url) return url;
      if (!this.isFileProtocol()) return url;

      try {
        const syncHash = this.createSyncHash();
        const base = url.split('#')[0];
        return base + syncHash;
      } catch (e) {
        return url;
      }
    },

    /**
     * Chuyển trang có tích hợp truyền trạng thái an toàn
     */
    navigate: function (url) {
      const targetUrl = this.prepareUrl(url);
      window.location.href = targetUrl;
    },

    /**
     * Kiểm tra một đường dẫn có phải liên kết nội bộ .html hay không
     */
    isInternalHtmlLink: function (href) {
      if (!href) return false;
      if (
        href.startsWith('#') ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:')
      ) {
        return false;
      }
      return (
        href.endsWith('.html') ||
        href.includes('.html?') ||
        href.includes('.html#') ||
        (!href.includes(':') && !href.includes('/'))
      );
    },

    /**
     * Cập nhật tất cả các liên kết nội bộ trên trang với hash đồng bộ mới nhất
     */
    refreshInternalLinks: function () {
      if (!this.isFileProtocol()) return;
      try {
        const syncHash = this.createSyncHash();
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
          const rawHref = link.getAttribute('href');
          if (this.isInternalHtmlLink(rawHref)) {
            const base = rawHref.split('#')[0];
            link.setAttribute('href', base + syncHash);
          }
        });
      } catch (e) {}
    },

    /**
     * Cài đặt bộ lắng nghe tự động chuyển trạng thái khi click liên kết trên file:///
     */
    attachFileUriBridge: function () {
      const self = this;

      // 1. Event Delegation ở Capture Phase: Cập nhật URL ngay thời điểm người dùng click
      document.addEventListener('click', function (event) {
        const link = event.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (self.isInternalHtmlLink(href)) {
          link.setAttribute('href', self.prepareUrl(href));
        }
      }, true);

      // 2. Làm mới các thẻ liên kết khi trang nạp xong DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          self.refreshInternalLinks();
        });
      } else {
        self.refreshInternalLinks();
      }
    }
  };

  // Khởi động ngay lập tức
  TechGearStorage.init();

  // Đăng ký vào phạm vi toàn cục
  window.TechGearStorage = TechGearStorage;
})();
