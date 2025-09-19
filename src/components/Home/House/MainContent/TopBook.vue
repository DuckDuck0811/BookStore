<template>
  <div>
    <h5 class="fw-bold mb-3">SÁCH KHOA HỌC VIỄN TƯỞNG</h5>
    <div v-if="filteredBooks.length === 0" class="text-center text-muted">
      Không tìm thấy sách khoa học viễn tưởng nào phù hợp.
    </div>
    <div class="row g-3" v-else>
      <div class="col-md-3" v-for="book in filteredBooks" :key="book.id">
        <div class="card h-100">
          <img :src="book.img" class="card-img-top" :style="{
            width: '100%',
            aspectRatio: book.aspect,
            objectFit: 'cover',
            borderTopLeftRadius: '.5rem',
            borderTopRightRadius: '.5rem'
          }" />
          <div class="card-body text-center">
            <p class="card-text">{{ book.title }}</p>
            <div class="price">
              <del>{{ book.oldPrice }}</del>
              <span class="new-price">{{ book.newPrice }}</span>
              <span class="discount">{{ book.discount }}</span>
            </div>
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

const sciFiBooks = ref([
  { id: 1, img: "harrypotter1.jpg", title: "Harry Potter và Hòn Đá Phù Thủy", oldPrice: "120,000₫", newPrice: "90,000₫", discount: "-25%", aspect: "3/4" },
  { id: 2, img: "harrypotter2.jpg", title: "Harry Potter và Phòng Chứa Bí Mật", oldPrice: "130,000₫", newPrice: "97,500₫", discount: "-25%", aspect: "3/4" },
  { id: 3, img: "lotr1.jpg", title: "The Lord of the Rings: Fellowship of the Ring", oldPrice: "200,000₫", newPrice: "150,000₫", discount: "-25%", aspect: "2/3" },
  { id: 4, img: "lotr2.jpg", title: "The Lord of the Rings: The Two Towers", oldPrice: "210,000₫", newPrice: "157,500₫", discount: "-25%", aspect: "2/3" },
  { id: 5, img: "lotr3.jpg", title: "The Lord of the Rings: Return of the King", oldPrice: "220,000₫", newPrice: "165,000₫", discount: "-25%", aspect: "2/3" },
  { id: 6, img: "hobbit.jpg", title: "The Hobbit", oldPrice: "180,000₫", newPrice: "135,000₫", discount: "-25%", aspect: "3/4" },
  { id: 7, img: "percyjackson1.jpg", title: "Percy Jackson: The Lightning Thief", oldPrice: "150,000₫", newPrice: "112,500₫", discount: "-25%", aspect: "3/4" },
  { id: 8, img: "hungergames1.jpg", title: "The Hunger Games", oldPrice: "160,000₫", newPrice: "120,000₫", discount: "-25%", aspect: "3/4" },
  { id: 9, img: "maze1.jpg", title: "The Maze Runner", oldPrice: "170,000₫", newPrice: "127,500₫", discount: "-25%", aspect: "3/4" },
  { id: 10, img: "divergent1.jpg", title: "Divergent", oldPrice: "140,000₫", newPrice: "105,000₫", discount: "-25%", aspect: "3/4" }
])

const filteredBooks = computed(() => {
  if (!props.searchKeyword) return sciFiBooks.value
  return sciFiBooks.value.filter(book =>
    book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  )
})
</script>

<style scoped>
.price {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.price del {
  font-size: 14px;
  color: #555;
}

.price .new-price {
  color: #d32f2f;
  font-weight: bold;
  font-size: 16px;
}

.price .discount {
  background-color: #d32f2f;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>