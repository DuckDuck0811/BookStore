<template>
  <div class="container py-3">
    <!-- Tiêu đề -->
    <div class="d-flex justify-content-between align-items-center mb-4 title-container">
      <h5 class="fw-bold title">TRUYỆN TRANH NỔI TIẾNG</h5>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-muted py-5 fs-5">
      Đang tải dữ liệu truyện tranh...
    </div>

    <!-- Không tìm thấy -->
    <div v-else-if="filteredComics.length === 0" class="text-center text-muted fs-5">
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
        <div class="card product-card" :style="{ height: comic.cardHeight || '350px' }">
          <img
            :src="comic.img"
            class="card-img-top"
            :alt="comic.title"
            loading="lazy"
            :style="{ height: comic.height || '190px' }"
          />

          <div class="card-body text-center">
            <p class="card-title fw-bold mb-1" :title="comic.title">{{ comic.title }}</p>

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
import { useAuthStore } from "@/stores/Authstore";
const authStore = useAuthStore();
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
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function checkLogin() {
  return authStore.isLoggedIn || !!authStore.user;
}

function addToCart(book) {
  if (!checkLogin()) {
    toast.info("Vui lòng đăng nhập để thêm sản phẩm!", { autoClose: 2000 });
    router.push({ name: "Login", query: { redirect: "/cart" } });
    return;
  }
  const priceNumber = Number(String(book.newPrice).replace(/[^\d]/g, "")) || 0;
  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: priceNumber,
    img: book.img,
    quantity: 1,
  });
}

function goToDetail(comic) {
  router.push(`/newbook/${comic.id}`);
}
</script>

<style scoped>
.title-container {
  margin-bottom: 1rem;
  margin-top: -1rem;
}

.title-text {
  font-size: 1.2rem;
  letter-spacing: 1px;
  color: #198754;
}

.comic-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  margin: 0 auto;
  max-width: 100%;
}

/* Card */
.card {
  width: 300px;
  border-radius: 12px;
  height: 200px;
  overflow: hidden;
  border: 1px solid #ddd;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;
  background-color: #fff;
  height: 350px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}

.card-img-top {
  width: 100%;
  max-width: 200px;
  height: auto; /* cho ảnh theo tỉ lệ gốc */
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.3s ease;
  margin: 0 auto; /* căn giữa ảnh trong card */
  display: block;
}

.card:hover .card-img-top {
  transform: scale(1.05);
}

/* Nội dung */
.card-body {
  padding: 0.7rem 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
  margin-bottom: 0.4rem;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.price {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.new-price {
  color: #d32f2f;
  font-weight: 700;
}

.discount-badge {
  background-color: #d32f2f;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 6px;
}

/* Nút thêm giỏ hàng */
.btn-add-cart {
  background: #d32f2f;
  border: none;
  border-radius: 25px;
  padding: 5px 0;
  font-weight: 600;
  font-size: 0.85rem;
  width: 75%;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.3);
  transition: all 0.3s ease;
}
.btn-add-cart:hover {
  background: #b71c1c;
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(183, 28, 28, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    width: 100%; /* trên mobile rộng full */
  }
  .card-img-top {
    height: 160px !important;
  }
  .card-title {
    font-size: 0.9rem;
  }
  .btn-add-cart {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .comic-list {
    max-width: 90%;
  }
  .card-img-top {
    height: 140px !important;
  }
  .btn-add-cart {
    font-size: 0.75rem;
    padding: 4px 0;
  }
}
</style>
