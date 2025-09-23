<script setup>
import Navbar from './components/Home/House/Hearder/Navbar.vue'
import TopBar from './components/Home/House/Hearder/TopBar.vue'
import Footer from './components/Home/House/Footer/Footer.vue'
import { ref } from 'vue'

const searchKeyword = ref('')
const selectedCategory = ref('')

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
}

const handleCategory = (category) => {
  selectedCategory.value = (selectedCategory.value === category) ? '' : category
}
</script>

<template>
  <Navbar @search="handleSearch" />
  <TopBar @update-category="handleCategory" />

  <router-view 
    :searchKeyword="searchKeyword" 
    :category="selectedCategory"
  />

  <Footer></Footer>
</template>
