<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="fw-bold title">SÁCH KHOA HỌC VIỄN TƯỞNG</h5>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-muted py-5 fs-5">Đang tải dữ liệu...</div>

    <!-- No Data -->
    <div v-else-if="filteredBooks.length === 0" class="text-center text-muted fs-5">
      Không tìm thấy sách khoa học viễn tưởng nào phù hợp.
    </div>

    <!-- Book List -->
    <div class="row g-4" v-else>
      <div
        class="col-sm-6 col-md-4 col-lg-3"
        v-for="book in filteredBooks"
        :key="book.id"
      >
        <div
          class="card product-card h-100"
          @click="goToDetail(book)"
          role="button"
          tabindex="0"
          @keydown.enter="goToDetail(book)"
        >
          <div class="img-wrapper">
            <img
              :src="book.img"
              :alt="book.title"
              class="card-img-top book-img"
              loading="lazy"
            />
          </div>

          <div class="card-body d-flex flex-column justify-content-between text-center">
            <p class="card-text book-title mb-2" :title="book.title">{{ book.title }}</p>
            <div class="price">
              <del v-if="book.oldPrice" class="old-price">{{ book.oldPrice }}</del>
              <span class="new-price">{{ book.newPrice }}</span>
              <span v-if="book.discount" class="discount">{{ book.discount }}</span>
            </div>
            <button
              class="btn btn-danger btn-add-cart mt-3"
              @click.stop="addToCart(book)"
              aria-label="Thêm vô giỏ hàng"
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/CartStore";
import { useAuthStore } from "@/stores/Authstore";
import { toast } from "vue3-toastify";
import axios from "axios";

const props = defineProps({
  searchKeyword: String,
});

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const books = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/topbook");
    books.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    toast.error("Không thể tải danh sách sách!");
  } finally {
    loading.value = false;
  }
});

const filteredBooks = computed(() => {
  if (!props.searchKeyword) return books.value;
  return books.value.filter((book) =>
    book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  );
});

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

function goToDetail(book) {
  router.push(`/topbook/${book.id}`);
}
</script>

<style scoped>
.section-title {
  font-size: 1.5rem;
  letter-spacing: 1px;
  color: #198754;
  text-transform: uppercase;
}

.product-card {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgb(0 0 0 / 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
.product-card:focus,
.product-card:hover {
  outline: none;
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgb(0 0 0 / 0.18);
}

.img-wrapper {
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  max-height: 280px;
}
.book-img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.product-card:hover .book-img {
  transform: scale(1.05);
}

.card-body {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.book-title {
  font-weight: 700;
  font-size: 1rem;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.price {
  margin-top: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 8px;
  font-size: 1rem;
}

.old-price {
  color: #888;
  font-size: 0.875rem;
  text-decoration: line-through;
}

.new-price {
  color: #d32f2f;
  font-weight: 700;
}

.discount {
  background-color: #d32f2f;
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 0.65rem;
  color: #fff;
}

.btn-add-cart {
  background: #d32f2f;
  border: none;
  border-radius: 30px;
  padding: 8px 0;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 10px rgb(211 47 47 / 0.4);
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
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
  .book-img {
    height: 250px;
  }
}
@media (max-width: 576px) {
  .book-img {
    height: 200px;
  }
  .btn-add-cart {
    font-size: 0.9rem;
    padding: 7px 0;
  }
}
</style>
