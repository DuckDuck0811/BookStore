<template>
  <div class="container mt-4">
    <h3 class="mb-3">Danh sách đơn hàng</h3>
    <!-- Danh sách đơn hàng được lưu vào localStorage -->
    <!-- Danh sách Order -->
    <table class="table table-bordered table-hover align-middle">
      <thead class="table-primary text-center">
        <tr>
          <th>ID</th>
          <th>Khách hàng</th>
          <th>Số điện thoại</th>
          <th>Địa chỉ</th>
          <th>Ngày đặt</th>
          <th>Tên sách</th>
          <th>Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.orderId" class="text-center">
          <td>{{ order.orderId }}</td>
          <td>{{ order.customer.name }}</td>
          <td>{{ order.customer.phone }}</td>
          <td>{{ order.customer.address }}</td>
          <td>{{ order.date }}</td>
          <td class="text-start">
            <!-- Tính tổng tiền cần thanh toán băng cách lấy giá tiền * số lượng -->
            <ul class="mb-0">
              <li v-for="item in order.items" :key="item.name">
                {{ item.title }} (x{{ item.quantity }})
              </li>
            </ul>
          </td>
          <td>{{ order.total.toLocaleString() }}₫</td>
          <!-- Định dạng số tiền  -->
        </tr>

        <tr v-if="orders.length === 0">
          <td colspan="6" class="text-center text-muted py-3">Chưa có đơn hàng nào.</td>
        </tr>
        <!-- Sẽ có thông báo là Chưa có đơn hàng nào nếu bảng dữ liệu không có đơn đặt hàng nào -->
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const orders = ref([]); //Được dùng để khai báo 1 biến để order

onMounted(() => {
  orders.value = JSON.parse(localStorage.getItem("orders")) || []; //Đơn đặt hàng được lấy dữ liệu từ localStore
});
</script>

<style scoped></style>
