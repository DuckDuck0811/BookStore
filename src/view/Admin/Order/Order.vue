<template>
  <div class="container py-4">
    <div class="card shadow border-0">
      <!-- HEADER -->
      <div
        class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
      >
        <h4 class="mb-0">Danh sách đơn hàng</h4>
        <span class="badge bg-light text-primary">
          {{ filteredOrders.length }} đơn
        </span>
      </div>

      <div class="card-body">
        <!-- FILTER -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Tìm tên, SĐT, mã đơn..."
            />
          </div>

          <div class="col-md-3">
            <select v-model="statusFilter" class="form-select">
              <option value="">Tất cả trạng thái</option>
              <option v-for="s in statusOptions" :key="s">
                {{ s }}
              </option>
            </select>
          </div>

          <div class="col-md-3">
            <select v-model="sortOrder" class="form-select">
              <option value="desc">Mới nhất → Cũ nhất</option>
              <option value="asc">Cũ nhất → Mới nhất</option>
            </select>
          </div>
        </div>

        <!-- TABLE -->
        <div class="table-responsive">
          <table class="table table-hover align-middle text-center">
            <thead class="table-light">
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th width="220">Hành động</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td class="fw-bold text-primary">{{ order.id }}</td>
                <td>{{ order.customer.name }}</td>
                <td>{{ order.customer.phone }}</td>
                <td class="text-start">{{ order.customer.address }}</td>
                <td>{{ order.date }}</td>
                <td>
                  <span :class="statusClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>

                <td>
                  <div v-if="editingOrderId === order.id" class="d-flex">
                    <select
                      v-model="selectedStatus"
                      class="form-select form-select-sm me-2"
                    >
                      <option v-for="s in statusOptions" :key="s">
                        {{ s }}
                      </option>
                    </select>
                    <button
                      class="btn btn-success btn-sm me-1"
                      @click="saveStatus(order)"
                    >
                      Lưu
                    </button>
                    <button
                      class="btn btn-secondary btn-sm"
                      @click="cancelEditing"
                    >
                      Hủy
                    </button>
                  </div>

                  <div v-else>
                    <button
                      class="btn btn-outline-primary btn-sm me-1"
                      @click="startEditingStatus(order)"
                    >
                      Cập nhật
                    </button>
                    <button
                      class="btn btn-outline-info btn-sm"
                      @click="openDetail(order)"
                    >
                      Chi tiết
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredOrders.length === 0">
                <td colspan="7" class="text-muted py-4">
                  Không có đơn hàng
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL DETAIL -->
    <div
      v-if="showDetailModal"
      class="modal fade show d-block"
      style="background: rgba(0,0,0,.5)"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Chi tiết đơn hàng {{ detailOrder.id }}
            </h5>
            <button class="btn-close" @click="closeDetail"></button>
          </div>

          <div class="modal-body">
            <p><b>Khách hàng:</b> {{ detailOrder.customer.name }}</p>
            <p><b>SĐT:</b> {{ detailOrder.customer.phone }}</p>
            <p><b>Địa chỉ:</b> {{ detailOrder.customer.address }}</p>
            <p><b>Ngày đặt:</b> {{ detailOrder.date }}</p>
            <p><b>Trạng thái:</b> {{ detailOrder.status }}</p>

            <hr />

            <h6>Sản phẩm</h6>
            <ul class="list-group mb-3">
              <li
                v-for="item in detailOrder.items"
                :key="item.productId"
                class="list-group-item d-flex justify-content-between"
              >
                <span>{{ item.title }} x {{ item.quantity }}</span>
                <span class="fw-bold">
                  {{ item.price.toLocaleString() }}₫
                </span>
              </li>
            </ul>

            <h5 class="text-end text-danger">
              Tổng tiền: {{ detailOrder.total.toLocaleString() }}₫
            </h5>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDetail">
              Đóng
            </button>
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

onMounted(async () => {
  const res = await fetch("http://localhost:3000/orders");
  orders.value = await res.json();
});

const filteredOrders = computed(() => {
  let list = [...orders.value];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (o) =>
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.id.toLowerCase().includes(q)
    );
  }

  if (statusFilter.value) {
    list = list.filter((o) => o.status === statusFilter.value);
  }

  list.sort((a, b) => {
    return sortOrder.value === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  return list;
});

function statusClass(status) {
  return {
    badge: true,
    "bg-warning text-dark": status === "Đang xử lý",
    "bg-info text-dark": status === "Đang giao hàng",
    "bg-success": status === "Đã giao thành công",
  };
}

function startEditingStatus(order) {
  editingOrderId.value = order.id;
  selectedStatus.value = order.status;
}

function cancelEditing() {
  editingOrderId.value = null;
}

async function saveStatus(order) {
  await fetch(`http://localhost:3000/orders/${order.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: selectedStatus.value }),
  });

  order.status = selectedStatus.value;
  cancelEditing();
}

function openDetail(order) {
  detailOrder.value = order;
  showDetailModal.value = true;
}

function closeDetail() {
  showDetailModal.value = false;
}
</script>
