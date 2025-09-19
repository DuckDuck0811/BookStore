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
          <li><a class="dropdown-item" href="#">Sách văn học</a></li>
          <li><a class="dropdown-item" href="#">Sách thiếu nhi</a></li>
          <li><a class="dropdown-item" href="#">Sách giáo khoa</a></li>
          <li><a class="dropdown-item" href="#">Sách kỹ năng sống</a></li>
        </ul>
      </div>

      <!-- Links khác -->
      <a href="/" class="text-decoration-none text-dark">Home</a>
      <a href="/san-pham" class="text-decoration-none text-dark">Sản phẩm</a>

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
