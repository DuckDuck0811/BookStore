<template>
  <div>
    <h5 class="fw-bold mb-3">TRUYỆN TRANH NỔI TIẾNG</h5>
    <div v-if="filteredComics.length === 0" class="text-center text-muted">
      Không tìm thấy truyện tranh nào phù hợp.
    </div>
    <div class="row g-3" v-else>
      <div class="col-12" v-for="(comic, index) in filteredComics" :key="index">
        <div class="card h-100 text-center">
          <img :src="comic.img" class="card-img-top" :class="comic.className" />
          <div class="card-body">
            <p class="card-text fw-bold">{{ comic.title }}</p>
            <p>
              <span class="fw-bold text-danger me-2">{{ comic.price }}</span>
              <span class="badge bg-danger">{{ comic.discount }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  searchKeyword: String
})

const listComics = ref([
  { title: 'One Piece', price: '25,000₫', discount: '-20%', img: 'onepiece.jpg', className: 'onepiece-img' },
  { title: 'Naruto', price: '30,000₫', discount: '-15%', img: 'naruto.jpg', className: 'naruto-img' },
  { title: 'Dragon Ball', price: '28,000₫', discount: '-10%', img: 'dragonball.png', className: 'dragonball-img' }
])

const filteredComics = computed(() => {
  if (!props.searchKeyword) return listComics.value
  return listComics.value.filter(comic =>
    comic.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  )
})
</script>

<style scoped>
.onepiece-img {
  width: 100%;
  height: 300px;
  object-fit: contain;
  margin: auto;
  margin-top: 10px;
}

.naruto-img {
  width: 170px;
  height: 260px;
  object-fit: cover;
  border-radius: 10px;
  margin: auto;
  margin-top: 10px;
}

.dragonball-img {
  width: 170px;
  height: 280px;
  object-fit: scale-down;
  margin: auto;
  margin-top: 10px;
}
</style>