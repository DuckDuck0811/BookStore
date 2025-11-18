<template>
  <div class="container">
    <!-- Title -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="fw-bold">TẤT CẢ SẢN PHẨM</h5>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-muted py-5 fs-5">Đang tải dữ liệu...</div>

    <!-- Không có dữ liệu -->
    <div v-else-if="filteredBooks.length === 0" class="text-center text-muted fs-5">
      Không tìm thấy sách nào phù hợp.
    </div>

    <!-- Danh sách sách -->
    <div class="row g-3" v-else>
      <div class="col-6 col-md-3" v-for="book in paginatedBooks" :key="book.id">
        <div class="card product-card h-100" @click="goToDetail(book.id)">
          <div class="img-wrapper">
            <img :src="resolveImage(book.img)" :alt="book.title" class="book-img" />
          </div>
          <div class="card-body text-center">
            <p class="card-text book-title bold">{{ book.title }}</p>
            <div class="price">
              <del v-if="book.oldPrice" class="old-price">{{ book.oldPrice }}</del>
              <span class="new-price">{{ book.newPrice }}</span>
              <span v-if="book.discount" class="discount">{{ book.discount }}</span>
            </div>
            <button
              class="btn btn-danger btn-add-cart mt-2"
              @click.stop="addToCart(book)"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-center mt-4" v-if="totalPages > 1">
      <nav>
        <ul class="pagination flex-wrap">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage">«</button>
          </li>

          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage">»</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useCartStore } from "@/stores/CartStore";
import { useAuthStore } from "@/stores/Authstore";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const authStore = useAuthStore();
const router = useRouter();
const cartStore = useCartStore();

const props = defineProps({
  searchKeyword: String,
  category: String,
});

const loading = ref(true);
const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 8;

async function fetchProducts() {
  loading.value = true;
  try {
    const response = await axios.get("http://localhost:3000/products");
    products.value = response.data;
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);
    toast.error("Lỗi tải dữ liệu sản phẩm!");
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProducts();
});

// Khi searchKeyword hoặc category thay đổi, reset trang về 1
watch([() => props.searchKeyword, () => props.category], () => {
  currentPage.value = 1;
});

const filteredBooks = computed(() => {
  return products.value.filter((book) => {
    const matchKeyword =
      !props.searchKeyword ||
      book.title.toLowerCase().includes(props.searchKeyword.toLowerCase());
    const matchCategory = !props.category || book.category === props.category;
    return matchKeyword && matchCategory;
  });
});

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage));

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredBooks.value.slice(start, start + itemsPerPage);
});

function goToPage(page) {
  currentPage.value = page;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function resolveImage(img) {
  if (!img) return "/placeholder.jpg";
  if (img.startsWith("data:") || img.startsWith("http")) return img;
  return "/" + img.replace(/^\//, "");
}

function goToDetail(bookId) {
  router.push({ name: "ProductDetail", params: { id: bookId } });
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
</script>

<style scoped>
.title {
  font-size: 1.5rem;
  letter-spacing: 1px;
  color: #198754;
  text-transform: uppercase;
}
.product-card {
  border-radius: 10px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 0.1);
  cursor: pointer;
  transition: 0.3s;
  height: 100%;
  width: 300px;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgb(0 0 0 / 0.15);
}

.img-wrapper {
  width: 280px;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  object-position: center;
  margin-left: 10px;
}

.book-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-card:hover .book-img {
  transform: scale(1.05);
}

.book-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-height: 38px;
}
.price {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  margin-top: -20px;
}
.old-price {
  color: #888;
  text-decoration: line-through;
  font-size: 0.8rem;
}
.new-price {
  color: #d32f2f;
  font-weight: 700;
  font-size: 1rem;
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
  border-radius: 20px;
  padding: 6px 0;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 3px 6px rgb(211 47 47 / 0.4);
  transition: 0.2s;
  width: 150px;
}
.btn-add-cart:hover {
  background: #b71c1c;
  transform: scale(1.05);
}

.pagination .page-item.active .page-link {
  background-color: #0213ff;
  border-color: #0213ff;
  color: #fff;
}
.pagination .page-link {
  color: #0213ff;
  cursor: pointer;
}
.pagination .page-link:hover {
  background-color: #ffffff;
}

.row {
  margin-left: 0;
  margin-right: 0;
}
.container {
  overflow-x: hidden;
}

@media (max-width: 991px) {
  .book-img {
    height: 150px;
  }
}
@media (max-width: 576px) {
  .book-img {
    height: 120px;
  }
}
</style>
