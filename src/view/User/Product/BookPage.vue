<template>
  <ProductList v-if="!selectedBook" @select-book="openDetail" />
  <ProductDetail v-else :book="selectedBook" @close="closeDetail" />
</template>

<script setup>
import { ref } from "vue";
import ProductDetail from "../User/Product/ProductDetail.vue";
import ProductList from "../ProductList/ProductList.vue";
import House from "../House/House.vue";

const selectedBook = ref(null);
// Mở chi tiết sách
function openDetail(book) {
  selectedBook.value = book;
}
// Mở chi tiết sách xong thì đóng lại
function closeDetail() {
  selectedBook.value = null;
}
</script>
