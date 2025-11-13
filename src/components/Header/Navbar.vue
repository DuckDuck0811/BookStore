<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-white shadow-sm rounded-4 py-3 px-4"
  >
    <div class="container d-flex align-items-center justify-content-between">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img src="/logo.png" alt="Logo" width="110" class="me-2" />
        <span class="fs-4 fw-bold text-success">MyShop</span>
      </router-link>

      <!-- Search -->
      <form
        @submit.prevent="search"
        class="d-flex flex-grow-1 mx-4 position-relative"
        style="max-width: 600px"
      >
        <input
          type="search"
          class="form-control rounded-pill ps-4 pe-5 shadow-sm"
          placeholder="Tìm kiếm sản phẩm..."
          v-model="keyword"
          aria-label="Search"
          autocomplete="off"
        />
        <button
          type="submit"
          class="btn btn-success position-absolute top-50 end-0 translate-middle-y rounded-pill px-4"
          style="height: 38px; margin-right: 6px"
          aria-label="Tìm kiếm"
        >
          <i class="bi bi-search fs-5"></i>
        </button>
      </form>

      <!-- User & Cart -->
      <ul
        class="navbar-nav d-flex align-items-center gap-3 mb-0 flex-nowrap"
        style="min-width: 200px"
      >
        <li class="nav-item">
          <router-link
            to="/cart"
            class="nav-link d-flex align-items-center text-dark position-relative"
            aria-label="Giỏ hàng"
          >
            <i class="bi bi-cart-fill fs-5 me-2"></i>
            <span class="fw-semibold">Giỏ hàng</span>
            <!-- Badge số lượng sp trong giỏ hàng -->
            <!--
            <span
              v-if="cartCount > 0"
              class="badge bg-danger rounded-circle position-absolute top-0 start-100 translate-middle p-1"
              >{{ cartCount }}</span
            >
            -->
          </router-link>
        </li>

        <template v-if="auth.user">
          <li class="nav-item dropdown">
            <a
              href="#"
              class="nav-link d-flex align-items-center gap-2 text-success dropdown-toggle"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style="user-select: none"
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
                Xin chào, {{ auth.user.username }}
              </span>
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end shadow rounded-3"
              aria-labelledby="userDropdown"
            >
              <li>
                <router-link class="dropdown-item" to="/profile"
                  >Thông tin cá nhân</router-link
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button
                  class="dropdown-item text-danger fw-semibold"
                  @click="auth.logout()"
                  type="button"
                >
                  <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
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

onMounted(() => auth.loadUser());

const search = () => {
  emit("search", keyword.value.trim());
};
</script>

<style scoped>
.navbar-nav .nav-link:hover,
.navbar-nav .dropdown-item:hover {
  color: #0f5132 !important;
  background-color: #d1e7dd;
  transition: background-color 0.3s ease;
  border-radius: 0.375rem;
  cursor: pointer;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 6px 12px rgb(0 0 0 / 0.15);
}

.nav-link.dropdown-toggle {
  cursor: pointer;
  transition: color 0.3s ease;
}

.text-truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar .container {
    flex-wrap: wrap;
  }
  form.d-flex {
    order: 3;
    width: 100% !important;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .navbar-nav {
    order: 2;
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
}
</style>
