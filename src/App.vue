<script setup>
import Navbar from './components/Home/House/Hearder/Navbar.vue'
import TopBar from './components/Home/House/Hearder/TopBar.vue'
import Footer from './components/Home/House/Footer/Footer.vue'

import { ref } from 'vue'

// keyword tìm kiếm
const searchKeyword = ref('')

// lắng nghe sự kiện search từ Navbar
const handleSearch = (keyword) => {
  searchKeyword.value = keyword
}
</script>

<template>
  <!-- Header chung -->
  <Navbar @search="handleSearch" />
  <TopBar />

  <!-- Router view sẽ hiện trang theo URL -->
  <router-view :searchKeyword="searchKeyword" />

  <!-- Footer chung -->
  <Footer></Footer>
</template>
