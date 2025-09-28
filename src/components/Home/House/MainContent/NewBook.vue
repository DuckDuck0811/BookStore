<template>
  <div>
    <h5 class="fw-bold mb-3">TRUYỆN TRANH NỔI TIẾNG</h5>
    <div v-if="filteredComics.length === 0" class="text-center text-muted">
      Không tìm thấy truyện tranh nào phù hợp.
    </div>
    <div class="row g-3" v-else>
      <div class="col-12" v-for="(comic, index) in filteredComics" :key="comic.id || index">
        <div class="card text-center position-relative product-card" :style="{ height: comic.cardHeight }">
          <img :src="comic.img" class="card-img-top" :class="comic.className" />
          <div class="card-body">
            <p class="card-text fw-bold">{{ comic.title }}</p>
            <p>
              <span class="fw-bold text-danger me-2">{{ comic.price }}</span>
              <span class="badge bg-danger">{{ comic.discount }}</span>
            </p>
          </div>

          <div class="overlay d-flex justify-content-center align-items-end">
            <button class="btn btn-danger mb-4" style="height: 40px;width: 170px;" @click.stop="addToCart(comic)">
              Thêm vô giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/components/Cart/CartStore'

const props = defineProps({
  searchKeyword: String
})

const router = useRouter()
const cartStore = useCartStore()

const listComics = ref([
  { id: 11, title: 'One Piece', price: '25,000₫', discount: '-20%', img: 'onepiece.jpg', className: 'onepiece-img', cardHeight: '470px' },
  { id: 12, title: 'Naruto', price: '30,000₫', discount: '-15%', img: 'naruto.jpg', className: 'naruto-img', cardHeight: '450px' },
  { id: 13, title: 'Dragon Ball', price: '28,000₫', discount: '-10%', img: 'dragonball.png', className: 'dragonball-img', cardHeight: '450px' }
])

const filteredComics = computed(() => {
  if (!props.searchKeyword) return listComics.value
  return listComics.value.filter(comic =>
    comic.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  )
})

function addToCart(comic) {
  const priceNumber = Number(String(comic.price).replace(/[^\d]/g, '')) || 0

  cartStore.addToCart({
    id: comic.id,
    title: comic.title,
    price: priceNumber,
    img: comic.img,
    quantity: 1
  })

  router.push('/cart')
}
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

.product-card {
  position: relative;
  overflow: hidden;
}

.product-card .overlay {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .overlay {
  opacity: 1;
}

.card .overlay button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
