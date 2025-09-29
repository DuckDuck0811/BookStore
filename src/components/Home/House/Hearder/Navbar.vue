<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary py-3">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Logo -->
      <img src="/logo.png" alt="Logo" width="120" />

      <!-- Search -->
      <div class="d-flex flex-grow-1 mx-4" style="max-width: 600px;">
        <input type="text" class="form-control me-2" placeholder="Tìm kiếm sản phẩm..."
          style="width: 600px; height: 50px;" v-model="keyword" @keyup.enter="search" />
        <button class="btn btn-success" style="width: 150px;" @click="search">
          Tìm kiếm
        </button>
      </div>

      <ol class="breadcrumb d-flex align-items-center gap-4 mb-0">
        <li class="breadcrumb-item d-flex align-items-center gap-2">
          <img src="/giohang.png" alt="Giỏ hàng" width="30" />
          <router-link to="/cart" class="text-decoration-none text-dark fw-bold">
            Giỏ hàng
          </router-link>
        </li>
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
      </ol>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue"

const keyword = ref("")
const emit = defineEmits(["search"])

const search = () => {
  emit("search", keyword.value)
}
</script>

<style scoped>
.breadcrumb-item+.breadcrumb-item::before {
  content: "" !important;
}
</style>
