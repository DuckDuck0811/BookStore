  <template>
    <div class="container mt-4">
      <h3 class="mb-4">Thanh toán</h3>

      <form @submit.prevent="handleOrder">
        <div class="mb-3">
          <label class="form-label">Họ và tên</label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            placeholder="Nhập họ tên"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Số điện thoại</label>
          <input
            v-model="phone"
            type="tel"
            class="form-control"
            placeholder="Nhập số điện thoại"
            pattern="^[0-9]{9,11}$"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Địa chỉ giao hàng</label>
          <textarea
            v-model="address"
            class="form-control"
            rows="2"
            placeholder="Nhập địa chỉ chi tiết"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Sản phẩm</label>
          <ul class="list-group">
            <li v-for="item in cart.items" :key="item.id" class="list-group-item">
              {{ item.title }} × {{ item.quantity }}
            </li>
          </ul>
        </div>

        <div class="text-end fw-bold fs-5 mb-3 text-danger">
          Tổng: {{ cart.totalPrice.toLocaleString() }}₫
        </div>

        <div class="text-end">
          <button type="submit" class="btn btn-success">Đặt hàng</button>
        </div>
      </form>
      <br />
    </div>
  </template>

  <script setup>
  import { ref } from "vue";
  import { useCartStore } from "../Cart/CartStore";

  const cart = useCartStore();

  const name = ref("");
  const address = ref("");
  const phone = ref("");

  const handleOrder = async () => {
    if (!name.value || !address.value || !phone.value) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const customerInfo = {
      name: name.value,
      address: address.value,
      phone: phone.value,
    };

    const result = await cart.postOrder(customerInfo);
    console.log("Order created:", result);

    window.location.href = "/thank-you";
  };
  </script>
