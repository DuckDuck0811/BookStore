import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCartStore } from "@/stores/CartStore";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();

const bookData = ref(null);
const allBooks = ref([]);
const leftBooks = ref([]);
const rightBooks = ref([]);
const qty = ref(1);

// Load tất cả sách 1 lần khi component mount
async function loadAllBooks() {
  try {
    const res = await axios.get("http://localhost:3000/newBooks");
    allBooks.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách sách:", error);
  }
}

// Load chi tiết sách theo id
async function loadBookDetail(id) {
  try {
    const res = await axios.get(`http://localhost:3000/newBooks/${id}`);
    bookData.value = res.data;
  } catch (error) {
    alert("Không thể tải chi tiết sách!");
    console.error(error);
  }
}

// Lấy sách liên quan
function pickRandomBooks() {
  if (!allBooks.value.length || !bookData.value) return;
  const others = allBooks.value.filter((b) => b.id !== bookData.value.id);
  const shuffled = others.sort(() => 0.5 - Math.random());
  leftBooks.value = shuffled.slice(0, 2);
  rightBooks.value = shuffled.slice(2, 4);
}

function addToCart(book) {
  const priceNumber =
    parseInt(String(book.newPrice).replace(/[^\d]/g, ""), 10) || 0;
  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: priceNumber,
    img: book.img,
    quantity: qty.value,
  });
}

function buyNow(book) {
  addToCart(book);
  router.push("/checkout");
}

function goToBook(id) {
  router.push(`/book/${id}`);
}

onMounted(async () => {
  await loadAllBooks();
  await loadBookDetail(route.params.id);
  pickRandomBooks();
});

// Watch id thay đổi => reload data & cập nhật sách liên quan
watch(
  () => route.params.id,
  async (newId) => {
    qty.value = 1; // reset số lượng
    await loadBookDetail(newId);
    pickRandomBooks();
  }
);
