<template>
  <div class="container mt-4">
    <h3 class="mb-3">Danh sách đơn hàng</h3>

    <table class="table table-bordered table-hover align-middle">
      <thead class="table-primary text-center">
        <tr>
          <th>ID</th>
          <th>Khách hàng</th>
          <th>Số điện thoại</th>
          <th>Địa chỉ</th>
          <th>Ngày đặt</th>
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
          <td>{{ order.total.toLocaleString() }}₫</td>
        </tr>

        <tr v-if="orders.length === 0">
          <td colspan="6" class="text-center text-muted py-3">
            Chưa có đơn hàng nào.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const orders = ref([]);

onMounted(() => {
  orders.value = JSON.parse(localStorage.getItem("orders")) || [];
});
</script>


<script setup>

</script>

<style scoped>

</style>
