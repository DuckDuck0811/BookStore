<template>
  <div class="navbar-wrapper">
    <nav class="navbar navbar-expand-lg py-3 rounded-3">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- Logo -->
        <a class="navbar-brand d-flex align-items-center me-3" href="#">
          <img src="/logo.png" alt="Logo" width="90" />
        </a>

        <!-- Thanh tìm kiếm ở giữa -->
        <div
          class="search-box d-flex align-items-center mx-auto flex-grow-1 justify-content-center"
          style="max-width: 600px"
        >
          <input
            type="text"
            class="form-control me-2"
            placeholder="Tìm kiếm sản phẩm..."
            v-model="keyword"
            @keyup.enter="search"
          />
          <button class="btn btn-success" style="width: 200px" @click="search">
            Tìm kiếm
          </button>
        </div>

        <!-- Giỏ hàng & đăng nhập -->
        <ul class="navbar-nav d-flex align-items-center gap-3 mb-0">
          <li class="nav-item d-flex align-items-center gap-1">
            <img src="/giohang.png" alt="Giỏ hàng" width="24" />
            <router-link to="/cart" class="text-decoration-none text-dark fw-semibold">
              Giỏ hàng
            </router-link>
          </li>

          <li v-if="auth.user" class="nav-item d-flex align-items-center gap-1">
            <img src="/login.png" alt="User" width="24" />
            <span class="fw-semibold text-success"
              >Xin chào, {{ auth.user.username }}</span
            >
            <button class="btn btn-outline-danger btn-sm ms-1" @click="auth.logout()">
              Đăng xuất
            </button>
          </li>

          <template v-else>
            <li class="nav-item d-flex align-items-center gap-1">
              <img src="/login.png" alt="Login" width="24" />
              <router-link to="/login" class="text-decoration-none text-dark fw-semibold"
                >Đăng nhập</router-link
              >
            </li>
            <li class="nav-item d-flex align-items-center gap-1">
              <img src="/dangky.png" alt="Đăng ký" width="24" />
              <router-link
                to="/register"
                class="text-decoration-none text-dark fw-semibold"
                >Đăng ký</router-link
              >
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/components/LoginAndRegister/Authstore";

const keyword = ref("");
const emit = defineEmits(["search"]);
const auth = useAuthStore();

onMounted(() => {
  auth.loadUser();
});

const search = () => {
  emit("search", keyword.value);
};
</script>

<style scoped>
/* Gói cả navbar vào giữa màn hình */
.navbar-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

/* Giới hạn chiều rộng toàn khối */
.navbar {
  width: 100%;
  max-width: 1200px;
  border-radius: 12px;
}

/* Giảm khoảng cách, cho gọn */
.search-box input {
  height: 45px;
}
.search-box button {
  height: 45px;
  width: 80px;
}
.navbar-nav li img {
  vertical-align: middle;
}

@media (max-width: 992px) {
  .navbar .container {
    flex-direction: column;
    align-items: stretch;
  }
  .search-box {
    width: 100%;
    margin: 10px 0;
  }
  .navbar-nav {
    justify-content: center;
  }
}
</style>
