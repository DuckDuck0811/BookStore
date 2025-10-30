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
          <th>Customer</th>
          <th>Phone Num</th>
          <th>Address</th>
          <th>Order Date</th>
          <th>Book Title</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="order in filteredOrders" :key="order.orderId" class="text-center">
          <td>{{ order.id }}</td>
          <td>{{ order.customer.name }}</td>
          <td>{{ order.customer.phone }}</td>
          <td>{{ order.customer.address }}</td>
          <td>{{ order.date }}</td>
          <td class="text-start">
            <ul class="mb-0">
              <li v-for="item in order.items" :key="item.title">
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

// Lấy dữ liệu từ API (db.json)
onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/orders");
    if (!res.ok) throw new Error("Không thể tải dữ liệu từ API");
    const data = await res.json();

    const now = new Date();
    data.forEach((order) => {
      const orderDate = new Date(order.date);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
      if (diffDays >= 2 && order.status !== "Đã giao thành công") {
        order.status = "Đã giao thành công";
      } else if (diffDays >= 1 && order.status === "Đang xử lý") {
        order.status = "Đang giao hàng";
      }
    });

    orders.value = data;
  } catch (err) {
    console.error("Lỗi tải đơn hàng:", err);
  }
});

// Lọc theo tên khách hàng
const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return orders.value;
  return orders.value.filter((order) =>
    order.customer.name.toLowerCase().includes(query)
  );
});
</script>
