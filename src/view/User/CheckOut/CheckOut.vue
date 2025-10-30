<template>
  <div class="container mt-4">
    <h3 class="mb-4">Thanh toán</h3>
    <!-- Form thanh toán -->
    <form @submit.prevent="handleOrder">
      <div class="mb-3">
        <label class="form-label">Họ và tên</label>
        <input
          v-model="name"
          type="text"
          class="form-control"
          placeholder="Nhập họ tên"
        />
      </div>
      <!-- Thanh toán -->
      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input
          v-model="phone"
          type="tel"
          class="form-control"
          placeholder="Nhập số điện thoại"
        />
      </div>

      <!-- Địa chỉ giao hàng -->
      <div class="mb-3">
        <label class="form-label">Địa chỉ giao hàng</label>
        <textarea
          v-model="address"
          class="form-control"
          rows="2"
          placeholder="Nhập địa chỉ chi tiết"
        ></textarea>
      </div>

      <!-- Danh sách sản phẩm cart.item và sẽ hiện tên sản phẩm và số lượng sản phẩm đặt hàng -->
      <div class="mb-3">
        <label class="form-label fw-bold">Sản phẩm</label>
        <ul class="list-group">
          <li v-for="item in cart.items" :key="item.id" class="list-group-item">
            {{ item.title }} × {{ item.quantity }}
          </li>
        </ul>
      </div>

      <!-- Tổng số tiền của sản phẩm đặt hàng và có định dạng tiền VND -->
      <div class="text-end fw-bold fs-5 mb-3 text-danger">
        Tổng: {{ cart.totalPrice.toLocaleString() }}₫
      </div>

      <!-- Nút đặt hàng -->
      <div class="text-end">
        <button type="submit" class="btn btn-success">Đặt hàng</button>
      </div>
    </form>
    <br />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCartStore } from "../../../stores/CartStore";

const cart = useCartStore();
// lấy dữ liệu sản phẩm trong giỏ hàng

const name = ref("");
const address = ref("");
const phone = ref("");
// name, address, phone: lưu thông tin nhập của khách hàng.

const handleOrder = async () => {
  if (!name.value || !address.value || !phone.value) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }
  // validate phần form nhập liệu

  if (phone.value.length < 10 || phone.value.length > 11 || !/^\d+$/.test(phone.value)) {
    alert("Số điện thoại không hợp lệ");
    return;
  }
  // validate số điện thoại

  // Validate họ và tên
  if (
    name.value.length < 3 ||
    name.value.length > 50 ||
    !/^[A-Za-zÀ-ỹà-ỹ\s]+$/.test(name.value)
  ) {
    alert(
      "Họ và tên phải từ 3-50 ký tự và chỉ được nhập chữ" || "Họ và tên không hợp lệ"
    );
    return;
  }

  const add = address.value.trim();
  if (add.length < 10 || add.length > 100 || !/^[a-zA-ZÀ-ỹ0-9\s,]+$/.test(add)) {
    alert(
      "Địa chỉ phải từ 10-100 ký tự và chỉ được phép dùng chữ, số, khoảng trắng và dấu ,"
    );
    return;
  }

  const customerInfo = {
    name: name.value,
    address: address.value,
    phone: phone.value,
  };
  //tạo đối tượng customerInfo để lưu thông tin khách hàng

  const result = await cart.postOrder(customerInfo);
  console.log("Order created:", result);

  window.location.href = "/thank-you";
  //Sau khi thành công sẽ chuyển hướng đến trang cảm ơn
};
</script>
