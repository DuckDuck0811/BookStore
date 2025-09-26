<script setup>
import { ref } from 'vue';
import ProductDetail from './ProductDetail.vue';
import ProductList from '../ProductList/ProductList.vue';
import House from '../House/House.vue';

const selectedBook = ref(null);

function openDetail(book) {
    selectedBook.value = book;
}

function closeDetail() {
    selectedBook.value = null;
}
</script>

<template>
    <ProductList v-if="!selectedBook" @select-book="openDetail" />
    <ProductDetail v-else :book="selectedBook" @close="closeDetail" />
</template>
