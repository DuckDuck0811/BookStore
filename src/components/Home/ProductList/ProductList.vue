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
            <div
              class="card shadow-sm product-card"
              :style="{ height: book.cardHeight || '500px' }"
              @click="viewBookDetail(book)"
            >
              <!-- Ảnh -->
              <img
                :src="resolveImage(book.img)"
                :style="{
                  width: book.width || '100%',
                  height: book.height || '300px',
                  objectFit: book.objectFit || 'contain',
                  padding: '10px',
                  background: '#fff',
                  display: 'block',
                  margin: 'auto',
                }"
                alt="book"
              />

              <!-- Nội dung -->
              <div class="card-body text-center">
                <p class="card-text fw-semibold">{{ book.title }}</p>
                <div class="price">
                  <del class="text-muted me-2">{{ book.oldPrice }}</del>
                  <span class="new-price text-danger fw-bold">
                    {{ book.newPrice }}
                  </span>
                  <span class="discount badge bg-danger ms-2">
                    {{ book.discount }}
                  </span>
                </div>
              </div>

              <!-- Overlay -->
              <div class="overlay d-flex justify-content-center align-items-end">
                <button
                  class="btn btn-danger mb-4"
                  style="height: 40px; width: 170px"
                  @click.stop="addToCart(book)"
                >
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
import { useProductStore } from "./ProductStore";
import ProductDetail from "../ProductDetail/ProductDetail.vue";
import { useCartStore } from "@/components/Cart/CartStore";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";

const router = useRouter();
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

  toast.success("Đã thêm sản phẩm vào giỏ hàng!", { autoClose: 2000 });

  setTimeout(() => {
    router.push("/cart");
  }, 2000);
}
</script>

<style scoped>
.new-price {
  font-size: 1.1rem;
}
.discount {
  font-size: 0.9rem;
}
.product-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}
.product-card:hover {
  transform: scale(1.03);
}
.product-card .overlay {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: rgba(0, 0, 0, 0.1);
}
.product-card:hover .overlay {
  opacity: 1;
}
</style>
