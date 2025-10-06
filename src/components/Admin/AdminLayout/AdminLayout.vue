<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <aside class="sidebar bg-light p-3" style="width: 200px; height: 100vh">
      <h5 class="mb-4">Admin</h5>
      <ul class="nav flex-column">
      <li class="nav-item">
          <router-link to="/home" class="nav-link" active-class="active">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/product" class="nav-link" active-class="active">Product</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/order" class="nav-link" active-class="active">Order</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/chart" class="nav-link" active-class="active">Biểu đồ</router-link>
        </li>
      </ul>
    </aside>

    <div class="flex-grow-1 p-3">
      <router-view />
    </div>
  </div>
</template>
