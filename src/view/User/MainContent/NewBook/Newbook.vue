<template>
  <div class="container py-3">
    <!-- Tiêu đề -->
    <div class="d-flex justify-content-between align-items-center mb-4 title-container">
      <h5 class="fw-bold">TRUYỆN TRANH NỔI TIẾNG</h5>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-muted py-5">
      Đang tải dữ liệu truyện tranh...
    </div>

    <!-- Không tìm thấy -->
    <div v-else-if="filteredComics.length === 0" class="text-center text-muted">
      Không tìm thấy truyện tranh nào phù hợp.
    </div>

    <!-- Danh sách truyện tranh -->
    <div class="comic-list" v-else>
      <div
        class="comic-card"
        v-for="comic in filteredComics"
        :key="comic.id"
        @click="goToDetail(comic)"
        tabindex="0"
        role="button"
        @keydown.enter="goToDetail(comic)"
      >
        <div class="card product-card">
          <img :src="comic.img" class="card-img-top" :alt="comic.title" loading="lazy" />

          <div class="card-body d-flex flex-column justify-content-between text-center">
            <p class="card-title fw-bold mb-1" :title="comic.title">
              {{ comic.title }}
            </p>

            <div class="price">
              <span class="new-price">{{
                formatPrice(Number(comic.newPrice.replace(/[^\d]/g, "")))
              }}</span>
              <span class="discount-badge" v-if="comic.discount">{{
                comic.discount
              }}</span>
            </div>

            <button
              class="btn btn-danger btn-add-cart mt-3"
              @click.stop="addToCart(comic)"
              aria-label="Thêm vào giỏ hàng"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/CartStore";
import { toast } from "vue3-toastify";
import axios from "axios";

const props = defineProps({ searchKeyword: String });

const comics = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/newBooks");
    comics.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    toast.error("Không thể tải danh sách truyện tranh!");
  } finally {
    loading.value = false;
  }
});

const filteredComics = computed(() => {
  if (!props.searchKeyword || props.searchKeyword.trim() === "") return comics.value;
  return comics.value.filter((comic) =>
    comic.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  );
});

const router = useRouter();
const cartStore = useCartStore();

function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );
}

function addToCart(comic) {
  cartStore.addToCart({
    id: comic.id,
    title: comic.title,
    price: Number(comic.newPrice.replace(/[^\d]/g, "")),
    img: comic.img,
  });
}

function goToDetail(comic) {
  router.push(`/newbook/${comic.id}`);
}
</script>

<style scoped>
.title-container {
  margin-bottom: 1rem;
  margin-top: -0.95rem;
}

.title-text {
  font-size: 1.6rem;
  letter-spacing: 2px;
  color: #198754;
  transition: color 0.3s ease;
  cursor: default;
}

.title-text:hover {
  color: #0b5e33;
}

/* Xếp dọc, căn giữa, max width 600px */
.comic-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
}

/* Card truyện tranh */
.card {
  width: 100%;
  min-height: 480px; /* chiều cao cố định để đều nhau */
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.17);
}

/* Hình ảnh */
.card-img-top {
  width: 100%;
  height: 360px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover .card-img-top {
  transform: scale(1.05);
}

/* Nội dung card */
.card-body {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  text-align: center;
}

.card-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #333;

  /* Giới hạn 2 dòng, tràn dấu "..." */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.price {
  margin-top: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
}

.new-price {
  color: #d32f2f;
  font-weight: 700;
}

.discount-badge {
  background-color: #d32f2f;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 6px;
}

/* Nút thêm giỏ hàng */
.btn-add-cart {
  background: #d32f2f;
  border: none;
  border-radius: 30px;
  padding: 8px 0;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 10px rgb(211 47 47 / 0.4);
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.btn-add-cart:hover {
  background: #b71c1c;
  box-shadow: 0 6px 14px rgb(183 28 28 / 0.6);
  transform: scale(1.05);
}

.btn-add-cart:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.5);
}

/* Responsive */
@media (max-width: 991px) {
  .card-img-top {
    height: 280px;
  }
}
@media (max-width: 576px) {
  .card-img-top {
    height: 200px;
  }
  .btn-add-cart {
    font-size: 0.9rem;
    padding: 7px 0;
  }
}
</style>
