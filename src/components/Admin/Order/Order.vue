<template>
  <div class="container mt-4">
    <h3 class="mb-3">Danh sách đơn hàng</h3>

    <input
      type="text"
      v-model="searchQuery"
      class="form-control mb-3"
      placeholder="Tìm theo tên khách hàng..."
    />

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
          <th>Trạng thái</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="order in filteredOrders" :key="order.orderId" class="text-center">
          <td>{{ order.orderId }}</td>
          <td>{{ order.customer.name }}</td>
          <td>{{ order.customer.phone }}</td>
          <td>{{ order.customer.address }}</td>
          <td>{{ order.date }}</td>
          <td class="text-start">
            <ul class="mb-0">
              <li v-for="item in order.items" :key="item.name">
                {{ item.title }} (x{{ item.quantity }})
              </li>
            </ul>
          </td>
          <td>{{ order.total.toLocaleString() }}₫</td>
          <td>
            <span
              :class="{
                'badge bg-warning text-dark': order.status === 'Đang xử lý',
                'badge bg-info text-dark': order.status === 'Đang giao hàng',
                'badge bg-success': order.status === 'Đã giao thành công',
              }"
            >
              {{ order.status }}
            </span>
          </td>
        </tr>

        <tr v-if="filteredOrders.length === 0">
          <td colspan="8" class="text-center text-muted py-3">
            Không tìm thấy đơn hàng.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const orders = ref([]);
const searchQuery = ref("");

onMounted(() => {
  let storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const now = new Date();

  storedOrders = storedOrders.map((order) => {
    const orderDate = new Date(order.date);
    const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24); // 1 ngày = 1000ms * 60s * 60m * 24h
    if (diffDays >= 2 && order.status !== "Đã giao thành công") {
      order.status = "Đã giao thành công";
    } else if (diffDays >= 1 && order.status === "Đang xử lý") {
      order.status = "Đang giao hàng";
    }

    return order;
  });

  localStorage.setItem("orders", JSON.stringify(storedOrders));
  orders.value = storedOrders;
});

// Lọc theo tên khách hàng, full khi ô trống
const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return orders.value;
  return orders.value.filter((order) =>
    order.customer.name.toLowerCase().includes(query)
  );
});
</script>
