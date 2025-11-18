<template>
  <nav
    class="navbar navbar-expand-lg shadow-sm rounded-4 py-3 px-4 top-nav"
    :class="{ 'dark-mode': isDark }"
  >
    <div class="container d-flex align-items-center justify-content-between">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img src="/logo.png" alt="Logo" width="110" class="me-2 logo-animate" />
        <span class="fs-4 fw-bold brand-text">BookZone</span>
      </router-link>

      <!-- Search -->
      <form
        @submit.prevent="search"
        class="search-wrapper flex-grow-1 mx-4 position-relative"
        style="max-width: 600px"
      >
        <i class="bi bi-search search-icon"></i>
        <input
          type="search"
          class="search-input form-control ps-5 pe-5 rounded-pill shadow-sm"
          placeholder="Tìm kiếm sách, tác giả, thể loại..."
          v-model="keyword"
          aria-label="Search"
          autocomplete="off"
        />
        <button type="submit" class="search-btn" aria-label="Tìm kiếm">
          <i class="bi bi-arrow-right-circle-fill"></i>
        </button>
      </form>

      <!-- Right Side -->
      <ul
        class="navbar-nav d-flex align-items-center gap-3 mb-0 flex-nowrap"
        style="min-width: 230px"
      >
        <!-- Cart -->
        <li class="nav-item position-relative">
          <router-link
            to="/cart"
            class="nav-link text-dark d-flex align-items-center position-relative cart-link"
          >
            <i class="bi bi-cart-fill fs-5 me-2"></i>
            <span class="fw-semibold">Giỏ hàng</span>
          </router-link>
        </li>

        <!-- User -->
        <template v-if="auth.user">
          <li class="nav-item dropdown">
            <a
              href="#"
              class="nav-link d-flex align-items-center gap-2 text-success dropdown-toggle"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                v-if="auth.user.avatar"
                :src="auth.user.avatar"
                alt="avatar"
                class="rounded-circle border border-2 border-success"
                style="width: 36px; height: 36px; object-fit: cover"
              />
              <i v-else class="bi bi-person-circle fs-4"></i>
              <span class="fw-semibold text-truncate" style="max-width: 120px">
                {{ auth.user.username }}
              </span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow rounded-3 animate-dropdown">
              <li>
                <router-link class="dropdown-item" to="/profile">
                  <i class="bi bi-person-lines-fill me-2"></i>Thông tin cá nhân
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button
                  class="dropdown-item text-danger fw-semibold"
                  @click="auth.logout()"
                >
                  <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                </button>
              </li>
            </ul>
          </li>
        </template>

        <template v-else>
          <li class="nav-item">
            <router-link
              to="/login"
              class="nav-link text-dark fw-semibold d-flex align-items-center gap-1"
            >
              <i class="bi bi-box-arrow-in-right fs-5"></i> Đăng nhập
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/register"
              class="nav-link text-dark fw-semibold d-flex align-items-center gap-1"
            >
              <i class="bi bi-pencil-square fs-5"></i> Đăng ký
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/Authstore";

const keyword = ref("");
const emit = defineEmits(["search"]);
const auth = useAuthStore();

const isDark = ref(false);
onMounted(() => {
  auth.loadUser();
  const theme = localStorage.getItem("theme");
  if (theme === "dark") isDark.value = true;
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

const search = () => {
  emit("search", keyword.value.trim());
};
</script>

<style scoped>
/* Navbar background */
.top-nav {
  background: linear-gradient(90deg, #ffffff, #f5f8ff);
  border: 1px solid #e6e6e6;
  transition: all 0.3s ease;
}
.dark-mode {
  background: linear-gradient(90deg, #1f1f1f, #2b2b2b);
  color: #f8f9fa;
}

/* Brand */
.brand-text {
  color: #198754;
  transition: color 0.3s ease;
}
.brand-text:hover {
  color: #0d6efd;
}

/* Logo animation */
.logo-animate {
  transition: transform 0.3s ease, filter 0.3s ease;
}
.logo-animate:hover {
  transform: rotate(-5deg) scale(1.05);
  filter: drop-shadow(0 0 4px #28a745);
}

/* search bar */
.search-wrapper {
  position: relative;
  transition: all 0.3s ease;
}
.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}
.search-input {
  height: 44px;
  border: 1.5px solid #cde4d3;
  background-color: #fff;
  transition: all 0.3s ease;
}
.search-input:focus {
  border-color: #28a745;
  box-shadow: 0 0 12px rgba(25, 135, 84, 0.3);
  padding-left: 52px;
}
.search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  font-size: 1.6rem;
  color: #198754;
  cursor: pointer;
  transition: all 0.3s ease;
}
.search-btn:hover {
  transform: translateY(-50%) rotate(15deg) scale(1.15);
  color: #0d6efd;
}
.search-input:focus ~ .search-icon {
  color: #198754;
  transform: translateY(-50%) scale(1.1);
}

/* Dark mode */
.dark-mode .search-input {
  background-color: #2b2b2b;
  border-color: #444;
  color: #f8f9fa;
}
.dark-mode .search-icon {
  color: #bbb;
}
.dark-mode .search-btn {
  color: #00b37a;
}

/* Cart */
.cart-link {
  transition: transform 0.25s ease;
}
.cart-link:hover {
  transform: translateY(-2px);
}
.cart-badge {
  position: absolute;
  top: -4px;
  right: -10px;
  font-size: 10px;
  border-radius: 50%;
  padding: 3px 6px;
  animation: bounce 1.5s infinite;
}
@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Dropdown animation */
.animate-dropdown {
  animation: fadeIn 0.25s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode dropdown */
.dark-mode .dropdown-menu {
  background-color: #2b2b2b;
  color: #fff;
}
.dark-mode .dropdown-item:hover {
  background-color: #343a40;
}

/* Theme toggle */
.theme-toggle {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.theme-toggle:hover {
  transform: rotate(15deg) scale(1.1);
  box-shadow: 0 0 10px rgba(25, 135, 84, 0.4);
}

@media (max-width: 768px) {
  .navbar .container {
    flex-wrap: wrap;
  }
  form.search-wrapper {
    order: 3;
    width: 100% !important;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .navbar-nav {
    order: 2;
    width: 100%;
    justify-content: center;
  }
}
</style>
