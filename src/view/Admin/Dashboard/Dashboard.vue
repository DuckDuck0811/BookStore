<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <House :books="paginatedBooks" :searchKeyword="searchKeyword" />
      </div>

      <!-- Phân trang -->
      <div class="col-12">
        <nav class="mt-3" v-if="totalPages > 1">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="currentPage = currentPage - 1"
                >Trước</a
              >
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="currentPage = page">
                {{ page }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="currentPage = currentPage + 1"
                >Sau</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import House from "@/view/User/Home/House.vue";
const props = defineProps({
  searchKeyword: String,
});

const books = ref([]);
const currentPage = ref(1);
const perPage = 4;

// Gọi API lấy danh sách sách
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/books");
    books.value = res.data;
  } catch (err) {
    console.error("Lỗi tải dữ liệu sách:", err);
  }
});

// Reset trang khi searchKeyword thay đổi
watch(
  () => props.searchKeyword,
  () => {
    currentPage.value = 1;
  }
);

// Lọc theo searchKeyword
const filteredBooks = computed(() => {
  if (!props.searchKeyword) return books.value;
  return books.value.filter((b) =>
    b.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  );
});

// Phân trang
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredBooks.value.slice(start, start + perPage);
});

// Tổng số trang
const totalPages = computed(() => Math.ceil(filteredBooks.value.length / perPage));
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}
</style>
