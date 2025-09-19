<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold">TIỂU THUYẾT TRINH THÁM</h5>
    </div>
    <div v-if="filteredBooks.length === 0" class="text-center text-muted">
      Không tìm thấy tiểu thuyết trinh thám nào phù hợp.
    </div>
    <div class="row g-3" v-else>
      <div class="col-md-3" v-for="book in filteredBooks" :key="book.id">
        <div class="card h-100">
          <img
            :src="book.img"
            class="card-img-top"
            :style="{
              width: '100%',
              aspectRatio: book.aspect,
              objectFit: 'cover',
              borderTopLeftRadius: '.5rem',
              borderTopRightRadius: '.5rem'
            }"
          />
          <div class="card-body text-center">
            <p class="card-text">{{ book.title }}</p>
            <div class="price">
              <del>{{ book.oldPrice }}</del>
              <span class="new-price">{{ book.newPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  searchKeyword: String
})

const books = ref([
  {
    id: 1,
    img: "sherlock1.jpg",
    title: "Sherlock Holmes: Vụ Án Ở Boscombe",
    aspect: "3/4",
    oldPrice: "120,000₫",
    newPrice: "90,000₫"
  },
  {
    id: 2,
    img: "sherlock2.jpg",
    title: "Sherlock Holmes: Dấu Bộ Tứ",
    aspect: "3/4",
    oldPrice: "130,000₫",
    newPrice: "97,500₫"
  },
  {
    id: 3,
    img: "danbrown1.jpg",
    title: "Mật Mã Da Vinci - Dan Brown",
    aspect: "2/3",
    oldPrice: "200,000₫",
    newPrice: "150,000₫"
  },
  {
    id: 4,
    img: "danbrown2.jpg",
    title: "Thiên Thần và Ác Quỷ - Dan Brown",
    aspect: "2/3",
    oldPrice: "210,000₫",
    newPrice: "157,500₫"
  },
  {
    id: 5,
    img: "agatha1.jpg",
    title: "Án Mạng Trên Sông Nile - Agatha Christie",
    aspect: "3/4",
    oldPrice: "180,000₫",
    newPrice: "135,000₫"
  },
  {
    id: 6,
    img: "agatha2.jpg",
    title: "Mười Người Da Đen Nhỏ - Agatha Christie",
    aspect: "3/4",
    oldPrice: "150,000₫",
    newPrice: "112,500₫"
  },
  {
    id: 7,
    img: "trinhtham1.jpg",
    title: "Phía Sau Nghi Can X - Higashino Keigo",
    aspect: "3/4",
    oldPrice: "170,000₫",
    newPrice: "127,500₫"
  },
  {
    id: 8,
    img: "trinhtham2.jpg",
    title: "Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya",
    aspect: "3/4",
    oldPrice: "140,000₫",
    newPrice: "105,000₫"
  }
])

const filteredBooks = computed(() => {
  if (!props.searchKeyword) return books.value
  return books.value.filter(book =>
    book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  )
})
</script>

<style scoped>
.price {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 5px;
}

.price del {
  color: #555;
  font-size: 14px;
}

.price .new-price {
  color: #d32f2f;
  font-weight: bold;
  font-size: 16px;
}
</style>