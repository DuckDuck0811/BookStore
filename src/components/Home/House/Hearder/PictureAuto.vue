<template>
  <div class="gallery d-flex justify-content-center mt-4">
    <div class="picture w-75" style="width: 1600px; height: 400px; overflow: hidden; position: relative;">
      <img
        v-for="(banner, i) in banners"
        :key="i"
        :src="banner"
        class="banner"
        :class="{ active: i === currentIndex }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const banners = ["/banner1.jpg", "/banner5.jpg", "/banner3.jpg"];
const currentIndex = ref(0);

onMounted(() => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % banners.length;
  }, 2000);
});
</script>

<style scoped>
.picture img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
}

.picture img.active {
  display: block;
}
</style>
