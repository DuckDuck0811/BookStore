<template>
  <div>
    <div v-if="!selectedBook">
      <div class="container">
        <br /><br />
        <h5 class="fw-bold mb-3">TẤT CẢ CÁC SẢN PHẨM</h5>

        <!-- Không tìm thấy sách -->
        <div v-if="paginatedBooks.length === 0" class="text-center text-muted">
          Không tìm thấy sách nào phù hợp.
        </div>

        <!-- Danh sách sách -->
        <div class="row g-3" v-else>
          <div class="col-md-3" v-for="book in paginatedBooks" :key="book.id">
            <div class="card shadow-sm product-card" @click="viewBookDetail(book)">
              <!-- Ảnh -->
              <img :src="resolveImage(book.img)" alt="book" />

              <!-- Nội dung -->
              <div class="card-body text-center">
                <p class="card-text">{{ book.title }}</p>
                <div class="price">
                  <del v-if="book.oldPrice" class="text-muted me-2">{{
                    book.oldPrice
                  }}</del>
                  <span class="new-price">{{ book.newPrice }}</span>
                  <span v-if="book.discount" class="discount">{{ book.discount }}</span>
                </div>
              </div>

              <!-- Overlay -->
              <div class="overlay d-flex justify-content-center align-items-center">
                <button class="btn btn-danger" @click.stop="addToCart(book)">
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Phân trang -->
        <nav class="mt-4" v-if="totalPages > 1">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="prevPage" :disabled="currentPage === 1">
                Trước
              </button>
            </li>

            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="goToPage(page)">
                {{ page }}
              </button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button
                class="page-link"
                @click="nextPage"
                :disabled="currentPage === totalPages"
              >
                Sau
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Chi tiết sản phẩm -->
    <ProductDetail v-else :book="selectedBook" @back="selectedBook = null" />
    <br /><br />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useProductStore } from "../../../stores/ProductStore";
import ProductDetail from "./ProductDetail.vue";
import { useCartStore } from "@/stores/CartStore";

const cartStore = useCartStore();
const productStore = useProductStore();

const props = defineProps({
  searchKeyword: String,
  category: String,
});

onMounted(() => {
  productStore.fetchProducts();
});

const selectedBook = ref(null);

const filteredBooks = computed(() =>
  productStore.products.filter((book) => {
    const matchKeyword =
      !props.searchKeyword ||
      book.title.toLowerCase().includes(props.searchKeyword.toLowerCase());
    const matchCategory = !props.category || book.category === props.category;
    return matchKeyword && matchCategory;
  })
);

// Phân trang
const currentPage = ref(1);
const itemsPerPage = ref(8);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredBooks.value.length / itemsPerPage.value))
);

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredBooks.value.slice(start, start + itemsPerPage.value);
});

watch([filteredBooks, () => props.category], () => {
  currentPage.value = 1;
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function resolveImage(img) {
  if (!img) return "/placeholder.jpg";
  if (img.startsWith("data:")) return img; // base64
  if (img.startsWith("http")) return img; // ảnh online
  return "/" + img.replace(/^\//, ""); // ảnh cục bộ
}

function viewBookDetail(book) {
  selectedBook.value = book;
}

function addToCart(book) {
  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: Number(book.newPrice.replace(/[^\d]/g, "")),
    img: resolveImage(book.img),
  });
}
</script>

<style scoped>
.product-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.15);
}

.product-card img {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  object-fit: contain;
  max-height: 280px;
  width: 100%;
  background: #fff;
  padding: 10px;
  display: block;
  margin: 0 auto;
}

.card-body {
  flex-grow: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-text {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  min-height: 48px; /* để tên sách cao bằng nhau */
}

.price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.price del {
  color: #999;
  font-size: 0.9rem;
}

.new-price {
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.1rem;
}

.discount {
  font-size: 0.8rem;
  background-color: #e74c3c;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: #fff;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.product-card:hover .overlay {
  opacity: 1;
}

.overlay button {
  height: 36px;
  width: 150px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 20px;
  border: none;
}
</style>
