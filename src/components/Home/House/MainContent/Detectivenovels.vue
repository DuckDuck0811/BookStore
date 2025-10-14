<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold">TIỂU THUYẾT TRINH THÁM</h5>
    </div>

    <!-- Nếu không tìm thấy dữ liệu thì sẽ hiện không tìm thấy -->
    <div v-if="filteredBooks.length === 0" class="text-center text-muted">
      Không tìm thấy tiểu thuyết trinh thám nào phù hợp.
    </div>

    <!-- Dùng để hiện danh sách sách trinh thám -->
    <div class="row g-3" v-else>
      <div class="col-md-3" v-for="book in filteredBooks" :key="book.id">
        <!-- Tạo những card thẻ và card ảnh -->
        <div
          class="card position-relative product-card"
          :style="{ height: book.cardHeight }"
        >
          <img
            :src="book.img"
            class="card-img-top"
            :style="{
              width: '100%',
              height: book.height,
              aspectRatio: book.aspect,
              objectFit: 'cover',
              borderTopLeftRadius: '.5rem',
              borderTopRightRadius: '.5rem',
            }"
          />

          <!-- nội dung của từng thẻ gồm tên sách và giá bán  -->
          <div class="card-body text-center">
            <p class="card-text">{{ book.title }}</p>
            <div class="price">
              <del>{{ book.oldPrice }}</del>
              <span class="new-price">{{ book.newPrice }}</span>
            </div>
          </div>
          <!-- cho phép người dùng thêm sản phẩm vào giỏ hàng -->
          <div class="overlay d-flex justify-content-center align-items-end">
            <button
              class="btn btn-danger mb-4"
              style="height: 40px; width: 170px"
              @click.stop="addToCart(book)"
            >
              Thêm vô giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/components/Cart/CartStore";
import { toast } from "vue3-toastify";

const props = defineProps({
  searchKeyword: String,
});
// Nhận từ khóa tìm kiếm từ component cha
const cartStore = useCartStore();
// Quản lý trạng thái giỏ hàng
const router = useRouter();
// Router để điều hướng trang
const books = ref([
  {
    id: 1,
    img: "sherlock1.jpg",
    title: "Sherlock Holmes",
    aspect: "3/4",
    oldPrice: "120,000₫",
    newPrice: "90,000₫",
    width: "100%",
    height: "300px",
    cardHeight: "450px",
  },
  {
    id: 2,
    img: "sherlock2.jpg",
    title: "Sherlock Holmes",
    aspect: "3/4",
    oldPrice: "130,000₫",
    newPrice: "97,500₫",
    width: "100%",
    height: "300px",
    cardHeight: "450px",
  },
  {
    id: 3,
    img: "danbrown1.jpg",
    title: "Mật Mã Da Vinci",
    aspect: "2/3",
    oldPrice: "200,000₫",
    newPrice: "150,000₫",
    width: "100%",
    height: "300px",
    cardHeight: "450px",
  },
  {
    id: 4,
    img: "danbrown2.jpg",
    title: "Thiên Thần và Ác Quỷ",
    aspect: "2/3",
    oldPrice: "210,000₫",
    newPrice: "157,500₫",
    width: "100%",
    height: "300px",
    cardHeight: "450px",
  },
  {
    id: 5,
    img: "agatha1.jpg",
    title: "Án Mạng Trên Sông Nile",
    aspect: "3/4",
    oldPrice: "180,000₫",
    newPrice: "135,000₫",
    width: "100%",
    height: "300px",
    cardHeight: "450px",
  },
  {
    id: 6,
    img: "agatha2.jpg",
    title: "Mười Người Da Đen Nhỏ",
    aspect: "3/4",
    oldPrice: "150,000₫",
    newPrice: "112,500₫",
    width: "100%",
    height: "300px",
    cardHeight: "450px",
  },
  {
    id: 7,
    img: "trinhtham1.jpg",
    title: "Phía Sau Nghi Can X",
    aspect: "3/4",
    oldPrice: "170,000₫",
    newPrice: "127,500₫",
    width: "100%",
    height: "300px",
    cardHeight: "450px",
  },
  {
    id: 8,
    img: "trinhtham2.jpg",
    title: "Tiệm Tạp Hóa Namiya",
    aspect: "3/4",
    oldPrice: "140,000₫",
    newPrice: "105,000₫",
    width: "100%",
    height: "300px",
    cardHeight: "450px",
  },
]);
// Dữ liệu sách trinh thám
const filteredBooks = computed(() => {
  if (!props.searchKeyword) return books.value;
  return books.value.filter((book) =>
    book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  );
});
// Lọc sách dựa trên từ khóa tìm kiếm
function addToCart(book) {
  const priceNumber = Number(String(book.newPrice).replace(/[^\d]/g, "")) || 0;
  //Giá sách dạng số
  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: priceNumber,
    img: book.img,
    quantity: 1,
  });
  // Thêm sản phẩm sách vào giỏ hàng
  toast.success("Đã thêm sản phẩm vào giỏ hàng!", { autoClose: 2000 }); //Và tự tắt trong 2 giây
  //Thông báo đã thêm sản phẩm vào giỏ hàng
  setTimeout(() => {
    router.push("/cart");
  }, 2000); //Khi bấm vô thêm giỏ hàng thì sẽ hiện ra thông báo nhỏ trong 2 giây và router sẽ chuyển trang
}
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
  top: 390px;
  transform: none;
}
</style>
