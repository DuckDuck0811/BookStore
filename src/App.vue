<script setup>
import Navbar from './components/Home/House/Hearder/Navbar.vue';
import TopBar from './components/Home/House/Hearder/TopBar.vue';
import House from './components/Home/House/House.vue';
import Footer from './components/Home/House/Footer/Footer.vue';
import { ref } from "vue";

const searchKeyword = ref("");

const handleSearch = (keyword) => {
  searchKeyword.value = keyword;
};
</script>

<template>
  <Navbar @search="handleSearch" />
  <TopBar />
  <House :searchKeyword="searchKeyword" />
  <Footer></Footer>
</template>
