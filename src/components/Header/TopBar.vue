<template>
  <div class="top-bar-container shadow-sm">
    <!-- Navbar -->
    <div class="top-bar d-flex justify-content-between align-items-center px-4">
      <!-- Logo + Menu -->
      <div class="d-flex align-items-center gap-3">
        <div class="logo d-flex align-items-center">
          <img src="/logo.png" alt="logo" class="logo-img me-2" />
          <span class="fw-bold fs-5 text-primary">BookZone</span>
        </div>

        <div class="menu d-flex align-items-center">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/san-pham" class="nav-link">Sản phẩm</router-link>
          <router-link to="/gioi-thieu" class="nav-link">Giới thiệu</router-link>
          <router-link to="/lien-he" class="nav-link">Liên hệ</router-link>
        </div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <!-- Account -->
        <div class="icon-btn" title="Tài khoản">
          <i class="bi bi-person-circle"></i>
        </div>
      </div>
    </div>

    <!-- Marquee -->
    <div class="marquee-container px-4">
      <div class="marquee-text">
        🌟 Trang sách online uy tín, đa dạng thể loại, giao hàng nhanh chóng! 🌟
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-bar-container {
  background: linear-gradient(90deg, #f8f9fa, #eef2ff);
  user-select: none;
  transition: all 0.3s ease;
}

/* Navbar */
.top-bar {
  height: 60px;
  font-size: 15px;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
  position: relative;
  z-index: 10;
}

/* Logo */
.logo-img {
  height: 36px;
  width: 36px;
  border-radius: 8px;
  object-fit: cover;
}

/* Nav links */
.nav-link {
  position: relative;
  color: #333;
  text-decoration: none;
  padding: 0 14px;
  line-height: 60px;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 10px;
  width: 0%;
  height: 2px;
  background: linear-gradient(90deg, #007bff, #00c6ff);
  transition: all 0.3s ease;
  transform: translateX(-50%);
  border-radius: 2px;
}

.nav-link:hover {
  color: #007bff;
}

.nav-link:hover::after {
  width: 60%;
}

/* Search box */
.search-box {
  position: relative;
}

.search-box input {
  width: 180px;
  padding-right: 28px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.search-box input:focus {
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
  width: 220px;
}

.search-icon {
  position: absolute;
  right: 10px;
  color: #666;
  font-size: 16px;
  cursor: pointer;
}

.icon-btn {
  font-size: 22px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  color: #007bff;
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -8px;
  font-size: 10px;
  border-radius: 50%;
  padding: 3px 6px;
}

/* Marquee */
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
  height: 28px;
  position: relative;
  background: #f9fafc;
  border-top: 1px solid #ddd;
  font-style: italic;
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.marquee-text {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 14s linear infinite;
  text-shadow: 0 0 6px rgba(0, 123, 255, 0.2);
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    gap: 8px;
    height: auto;
    padding: 10px 0;
  }

  .search-box input {
    width: 140px;
  }

  .marquee-container {
    height: 22px;
    font-size: 13px;
  }

  .menu {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
