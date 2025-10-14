<template>
  <div class="container mt-4">
    <h3>Giỏ hàng</h3>
    <!-- Nếu giỏ hàng trống sẽ hiện thông báo giỏ hàng đang trống -->
    <div v-if="cartStore.items.length === 0" class="text-muted">Giỏ hàng đang trống</div>
    <!-- Dữ liệu được lấy từ trong localStorage sẽ được lưu trong bảng -->
    <table v-else class="table table-bordered text-center">
      <thead class="table-light">
        <tr>
          <th>Sản phẩm</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Thành tiền</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartStore.items" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.price.toLocaleString() }}₫</td>
          <td>
            <input
              type="number"
              min="1"
              v-model.number="item.quantity"
              class="form-control text-center"
              style="width: 80px; margin: auto"
              @input="validateQuantity(item)"
            />
          </td>
          <td>{{ (item.price * item.quantity).toLocaleString() }}₫</td>
          <!-- Tính tổng tiền của sản phẩm -->
          <td>
            <button class="btn btn-sm btn-danger" @click="cartStore.removeItem(item.id)">
              Xóa
            </button>
            <!-- Xóa sản phẩm theo id sản phẩm -->
          </td>
        </tr>
      </tbody>
    </table>

    <div class="text-end fw-bold fs-5 mt-3" style="color: red">
      Tổng: {{ cartStore.totalPrice.toLocaleString() }}₫
    </div>
    <div class="text-end mt-3">
      <button
        class="btn btn-success"
        @click="goToCheckout"
        :disabled="cartStore.items.length === 0"
      >
        Thanh toán
      </button>
    </div>
    <br />
  </div>
</template>

<script setup>
import { useCartStore } from "./CartStore";
import { useRouter } from "vue-router";
// lấy store giỏ hàng
const cartStore = useCartStore();
const router = useRouter();
// dùng router khi chuyển trang

function validateQuantity(item) {
  if (item.quantity < 1) {
    item.quantity = 1;
  }
}
// khi thêm sản phẩm thì giỏ hàng sẽ min dữ liệu là 1
function goToCheckout() {
  router.push("/checkout");
}
// bấm Thanh toán trang web sẽ chuyển sang trang checkout
</script>
