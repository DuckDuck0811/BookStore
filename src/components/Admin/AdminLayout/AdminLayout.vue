<template>
  <div class="d-flex">
    <aside class="sidebar bg-light p-3" style="width: 200px; height: 100vh">
      <h5 class="mb-4">Admin</h5>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/admin/home" class="nav-link" active-class="active"
            >Home</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/admin/product" class="nav-link" active-class="active"
            >Product</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/admin/order" class="nav-link" active-class="active"
            >Order</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/admin/revenue" class="nav-link" active-class="active"
            >Biểu đồ</router-link
          >
        </li>
        <li class="nav-item">
          <button @click="handleLogout" class="btn btn-outline-danger mt-3 w-100">
            Đăng xuất
          </button>
        </li>
      </ul>
    </aside>

    <div class="flex-grow-1 p-3">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/components/LoginAndRegister/Authstore";

const router = useRouter();
const auth = useAuthStore();

const handleLogout = () => {
  if (confirm("Bạn có chắc muốn đăng xuất không?")) {
    auth.logout();
    router.push("/login");
  }
};
</script>
