<template>
  <div class="d-flex">
    <aside class="sidebar bg-light p-3" style="width: 200px; height: 100vh">
      <!-- Tạo sidebar của trang adminh gồm Home product Order Chart  -->
      <h5 class="mb-4">Admin</h5>
      <!-- Tiêu đề Admin -->
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/admin/home" class="nav-link" active-class="active"
            >Home</router-link
          >
          <!-- Trang Home -->
        </li>
        <li class="nav-item">
          <router-link to="/admin/product" class="nav-link" active-class="active"
            >Product</router-link
          >
        </li>
        <!-- Trang Order -->
        <li class="nav-item">
          <router-link to="/admin/order" class="nav-link" active-class="active"
            >Order</router-link
          >
        </li>
        <!-- Trang Chart -->
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="chartDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Chart
          </a>
          <ul class="dropdown-menu" aria-labelledby="chartDropdown">
            <li>
              <router-link to="/admin/revenue" class="dropdown-item">
                Total revenue
              </router-link>
            </li>
            <li>
              <router-link to="/admin/bestseller" class="dropdown-item">
                Best selling product
              </router-link>
            </li>
          </ul>
        </li>
        <li class="nav-item">
          <router-link to="/admin/category" class="nav-link" active-class="active"
            >Category</router-link
          >
        </li>

        <!-- Nút đăng xuất -->
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
import { useRouter } from "vue-router"; //gọi router từ file router.js
import { useAuthStore } from "@/components/LoginAndRegister/Authstore";
//gọi file Authstore để sử dụng các chức năng trong đó
const router = useRouter();
const auth = useAuthStore();

//Hàm dùng để đăng xuất
const handleLogout = () => {
  if (confirm("Bạn có chắc muốn đăng xuất không?")) {
    auth.logout(); //gọi hàm đăng xuất
    router.push("/login"); //chuyển lại về trang đăng nhập khi đã đăng xuất
  }
};
</script>
