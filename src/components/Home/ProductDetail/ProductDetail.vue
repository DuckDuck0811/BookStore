<template>
  <!-- Trang sách chi tiết khi chọn sách -->
  <div class="product-detail">
    <!-- Dùng đề gửi sự kiện từ lên phần back -->
    <button class="btn btn-secondary back-btn" @click="$emit('back')">Quay lại</button>
    <br />
    <br />
    <div class="detail-body">
      <div class="detail-image">
        <img :src="book.img" alt="Book" />
      </div>
      <!-- Chi tiết sách sẽ gồm tên giá cũ giá mới số lượng mô tả -->
      <div class="detail-info">
        <h2 class="title">{{ book.title }}</h2>
        <div class="price">
          <span class="new">{{ book.newPrice }}</span>
          <span class="old">{{ book.oldPrice }}</span>
        </div>
        <p class="ship">Miễn phí vận chuyển</p>
        <div class="quantity">
          <label>Số lượng:</label>
          <input type="number" v-model="qty" min="1" />
        </div>
        <div class="actions">
          <button class="btn-cart" @click.stop="addToCart(book)">Thêm vô giỏ hàng</button>
          <!-- Thêm vô giỏ hàng bằng cách dùng @click khi gọi sách và chuyển sang giỏ hàng-->
          <button class="btn-buy" @click.stop="buyNow(book)">Mua Ngay</button>
          <!-- Mua sách bằng cách dùng @click khi gọi sách và sẽ chuyển sang trang mua ngay-->
        </div>
        <div class="description">
          <h3>Mô tả</h3>
          <p>
            {{ book.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/components/Cart/CartStore";

// Sử dụng router để chuyển hướng
const router = useRouter();
// Sử dụng store giỏ hàng
const cartStore = useCartStore();

// Nhận props từ component cha
const props = defineProps({
  book: Object,
});

// Số lượng mua
const qty = ref(1);

// Thêm vào giỏ hàng
function addToCart(book) {
  const priceNumber = Number(String(book.newPrice).replace(/[^\d]/g, "")) || 0;

  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: priceNumber,
    img: book.img,
    quantity: 1,
  });
  router.push("/cart");
}

// Mua ngay
function buyNow(book) {
  const priceNumber = Number(String(book.newPrice).replace(/[^\d]/g, "")) || 0;

  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: priceNumber,
    img: book.img,
    quantity: qty.value,
  });
  router.push("/checkout");
}
</script>

<style scoped>
.product-detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 50px;
  background: #fff;
  border-radius: 8px;
}

.detail-body {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.detail-image {
  width: 350px;
  height: 450px;
  flex-shrink: 0;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
}

.detail-image img.large {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
}

.price .new {
  color: red;
  font-size: 26px;
  font-weight: bold;
  margin-right: 15px;
}

.price .old {
  text-decoration: line-through;
  color: gray;
  font-size: 18px;
}

.ship {
  margin: 10px 0;
  color: #28a745;
  font-weight: 500;
}

.quantity {
  margin: 15px 0;
}

.quantity input {
  width: 60px;
  padding: 5px;
  margin-left: 10px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-cart {
  background: #f57224;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cart:hover {
  background: #d95e1d;
}

.btn-buy {
  background: #d0011b;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-buy:hover {
  background: #ad0016;
}

.description {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.description h3 {
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
}

.description p {
  font-size: 16px;
  line-height: 1.5;
}
</style>
