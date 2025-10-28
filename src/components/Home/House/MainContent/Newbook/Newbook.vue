<template>
  <div class="container py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold">TRUYỆN TRANH NỔI TIẾNG</h5>
    </div>

    <div v-if="loading" class="text-center text-muted py-5">
      Đang tải dữ liệu truyện tranh...
    </div>

    <div v-else-if="filteredComics.length === 0" class="text-center text-muted">
      Không tìm thấy truyện tranh nào phù hợp.
    </div>

    <div class="comic-list" v-else>
      <div
        class="comic-card"
        v-for="comic in filteredComics"
        :key="comic.id"
        @click="goToDetail(comic)"
      >
        <div class="card product-card">
          <img :src="comic.img" class="card-img-top" />

          <div class="card-body text-center">
            <p class="card-title fw-bold mb-1">{{ comic.title }}</p>

            <div class="price">
              <span class="new-price">{{
                formatPrice(Number(comic.newPrice.replace(/[^\d]/g, "")))
              }}</span>
              <span class="discount-badge">{{ comic.discount }}</span>
            </div>
          </div>

          <div class="overlay d-flex justify-content-center align-items-end">
            <button class="btn btn-danger mb-4" @click.stop="addToCart(comic)">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/components/Cart/CartStore";
import { toast } from "vue3-toastify";
import axios from "axios";

const props = defineProps({ searchKeyword: String });

const comics = ref([]);
const loading = ref(true);

// Lấy dữ liệu truyện tranh nổi tiếng
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/newBooks");
    comics.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    toast.error("Không thể tải danh sách truyện tranh!");
  } finally {
    loading.value = false;
  }
});

// Lọc theo keyword nếu có
const filteredComics = computed(() => {
  if (!props.searchKeyword || props.searchKeyword.trim() === "") return comics.value;
  return comics.value.filter((comic) =>
    comic.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
  );
});

const router = useRouter();
const cartStore = useCartStore();

// Định dạng giá tiền
function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );
}

// Thêm vào giỏ hàng
function addToCart(comic) {
  cartStore.addToCart({
    id: comic.id,
    title: comic.title,
    price: Number(comic.newPrice.replace(/[^\d]/g, "")),
    img: comic.img,
  });
  toast.success("Đã thêm sản phẩm vào giỏ hàng!", { autoClose: 2000 });
  setTimeout(() => {
    router.push("/cart");
  }, 1000);
}

// Chuyển đến trang chi tiết truyện tranh
function goToDetail(comic) {
  router.push(`/newbook/${comic.id}`);
}
</script>

<style scoped>
.comic-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  justify-items: center;
}

.card {
  width: 100%;
  max-width: 280px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  background-color: #fff;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-img-top {
  width: 100%;
  height: 350px;
  object-fit: cover;
}

.price {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.new-price {
  color: #d32f2f;
  font-weight: 600;
  font-size: 15px;
}

.discount-badge {
  background-color: #d32f2f;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 6px;
}

.product-card {
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .overlay {
  opacity: 1;
}

.overlay button {
  height: 40px;
  width: 180px;
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.3s ease;
}

.product-card:hover .overlay button {
  opacity: 1;
  transform: translateY(-5px);
}
</style>
