<template>
  <!-- Footer -->
  <footer class="footer bg-gray-dark py-5 text-white mt-auto">
    <div class="container">
      <div class="row">
        <!-- Giới thiệu -->
        <div class="col-md-4 mb-4 mb-md-0">
          <h5 class="fw-bold mb-3">MyBookStore</h5>
          <p class="small">
            Trang web mua sách online uy tín, cung cấp đa dạng đầu sách cho mọi đối tượng.
          </p>
          <div class="d-flex gap-3 mt-3">
            <a href="https://facebook.com" target="_blank" rel="noopener" class="social-link" aria-label="Facebook">
              <i class="bi bi-facebook fs-4"></i>
            </a>
            <a href="https://zalo.me" target="_blank" rel="noopener" class="social-link" aria-label="Zalo">
              <i class="bi bi-chat-dots fs-4"></i>
            </a>
            <a href="mailto:support@mybookstore.com" class="social-link" aria-label="Email">
              <i class="bi bi-envelope fs-4"></i>
            </a>
          </div>
        </div>

        <!-- Liên kết nhanh -->
        <div class="col-md-4 mb-4 mb-md-0">
          <h6 class="fw-bold mb-3">Liên kết nhanh</h6>
          <ul class="list-unstyled small">
            <li>
              <router-link to="/" class="footer-link">Trang chủ</router-link>
            </li>
            <li>
              <router-link to="/products" class="footer-link">Sản phẩm</router-link>
            </li>
            <li>
              <router-link to="/about" class="footer-link">Giới thiệu</router-link>
            </li>
            <li>
              <router-link to="/contact" class="footer-link">Liên hệ</router-link>
            </li>
          </ul>
        </div>

        <!-- Thông tin liên hệ -->
        <div class="col-md-4">
          <h6 class="fw-bold mb-3">Liên hệ</h6>
          <p class="small mb-2"><i class="bi bi-envelope me-2"></i>support@mybookstore.com</p>
          <p class="small mb-2"><i class="bi bi-telephone me-2"></i>023 456 7891</p>
          <p class="small mb-0"><i class="bi bi-geo-alt me-2"></i>Hà Nội, Việt Nam, Trái Đất</p>
        </div>
      </div>

      <hr class="border-light my-4" />

      <div class="text-center small">
        © 2025 MyBookStore. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  font-size: 15px;
  background-color: #343a40; /* xám đậm */
  color: #f8f9fa; /* trắng sáng */
}

.footer-link {
  color: #f8f9fa;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #adb5bd; /* màu xám nhạt khi hover */
  text-decoration: underline;
}

.social-link {
  color: #f8f9fa;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #adb5bd;
  transform: scale(1.2);
}

hr.border-light {
  opacity: 0.3;
  border-color: #f8f9fa;
}
</style>
