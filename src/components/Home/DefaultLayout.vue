<script setup>
import Navbar from "@/components/Home/House/Hearder/Navbar.vue";
import TopBar from "@/components/Home/House/Hearder/TopBar.vue";
import Footer from "@/components/Home/House/Footer/Footer.vue";
import { ref } from "vue";

// Lưu trữ từ khóa tìm kiếm và danh mục được chọn
const searchKeyword = ref("");
// Lưu trữ danh mục được chọn
const selectedCategory = ref("");

// Xử lý sự kiện tìm kiếm
const handleSearch = (keyword) => {
  searchKeyword.value = keyword;
};

// Xử lý sự kiện chọn danh mục
const handleCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? "" : category;
};
</script>

<template>
  <Navbar @search="handleSearch" />
  <TopBar @update-category="handleCategory" />
  <router-view :searchKeyword="searchKeyword" :category="selectedCategory" />
  <Footer></Footer>
</template>
