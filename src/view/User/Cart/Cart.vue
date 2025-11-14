<template>
  <div class="container mt-4 cart-container">
    <h3 class="mb-4">Giỏ hàng</h3>

    <div v-if="cartStore.items.length === 0" class="text-center text-muted fs-5 py-5">
      Giỏ hàng đang trống
    </div>

    <div v-else class="table-responsive">
      <table class="table table-bordered text-center align-middle">
        <thead class="table-light">
          <tr>
            <th class="text-start">Sản phẩm</th>
            <th>Giá</th>
            <th style="width: 120px">Số lượng</th>
            <th>Thành tiền</th>
            <th style="width: 80px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartStore.items" :key="item.id" class="cart-row">
            <td class="text-start d-flex align-items-center gap-3">
              <img :src="item.img" alt="item.title" class="cart-img" loading="lazy" />
              <span class="cart-title">{{ item.title }}</span>
            </td>
            <td>{{ item.price.toLocaleString() }}₫</td>
            <td>
              <input
                type="number"
                min="1"
                v-model.number="item.quantity"
                class="form-control quantity-input"
                @input="validateQuantity(item)"
                aria-label="Số lượng sản phẩm"
              />
            </td>
            <td class="fw-semibold text-danger">
              {{ (item.price * item.quantity).toLocaleString() }}₫
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                @click="confirmRemove(item.id)"
                aria-label="Xóa sản phẩm khỏi giỏ hàng"
                title="Xóa"
              >
                <i class="bi bi-trash"></i>
                <span>Xóa</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="d-flex justify-content-end align-items-center mt-4 gap-4 flex-column flex-md-row"
    >
      <div class="total-price fs-5 fw-bold text-danger">
        Tổng: {{ cartStore.totalPrice.toLocaleString() }}₫
      </div>
      <button
        class="btn btn-success btn-lg px-4"
        @click="goToCheckout"
        :disabled="cartStore.items.length === 0"
      >
        Thanh toán
      </button>
    </div>
  </div>
  <br />
  <br />
</template>

<script setup>
import { useCartStore } from "../../../stores/CartStore";
import { useRouter } from "vue-router";
import { ref } from "vue";

const cartStore = useCartStore();
const router = useRouter();

function validateQuantity(item) {
  if (item.quantity < 1 || isNaN(item.quantity)) {
    item.quantity = 1;
  }
}

function goToCheckout() {
  router.push("/checkout");
}

function confirmRemove(id) {
  if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
    cartStore.removeItem(id);
  }
}
</script>

<style scoped>
.cart-container {
  min-height: 70vh;
}

/* Ảnh sản phẩm nhỏ bên trái */
.cart-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
}

/* Tiêu đề sản phẩm */
.cart-title {
  font-weight: 600;
  font-size: 1rem;
  color: #2c3e50;
}

/* Hàng khi hover có màu nền nhẹ */
.cart-row:hover {
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

/* Input số lượng */
.quantity-input {
  max-width: 80px;
  margin: 0 auto;
  border-radius: 6px;
  border: 1.5px solid #ced4da;
  text-align: center;
  transition: border-color 0.3s ease;
}

.quantity-input:focus {
  border-color: #28a745;
  outline: none;
  box-shadow: 0 0 8px rgb(40 167 69 / 0.5);
}

/* Button xóa với icon */
.delete-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.delete-btn:hover {
  background-color: #dc3545;
  color: white;
}

/* Tổng tiền và button thanh toán */
.total-price {
  user-select: none;
}

.btn-success {
  border-radius: 40px;
  font-weight: 600;
  box-shadow: 0 6px 15px rgb(40 167 69 / 0.4);
  transition: all 0.3s ease;
}

.btn-success:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-success:hover:not(:disabled) {
  box-shadow: 0 8px 20px rgb(40 167 69 / 0.7);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 575.98px) {
  .cart-title {
    font-size: 0.9rem;
  }
  .quantity-input {
    max-width: 60px;
  }
  .btn-success {
    width: 100%;
  }
  .d-flex.justify-content-end.flex-column.flex-md-row {
    flex-direction: column !important;
    align-items: stretch !important;
  }
}
</style>
