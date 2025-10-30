<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Gọi trang NewBook -->
      <div class="col-md-3">
        <NewBook :books="paginatedBooks" :searchKeyword="searchKeyword" />
      </div>
      <div class="col-md-9">
        <!-- Gọi trang TopBook -->
        <TopBook :books="paginatedBooks" :searchKeyword="searchKeyword" class="mb-4" />
        <!-- Gọi trang DetectiveNovels -->
        <DetectiveNovels
          :books="paginatedBooks"
          :searchKeyword="searchKeyword"
          class="mb-4"
        />
        <!-- Phân trang -->
        <nav class="mt-3" v-if="totalPages > 1">
          <ul class="pagination">
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
              <a class="page-link" href="#" @click.prevent="currentPage = page">{{
                page
              }}</a>
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
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import NewBook from "@/view/User/MainContent/Newbook/Newbook.vue";
import TopBook from "@/view/User/MainContent/TopBook/Topbook.vue";
import DetectiveNovels from "@/view/User/MainContent/Detectivenovels/Detectivenovels.vue";

// Nhận props searchKeyword từ component cha
const props = defineProps({
  searchKeyword: String,
});
// Dữ liệu sách
const books = ref([]);
const currentPage = ref(1);
// Khi mở trang sản phẩm thì mặc định hiển thị trang 1
const perPage = 4;
// Được chia làm 4 trang
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