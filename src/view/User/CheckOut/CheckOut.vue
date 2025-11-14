<template>
  <div class="container mt-4">
    <h3 class="mb-4">Thanh toán</h3>

    <form @submit.prevent="handleOrder" novalidate>
      <!-- Họ và tên -->
      <div class="mb-3">
        <label for="name" class="form-label">Họ và tên</label>
        <input
          v-model.trim="name"
          type="text"
          id="name"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          placeholder="Nhập họ tên"
          @blur="validateName"
          required
        />
        <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
      </div>

      <!-- Số điện thoại -->
      <div class="mb-3">
        <label for="phone" class="form-label">Số điện thoại</label>
        <input
          v-model.trim="phone"
          type="tel"
          id="phone"
          class="form-control"
          :class="{ 'is-invalid': errors.phone }"
          placeholder="Nhập số điện thoại"
          @blur="validatePhone"
          required
        />
        <div class="invalid-feedback" v-if="errors.phone">{{ errors.phone }}</div>
      </div>

      <!-- Địa chỉ giao hàng -->
      <div class="mb-3">
        <label for="address" class="form-label">Địa chỉ giao hàng</label>
        <textarea
          v-model.trim="address"
          id="address"
          class="form-control"
          :class="{ 'is-invalid': errors.address }"
          rows="3"
          placeholder="Nhập địa chỉ chi tiết"
          @blur="validateAddress"
          required
        ></textarea>
        <div class="invalid-feedback" v-if="errors.address">{{ errors.address }}</div>
      </div>

      <!-- Danh sách sản phẩm -->
      <div class="mb-3">
        <label class="form-label fw-bold">Sản phẩm</label>
        <ul class="list-group">
          <li
            v-for="item in cart.items"
            :key="item.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            {{ item.title }}
            <span class="badge bg-primary rounded-pill">{{ item.quantity }}</span>
          </li>
        </ul>
      </div>

      <!-- Tổng tiền -->
      <div class="text-end fw-bold fs-5 mb-3 text-danger">
        Tổng: {{ cart.totalPrice.toLocaleString() }}₫
      </div>

      <!-- Nút đặt hàng -->
      <div class="text-end">
        <button type="submit" class="btn btn-success" :disabled="hasErrors">
          Đặt hàng
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useCartStore } from "../../../stores/CartStore";

const cart = useCartStore();

const name = ref("");
const phone = ref("");
const address = ref("");

const errors = reactive({
  name: "",
  phone: "",
  address: "",
});

const validateName = () => {
  if (!name.value) {
    errors.name = "Vui lòng nhập họ và tên";
  } else if (name.value.length < 3 || name.value.length > 50) {
    errors.name = "Họ và tên phải từ 3 đến 50 ký tự";
  } else if (!/^[A-Za-zÀ-ỹà-ỹ\s]+$/.test(name.value)) {
    errors.name = "Họ và tên chỉ được chứa chữ và khoảng trắng";
  } else {
    errors.name = "";
  }
};

const validatePhone = () => {
  if (!phone.value) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (phone.value.length < 10 || phone.value.length > 11) {
    errors.phone = "Số điện thoại phải có 10 hoặc 11 số";
  } else if (!/^\d+$/.test(phone.value)) {
    errors.phone = "Số điện thoại chỉ được chứa chữ số";
  } else {
    errors.phone = "";
  }
};

const validateAddress = () => {
  if (!address.value) {
    errors.address = "Vui lòng nhập địa chỉ giao hàng";
  } else if (address.value.length < 10 || address.value.length > 100) {
    errors.address = "Địa chỉ phải từ 10 đến 100 ký tự";
  } else if (!/^[a-zA-ZÀ-ỹ0-9\s,\.]+$/.test(address.value)) {
    errors.address = "Địa chỉ chỉ được chứa chữ, số, dấu phẩy, chấm và khoảng trắng";
  } else {
    errors.address = "";
  }
};

const hasErrors = computed(
  () => errors.name !== "" || errors.phone !== "" || errors.address !== ""
);

const handleOrder = async () => {
  validateName();
  validatePhone();
  validateAddress();

  if (hasErrors.value) {
    return;
  }

  const customerInfo = {
    name: name.value,
    phone: phone.value,
    address: address.value,
  };

  try {
    const result = await cart.postOrder(customerInfo);
    console.log("Order created:", result);
    window.location.href = "/thank-you";
  } catch (error) {
    alert("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    console.error(error);
  }
};
</script>
