<template>
  <div class="top-bar-container">
    <div class="top-bar d-flex justify-content-start align-items-center px-4">
      <!-- Menu trái -->
      <router-link to="/" class="nav-link px-2 text-dark fw-semibold">Home</router-link>
      <router-link to="/san-pham" class="nav-link px-2 text-dark fw-semibold">Sản phẩm</router-link>
      <router-link to="/gioi-thieu" class="nav-link px-2 text-dark fw-semibold">Giới thiệu</router-link>
      <router-link to="/lien-he" class="nav-link px-2 text-dark fw-semibold">Liên hệ</router-link>
    </div>

    <!-- Chữ chạy ngang -->
    <div class="marquee-container px-4">
      <div class="marquee-text">
        Trang sách online uy tín, đa dạng thể loại, giao hàng nhanh chóng!
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-bar-container {
  background-color: #e9ecef;
  user-select: none;
}

/* Thanh menu */
.top-bar {
  height: 48px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid #ccc;
}

/* Nav link style */
.nav-link {
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0 12px;
  line-height: 48px; /* căn giữa theo chiều cao */
}

.nav-link:hover {
  color: #0d6efd !important;
  text-decoration: underline;
}

/* Container chứa chữ chạy */
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
  height: 24px;
  position: relative;
  background-color: #f0f0f0;
  border-top: 1px solid #ccc;
  font-style: italic;
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
}

/* Text chạy */
.marquee-text {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 15s linear infinite;
}

/* Animation chữ chạy */
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@media (max-width: 768px) {
  .top-bar {
    justify-content: center;
  }
  .nav-link {
    padding: 0 8px;
    font-size: 13px;
  }
  .marquee-container {
    height: 20px;
    font-size: 13px;
  }
}
</style>
