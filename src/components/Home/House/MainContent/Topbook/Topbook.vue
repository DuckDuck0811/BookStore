<template>
  <div>
    <h5 class="fw-bold mb-3 text-uppercase text-center text-md-start">
      Sách Khoa Học Viễn Tưởng
    </h5>

    <!-- Nếu không tìm thấy dữ liệu -->
    <div v-if="filteredBooks.length === 0" class="text-center text-muted">
      Không tìm thấy sách khoa học viễn tưởng nào phù hợp.
    </div>

    <!-- Danh sách sách -->
    <div class="row g-3" v-else>
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="book in filteredBooks"
        :key="book.id"
      >
        <div
          class="card position-relative product-card"
          :style="{ height: book.cardHeight }"
          @click="goToDetail(book)"
          style="cursor: pointer"
        >
          <div class="card product-card h-100 shadow-sm">
            <img
              :src="book.img"
              class="card-img-top"
              :alt="book.title"
              :style="{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderTopLeftRadius: '.5rem',
                borderTopRightRadius: '.5rem',
              }"
            />

            <div class="card-body text-center">
              <p class="card-text fw-semibold">{{ book.title }}</p>
              <div class="price">
                <del>{{ book.oldPrice }}</del>
                <span class="new-price">{{ book.newPrice }}</span>
                <span class="discount">{{ book.discount }}</span>
              </div>
            </div>

            <div class="overlay d-flex justify-content-center align-items-end">
              <button class="btn btn-danger mb-4 add-btn" @click.stop="addToCart(book)">
                Thêm vô giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/components/Cart/CartStore";
import { toast } from "vue3-toastify";
import { topbook } from "./Topbook.js";

const router = useRouter();
const cartStore = useCartStore();

const props = defineProps({
  searchKeyword: String,
});

const books = topbook;
const filteredBooks = computed(() => {
  if (!props.searchKeyword) return books;
  return books.filter((book) =>
    book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  );
});

function addToCart(book) {
  const priceNumber = Number(String(book.newPrice).replace(/[^\d]/g, "")) || 0;
  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: priceNumber,
    img: book.img,
    quantity: 1,
  });
  toast.success("Đã thêm sản phẩm vào giỏ hàng!", { autoClose: 2000 });
  setTimeout(() => {
    router.push("/cart");
  }, 2000);
}

function goToDetail(book) {
  router.push(`/topbook/${book.id}`);
}
</script>

<style scoped>
.price {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.price del {
  font-size: 14px;
  color: #555;
}

.price .new-price {
  color: #d32f2f;
  font-weight: bold;
  font-size: 16px;
}

.price .discount {
  background-color: #d32f2f;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

.product-card {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-card .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .overlay {
  opacity: 1;
}

.add-btn {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.product-card:hover .add-btn {
  opacity: 1;
  transform: translateY(0);
}
</style>
