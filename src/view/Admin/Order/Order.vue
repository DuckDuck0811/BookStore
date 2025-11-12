<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>Danh sách đơn hàng</h3>
    </div>

    <!-- Bộ lọc -->
    <div class="row mb-3 g-2">
      <div class="col-md-4">
        <input
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Tìm theo tên khách hàng..."
        />
      </div>

      <div class="col-md-3">
        <select v-model="statusFilter" class="form-select">
          <option value="">Tất cả trạng thái</option>
          <option>Đang xử lý</option>
          <option>Đang giao hàng</option>
          <option>Đã giao thành công</option>
        </select>
      </div>

      <div class="col-md-3">
        <select v-model="sortOrder" class="form-select">
          <option value="desc">Mới nhất → Cũ nhất</option>
          <option value="asc">Cũ nhất → Mới nhất</option>
        </select>
      </div>
    </div>

    <!-- Bảng -->
    <table class="table table-bordered table-hover align-middle">
      <thead class="table-primary text-center">
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Phone Num</th>
          <th>Address</th>
          <th>Order Date</th>
          <th>Status</th>
          <th>Hành động</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="order in filteredAndSortedOrders" :key="order.id" class="text-center">
          <td>{{ order.id }}</td>
          <td>{{ order.customer.name }}</td>
          <td>{{ order.customer.phone }}</td>
          <td>{{ order.customer.address }}</td>
          <td>{{ order.date }}</td>
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
          <td>
            <div
              v-if="editingOrderId === order.id"
              class="d-flex align-items-center justify-content-center mb-1"
            >
              <select
                v-model="selectedStatus"
                class="form-select form-select-sm me-2"
                style="width: auto"
              >
                <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
              </select>
              <button class="btn btn-sm btn-success me-1" @click="saveStatus(order)">
                Lưu
              </button>
              <button class="btn btn-sm btn-secondary me-2" @click="cancelEditing">
                Hủy
              </button>
            </div>
            <div>
              <button
                class="btn btn-sm btn-primary me-2"
                @click="startEditingStatus(order)"
              >
                Cập nhật trạng thái
              </button>
              <button class="btn btn-sm btn-info" @click="openDetail(order)">
                Xem chi tiết
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="filteredAndSortedOrders.length === 0">
          <td colspan="9" class="text-center text-muted py-3">
            Không tìm thấy đơn hàng.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal chi tiết đơn hàng -->
    <div
      v-if="showDetailModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết đơn hàng {{ detailOrder?.id }}</h5>
            <button type="button" class="btn-close" @click="closeDetail"></button>
          </div>
          <div class="modal-body">
            <p><strong>Khách hàng:</strong> {{ detailOrder?.customer.name }}</p>
            <p><strong>Số điện thoại:</strong> {{ detailOrder?.customer.phone }}</p>
            <p><strong>Địa chỉ:</strong> {{ detailOrder?.customer.address }}</p>
            <p><strong>Ngày đặt:</strong> {{ detailOrder?.date }}</p>
            <p><strong>Trạng thái:</strong> {{ detailOrder?.status }}</p>

            <h6>Sản phẩm:</h6>
            <ul>
              <li v-for="item in detailOrder?.items" :key="item.productId">
                {{ item.title }} - Giá: {{ item.price.toLocaleString() }}₫ x
                {{ item.quantity }}
              </li>
            </ul>

            <p><strong>Tổng tiền:</strong> {{ detailOrder?.total.toLocaleString() }}₫</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDetail">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const orders = ref([]);
const searchQuery = ref("");
const statusFilter = ref("");
const sortOrder = ref("desc");

const editingOrderId = ref(null);
const selectedStatus = ref("");
const statusOptions = ["Đang xử lý", "Đang giao hàng", "Đã giao thành công"];

const showDetailModal = ref(false);
const detailOrder = ref(null);

function normalizeApiData(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.orders)) return data.orders;
  return [];
}

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/orders");
    if (!res.ok) throw new Error("Không thể tải dữ liệu từ API");
    const data = await res.json();
    orders.value = normalizeApiData(data);
  } catch (err) {
    console.error("Lỗi tải đơn hàng:", err);
  }
});

function generateNextOrderId(list) {
  if (!Array.isArray(list)) return "DH001";
  let maxNum = 0;
  for (const o of list) {
    if (!o || o.id == null) continue;
    const idStr = String(o.id);
    const matches = idStr.match(/\d+/g);
    if (!matches) continue;
    const lastGroup = matches[matches.length - 1];
    const n = parseInt(lastGroup, 10);
    if (!isNaN(n) && n > maxNum) maxNum = n;
  }
  const next = maxNum > 0 ? maxNum + 1 : list.length ? list.length + 1 : 1;
  const padded = String(next).padStart(3, "0");
  return `DH${padded}`;
}

async function addOrder(newOrderData) {
  if (
    !newOrderData ||
    !newOrderData.customer ||
    !Array.isArray(newOrderData.items) ||
    !newOrderData.total
  ) {
    throw new Error("Dữ liệu order không hợp lệ. Cần customer, items[], total.");
  }

  const newId = generateNextOrderId(orders.value);
  const order = {
    id: newId,
    ...newOrderData,
    date: newOrderData.date || new Date().toISOString().slice(0, 10),
  };

  try {
    const res = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error("Lưu thất bại: " + res.status);
    const saved = await res.json();
    orders.value.push(saved || order);
    return saved || order;
  } catch (err) {
    console.error("Lỗi lưu đơn hàng:", err);
    throw err;
  }
}

function startEditingStatus(order) {
  editingOrderId.value = order.id;
  selectedStatus.value = order.status;
}

function cancelEditing() {
  editingOrderId.value = null;
  selectedStatus.value = "";
}

async function saveStatus(order) {
  if (selectedStatus.value === order.status) {
    cancelEditing();
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selectedStatus.value }),
    });

    if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

    const idx = orders.value.findIndex((o) => o.id === order.id);
    if (idx !== -1) orders.value[idx].status = selectedStatus.value;

    cancelEditing();
    alert("Cập nhật trạng thái thành công!");
  } catch (err) {
    alert("Lỗi khi cập nhật trạng thái: " + err.message);
  }
}

// Mở modal chi tiết
function openDetail(order) {
  detailOrder.value = order;
  showDetailModal.value = true;
}

// Đóng modal chi tiết
function closeDetail() {
  showDetailModal.value = false;
  detailOrder.value = null;
}

const filteredAndSortedOrders = computed(() => {
  let result = Array.isArray(orders.value) ? [...orders.value] : [];
  const query = searchQuery.value.trim().toLowerCase();

  if (query) {
    result = result.filter((o) => {
      const name = o?.customer?.name || "";
      const phone = o?.customer?.phone || "";
      const id = o?.id || "";
      return (
        String(name).toLowerCase().includes(query) ||
        String(phone).toLowerCase().includes(query) ||
        String(id).toLowerCase().includes(query)
      );
    });
  }

  if (statusFilter.value) {
    result = result.filter((o) => o?.status === statusFilter.value);
  }

  result.sort((a, b) => {
    const dateA = new Date(a?.date);
    const dateB = new Date(b?.date);
    const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
    return sortOrder.value === "asc" ? timeA - timeB : timeB - timeA;
  });

  return result;
});
</script>
