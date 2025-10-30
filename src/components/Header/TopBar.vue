<template>
  <div class="top-bar d-flex justify-content-center align-items-center px-4"
    style="height: 40px; background-color:#d3d3d3;">
    <div class="d-flex align-items-center gap-5 fw-bold">
      <!-- Dropdown trái -->
      <div class="dropdown">
        <a class="dropdown-toggle fw-bold text-dark text-decoration-none" href="#" role="button"
          data-bs-toggle="dropdown">
          DANH MỤC SÁCH
        </a>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#" @click.prevent="$emit('update-category', 'Comic')">Truyện tranh</a></li>
          <!-- Gọi thành phần comic từ cha -->
          <li><a class="dropdown-item" href="#" @click.prevent="$emit('update-category', 'Science fiction')">Sách khoa học viễn
              tưởng</a></li>
          <!-- Gọi thành phần sciFi từ cha -->
          <li><a class="dropdown-item" href="#" @click.prevent="$emit('update-category', 'Detective')">Tiểu thuyết trinh
              thám</a></li>
          <!-- Gọi thành phần detective từ cha -->
        </ul>
      </div>

      <router-link to="/" class="text-decoration-none text-dark">Home</router-link>
      <!-- Điều hướng về trang Home -->
      <router-link to="/san-pham" class="text-decoration-none text-dark">Sản phẩm</router-link>
      <!-- Điều hướng về trang Sản phẩm -->

      <div class="d-flex align-items-center gap-2">
        <img src="/shipper.png" alt="shipper" width="70" />
        <span>Ship cod toàn quốc</span>
      </div>

      <div class="d-flex align-items-center gap-2">
        <img src="/lienhe.png" alt="lienhe" width="18" />
        <span>SĐT: 0234567891</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Khai báo sự kiện update-category để gửi danh mục sách đã chọn lên component cha
defineEmits(['update-category'])
</script>
