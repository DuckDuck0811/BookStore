<template>
  <div>
    <h5 class="fw-bold mb-3 text-uppercase text-center text-md-start">
      Sách Khoa Học Viễn Tưởng
    </h5>

    <!-- Nếu không tìm thấy dữ liệu -->
    <div v-if="filteredBooks.length === 0" class="text-center text-muted">
      Không tìm thấy sách khoa học viễn tưởng nào phù hợp.
    </div>

    <!-- Danh sách sách -->
    <div class="row g-3" v-else>
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="book in filteredBooks"
        :key="book.id"
      >
        <div class="card product-card h-100 shadow-sm">
          <img
            :src="book.img"
            class="card-img-top"
            :alt="book.title"
            :style="{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderTopLeftRadius: '.5rem',
              borderTopRightRadius: '.5rem',
            }"
          />

          <div class="card-body text-center">
            <p class="card-text fw-semibold">{{ book.title }}</p>
            <div class="price">
              <del>{{ book.oldPrice }}</del>
              <span class="new-price">{{ book.newPrice }}</span>
              <span class="discount">{{ book.discount }}</span>
            </div>
          </div>

          <div class="overlay d-flex justify-content-center align-items-end">
            <button class="btn btn-danger mb-4 add-btn" @click.stop="addToCart(book)">
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

const router = useRouter();
const cartStore = useCartStore();

const sciFiBooks = ref([
  {
    id: 1,
    img: "harrypotter1.jpg",
    title: "Harry Potter và Hòn Đá Phù Thủy",
    oldPrice: "120,000₫",
    newPrice: "90,000₫",
    discount: "-25%",
  },
  {
    id: 2,
    img: "harrypotter2.jpg",
    title: "Harry Potter và Phòng Chứa Bí Mật",
    oldPrice: "130,000₫",
    newPrice: "97,500₫",
    discount: "-25%",
  },
  {
    id: 3,
    img: "lotr1.jpg",
    title: "The Lord of the Rings: Fellowship of the Ring",
    oldPrice: "200,000₫",
    newPrice: "150,000₫",
    discount: "-25%",
  },
  {
    id: 4,
    img: "lotr2.jpg",
    title: "The Lord of the Rings: The Two Towers",
    oldPrice: "210,000₫",
    newPrice: "157,500₫",
    discount: "-25%",
  },
  {
    id: 5,
    img: "lotr3.jpg",
    title: "The Lord of the Rings: Return of the King",
    oldPrice: "220,000₫",
    newPrice: "165,000₫",
    discount: "-25%",
  },
  {
    id: 6,
    img: "hobbit.jpg",
    title: "The Hobbit",
    oldPrice: "180,000₫",
    newPrice: "135,000₫",
    discount: "-25%",
  },
  {
    id: 7,
    img: "percyjackson1.jpg",
    title: "Percy Jackson: The Lightning Thief",
    oldPrice: "150,000₫",
    newPrice: "112,500₫",
    discount: "-25%",
  },
  {
    id: 8,
    img: "hungergames1.jpg",
    title: "The Hunger Games",
    oldPrice: "160,000₫",
    newPrice: "120,000₫",
    discount: "-25%",
  },
]);

const filteredBooks = computed(() => {
  if (!props.searchKeyword) return sciFiBooks.value;
  return sciFiBooks.value.filter((book) =>
    book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  );
});

function addToCart(book) {
  const priceNumber = Number(String(book.newPrice).replace(/[^\d]/g, "")) || 0;
  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: priceNumber,
    img: book.img,
    quantity: 1,
  });
  toast.success("Đã thêm sản phẩm vào giỏ hàng!", { autoClose: 2000 });
  setTimeout(() => {
    router.push("/cart");
  }, 2000);
}
</script>

<style scoped>
.price {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  flex-wrap: wrap;
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

/* Card styling */
.product-card {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Overlay hiệu ứng mờ khi hover */
.product-card .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .overlay {
  opacity: 1;
}

/* Nút hiện dần khi hover */
.add-btn {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.product-card:hover .add-btn {
  opacity: 1;
  transform: translateY(0);
}


</style>
