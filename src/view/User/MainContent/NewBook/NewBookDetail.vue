<template>
  <div v-if="bookData" class="product-detail-wrapper">
    <!-- 2 quyển bên trái -->
    <div class="side-column left">
      <div
        v-for="(book, index) in leftBooks"
        :key="'left-' + book.id"
        class="side-book"
        @click="goToBook(book.id)"
      >
        <div class="side-inner">
          <img :src="book.img" alt="book" />
          <p class="side-title">{{ book.title }}</p>
        </div>
      </div>
    </div>

    <!-- Quyển chính -->
    <div class="product-detail">
      <button class="btn back-btn" @click="$router.back()">Quay lại</button>

      <div class="detail-body">
        <!-- Ảnh sách -->
        <div class="detail-image">
          <img :src="bookData.img" alt="book" />
        </div>

        <!-- Thông tin -->
        <div class="detail-info">
          <h2 class="title">{{ bookData.title }}</h2>

          <div class="price">
            <span class="new">{{ bookData.newPrice }}</span>
            <span class="old" v-if="bookData.oldPrice">{{ bookData.oldPrice }}</span>
          </div>

          <p class="ship">Miễn phí vận chuyển</p>

          <div class="quantity">
            <label>Số lượng:</label>
            <input type="number" v-model.number="qty" min="1" />
          </div>

          <div class="actions">
            <button class="btn btn-cart" @click.stop="addToCart(bookData)">
              Thêm vào giỏ hàng
            </button>
            <button class="btn btn-buy" @click.stop="buyNow(bookData)">Mua ngay</button>
          </div>

          <div class="description">
            <h3>Mô tả</h3>
            <p>{{ bookData.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 2 quyển bên phải -->
    <div class="side-column right">
      <div
        v-for="(book, index) in rightBooks"
        :key="'right-' + book.id"
        class="side-book"
        @click="goToBook(book.id)"
      >
        <div class="side-inner">
          <img :src="book.img" alt="book" />
          <p class="side-title">{{ book.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCartStore } from "@/stores/CartStore";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();

const bookData = ref(null);
const allBooks = ref([]);
const leftBooks = ref([]);
const rightBooks = ref([]);
const qty = ref(1);

async function loadAllBooks() {
  try {
    const res = await axios.get("http://localhost:3000/newBooks");
    allBooks.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách sách:", error);
  }
}

async function loadBookDetail(id) {
  try {
    const res = await axios.get(`http://localhost:3000/newBooks/${id}`);
    bookData.value = res.data;
  } catch (error) {
    alert("Không thể tải chi tiết sách!");
    console.error(error);
  }
}

function pickRandomBooks() {
  if (!allBooks.value.length || !bookData.value) return;

  // So sánh id kiểu string để chắc chắn
  const others = allBooks.value.filter((b) => String(b.id) !== String(bookData.value.id));
  const shuffled = others.sort(() => 0.5 - Math.random());

  leftBooks.value = shuffled.slice(0, 2);
  rightBooks.value = shuffled.length > 2 ? shuffled.slice(2, 4) : [];
}

function addToCart(book) {
  const priceNumber = parseInt(book.newPrice.replace(/[^\d]/g, ""), 10) || 0;
  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: priceNumber,
    img: book.img,
    quantity: qty.value,
  });
}

function buyNow(book) {
  addToCart(book);
  router.push("/checkout");
}

function goToBook(id) {
  router.push(`/book/${id}`);
}

onMounted(async () => {
  await loadAllBooks();
  await loadBookDetail(route.params.id);
  pickRandomBooks();
});

watch(
  () => route.params.id,
  async (newId) => {
    qty.value = 1;
    await loadBookDetail(newId);
    pickRandomBooks();
  }
);
</script>

<style scoped>
.product-detail-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 25px;
  margin: 40px auto;
  flex-wrap: wrap;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Hai cột chứa sách phụ */
.side-column {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 40px;
}

/* Sách phụ */
.side-book {
  width: 180px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.side-inner {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgb(0 0 0 / 0.07);
  padding: 12px;
  transition: all 0.3s ease;
}
.side-book img {
  width: 100%;
  height: 240px;
  border-radius: 10px;
  object-fit: cover;
  transition: transform 0.35s ease;
}
.side-book:hover img {
  transform: scale(1.05);
}
.side-title {
  margin-top: 10px;
  font-weight: 600;
  font-size: 15px;
  color: #222;
  text-align: center;
}
.side-book:hover .side-title {
  color: #d0011b;
}
.side-book:hover .side-inner {
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
  transform: translateY(-3px);
}

/* Phần chi tiết chính */
.product-detail {
  max-width: 900px;
  flex: 1;
  min-width: 320px;
  padding: 25px 35px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgb(0 0 0 / 0.07);
  color: #222;
}

.back-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  color: #555;
  cursor: pointer;
  margin-bottom: 25px;
  font-weight: 600;
  transition: color 0.25s ease;
}
.back-btn:hover {
  color: #d0011b;
}

.detail-body {
  display: flex;
  gap: 28px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.detail-image {
  width: 280px;
  height: 430px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 15px rgb(0 0 0 / 0.1);
  flex-shrink: 0;
  cursor: zoom-in;
}
.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease;
}
.detail-image:hover img {
  transform: scale(1.04);
}

.detail-info {
  flex: 1;
  min-width: 280px;
}
.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
}
.price {
  margin-bottom: 18px;
  font-weight: 700;
}
.price .new {
  color: #d0011b;
  font-size: 30px;
  margin-right: 16px;
}
.price .old {
  color: #999;
  font-size: 18px;
  text-decoration: line-through;
}
.ship {
  margin-bottom: 22px;
  font-weight: 600;
  color: #28a745;
}
.quantity {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
}
.quantity input {
  width: 65px;
  margin-left: 15px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 2px solid #ccc;
}
.quantity input:focus {
  border-color: #d0011b;
  box-shadow: 0 0 7px #d0011baa;
}
.actions {
  display: flex;
  gap: 14px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.btn {
  border-radius: 10px;
  padding: 13px 28px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: 0.25s ease;
}
.btn-cart {
  background-color: #f57224;
  color: white;
  box-shadow: 0 6px 18px rgb(245 114 36 / 0.45);
}
.btn-cart:hover {
  background-color: #d95e1d;
}
.btn-buy {
  background-color: #d0011b;
  color: white;
  box-shadow: 0 6px 18px rgb(208 1 27 / 0.5);
}
.btn-buy:hover {
  background-color: #ad0016;
}
.description {
  border-top: 1.5px solid #eee;
  padding-top: 24px;
}
.description h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #333;
}
.description p {
  font-size: 16px;
  color: #444;
}

/* Responsive */
@media (max-width: 1200px) {
  .side-column {
    display: none;
  }
}
@media (max-width: 768px) {
  .detail-body {
    flex-direction: column;
    align-items: center;
  }
  .detail-image {
    width: 90%;
    height: auto;
  }
}
</style>
