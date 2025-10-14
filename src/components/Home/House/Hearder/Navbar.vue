<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary py-3">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Logo -->
      <img src="/logo.png" alt="Logo" width="120" />

      <!-- Search -->
      <div class="d-flex flex-grow-1 mx-4" style="max-width: 600px">
        <input
          type="text"
          class="form-control me-2"
          placeholder="Tìm kiếm sản phẩm..."
          style="width: 600px; height: 50px"
          v-model="keyword"
          @keyup.enter="search"
        />
        <button class="btn btn-success" style="width: 150px" @click="search">
          Tìm kiếm
        </button>
      </div>
      <!-- Giỏ hàng -->
      <ol class="breadcrumb d-flex align-items-center gap-4 mb-0">
        <li class="breadcrumb-item d-flex align-items-center gap-2">
          <img src="/giohang.png" alt="Giỏ hàng" width="30" />
          <router-link to="/cart" class="text-decoration-none text-dark fw-bold">
            Giỏ hàng
          </router-link>
        </li>

        <!-- Đã đăng nhập -->
        <li v-if="auth.user" class="breadcrumb-item d-flex align-items-center gap-2">
          <img src="/login.png" alt="User" width="30" />
          <span class="fw-bold text-success"> Xin chào, {{ auth.user.username }} </span>
          <button class="btn btn-sm btn-outline-danger ms-2" @click="auth.logout()">
            Đăng xuất
          </button>
        </li>

        <!-- Chưa đăng nhập -->
        <template v-else>
          <li class="breadcrumb-item d-flex align-items-center gap-2">
            <img src="/login.png" alt="Login" width="30" />
            <router-link to="/login" class="text-decoration-none text-dark fw-bold">
              Đăng nhập
            </router-link>
          </li>
          <li class="breadcrumb-item d-flex align-items-center gap-2">
            <img src="/dangky.png" alt="Đăng ký" width="30" />
            <router-link to="/register" class="text-decoration-none text-dark fw-bold">
              Đăng ký
            </router-link>
          </li>
        </template>
      </ol>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/components/LoginAndRegister/Authstore";

const keyword = ref("");
// Lưu từ khóa tìm kiếm
const emit = defineEmits(["search"]);
// Lấy sự kiện search từ component cha
const auth = useAuthStore();
// Quản lý trạng thái xác thực người dùng

onMounted(() => {
  auth.loadUser();
});
// Kiểm tra trạng thái đăng nhập khi component được gắn vào DOM
const search = () => {
  emit("search", keyword.value);
};
// Phát ra sự kiện search với từ khóa hiện tại
</script>

<style scoped>
.breadcrumb-item + .breadcrumb-item::before {
  content: "" !important;
}
</style>
