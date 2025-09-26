<template>
    <div>
        <DetectiveNovels v-if="!selectedBook" @select-book="openDetail" />
        <ProductDetail v-else :book="selectedBook" @close="closeDetail" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DetectiveNovels from './DetectiveNovels.vue'
import ProductDetail from './ProductDetail.vue'

const selectedBook = ref(null)

function openDetail(book) {
    selectedBook.value = book
}
function closeDetail() {
    selectedBook.value = null
}
</script>
