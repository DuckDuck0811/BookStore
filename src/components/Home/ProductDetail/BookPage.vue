<script setup>
import { ref } from 'vue';
import ProductDetail from './ProductDetail.vue';
import ProductList from '../ProductList/ProductList.vue';
function openDetail() {
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