<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold">TIỂU THUYẾT TRINH THÁM</h5>
    </div>

    <!-- Nếu không tìm thấy dữ liệu -->
    <div v-if="filteredBooks.length === 0" class="text-center text-muted">
      Không tìm thấy tiểu thuyết trinh thám nào phù hợp.
    </div>

    <!-- Danh sách sách -->
    <div class="row g-3" v-else>
      <div class="col-md-3" v-for="book in filteredBooks" :key="book.id">
        <div
          class="card position-relative product-card"
          :style="{ height: book.cardHeight }"
          @click="goToDetail(book)"
          style="cursor: pointer"
        >
          <img
            :src="book.img"
            class="card-img-top"
            :style="{
              width: '100%',
              height: book.height,
              aspectRatio: book.aspect,
              objectFit: 'cover',
              borderTopLeftRadius: '.5rem',
              borderTopRightRadius: '.5rem',
            }"
          />

          <div class="card-body text-center">
            <p class="card-text fw-bold">{{ book.title }}</p>
            <div class="price">
              <del>{{ book.oldPrice }}</del>
              <span class="new-price">{{ book.newPrice }}</span>
            </div>
          </div>

          <!-- Nút thêm giỏ hàng -->
          <div class="overlay d-flex justify-content-center align-items-end">
            <button
              class="btn btn-danger mb-4"
              style="height: 40px; width: 170px"
              @click.stop="addToCart(book)"
            >
              Thêm vô giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/components/Cart/CartStore";
import { toast } from "vue3-toastify";

import { detectiveNovels } from "./DetectiveDetail.js";

const props = defineProps({
  searchKeyword: String,
});

const cartStore = useCartStore();
const router = useRouter();

const books = detectiveNovels;

const filteredBooks = computed(() => {
  if (!props.searchKeyword) return books;
  return books.filter((book) =>
    book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  );
});

function addToCart(book) {
  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: Number(book.newPrice.replace(/[^\d]/g, "")),
    img: book.img,
  });
  toast.success("Đã thêm sản phẩm vào giỏ hàng!", { autoClose: 2000 });
}

function goToDetail(book) {
  router.push(`/san-pham/${book.id}`);
}
</script>


<style scoped>
.price {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 5px;
}

.price del {
  color: #555;
  font-size: 14px;
}

.price .new-price {
  color: #d32f2f;
  font-weight: bold;
  font-size: 16px;
}

.product-card {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-card .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .overlay {
  opacity: 1;
}

.card .overlay button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.product-card:hover .overlay button {
  opacity: 1;
  transform: translate(-50%, -10px);
}
</style>
