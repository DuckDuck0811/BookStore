<template>
  <div class="container py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold">TRUYỆN TRANH NỔI TIẾNG</h5>
    </div>

    <!-- Nếu không có dữ liệu -->
    <div v-if="filteredComics.length === 0" class="text-center text-muted">
      Không tìm thấy truyện tranh nào phù hợp.
    </div>

    <!-- Danh sách truyện tranh -->
    <div class="comic-list" v-else>
      <div
        class="comic-card"
        v-for="comic in filteredComics"
        :key="comic.id"
        @click="goToDetail(comic)"
      >
        <div class="card product-card">
          <img
            :src="comic.img"
            class="card-img-top"
            :style="{
              width: '100%',
              height: comic.height,
              aspectRatio: comic.aspect,
              objectFit: 'cover',
              borderTopLeftRadius: '.5rem',
              borderTopRightRadius: '.5rem',
            }"
          />
          <div class="card-body text-center">
            <p class="card-title fw-bold mb-1">{{ comic.title }}</p>

            <div class="price">
              <span class="new-price">{{ comic.newPrice }}</span>
              <span class="discount-badge">{{ comic.discount }}</span>
            </div>
          </div>

          <div class="overlay d-flex justify-content-center align-items-end">
            <button class="btn btn-danger mb-4" @click.stop="addToCart(comic)">
              Thêm vào giỏ hàng
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
import { newBooks } from "./Newbook.js";

const props = defineProps({
  searchKeyword: String,
});

const router = useRouter();
const cartStore = useCartStore();

const comics = newBooks;

const filteredComics = computed(() => {
  if (!props.searchKeyword) return comics;
  return comics.filter((comic) =>
    comic.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  );
});

function addToCart(comic) {
  cartStore.addToCart({
    id: comic.id,
    title: comic.title,
    price: Number(comic.newPrice.replace(/[^\d]/g, "")),
    img: comic.img,
  });
  toast.success("Đã thêm sản phẩm vào giỏ hàng!", { autoClose: 2000 });
}

function goToDetail(comic) {
  router.push(`/newbook/${comic.id}`);
}
</script>

<style scoped>
.comic-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.comic-card {
  width: 300px;
}
.card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  background-color: #fff;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Hình ảnh */
.card-img-top {
  padding-left: 30px;
  width: 90%!important;
  height: 350px !important;
  object-fit: cover;
}
.card-body {
  padding: 12px;
}

.price {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.new-price {
  color: #d32f2f;
  font-weight: 600;
  font-size: 15px;
}

.discount-badge {
  background-color: #d32f2f;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 6px;
}

.product-card {
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .overlay {
  opacity: 1;
}

.overlay button {
  height: 40px;
  width: 180px;
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.3s ease;
}

.product-card:hover .overlay button {
  opacity: 1;
  transform: translateY(-5px);
}
</style>
