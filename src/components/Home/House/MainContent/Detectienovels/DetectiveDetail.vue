<template>
  <div class="container mt-4">
    <button class="btn btn-secondary mb-3" @click="$router.back()">Quay lại</button>

    <div v-if="book">
      <div class="row">
        <div class="col-md-4">
          <img :src="book.img" class="img-fluid rounded" alt="book"/>
        </div>
        <div class="col-md-8">
          <h3>{{ book.title }}</h3>
          <p>Giá cũ: <del>{{ book.oldPrice }}</del></p>
          <p>Giá mới: <span class="text-danger fw-bold">{{ book.newPrice }}</span></p>
          <button class="btn btn-danger" @click="addToCart(book)">Thêm vào giỏ hàng</button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted">
      Không tìm thấy thông tin sách.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "@/components/Cart/CartStore";
import { useRoute } from "vue-router";

const route = useRoute();
const cartStore = useCartStore();
const book = ref(null);

const books = [
  {id:1,img:"sherlock1.jpg",title:"Sherlock Holmes: Vụ Án Ở Boscombe",oldPrice: "120,000₫",newPrice: "90,000₫",discount: "-25%",aspect: "3/4",category: "Detective",width: "100%",height: "300px",cardHeight: "500px",description:"Một trong những vụ án nổi tiếng của thám tử Sherlock Holmes khi ông cùng bác sĩ Watson điều tra cái chết bí ẩn tại Boscombe Valley. Ban đầu mọi bằng chứng đều hướng về một nghi phạm duy nhất, nhưng Holmes bằng sự quan sát tinh tường và phân tích sắc bén đã lật ngược tình thế, vạch trần sự thật ẩn sau những dấu vết tưởng chừng đơn giản."},  
  { id: 2, img: "sherlock2.jpg", title: "Sherlock Holmes 2", oldPrice: "130,000₫", newPrice: "97,500₫" },
];

onMounted(() => {
  const id = Number(route.params.id);
  book.value = books.find((b) => b.id === id);
});

function addToCart(book) {
  cartStore.addToCart({
    id: book.id,
    title: book.title,
    price: Number(book.newPrice.replace(/[^\d]/g, "")),
    img: book.img,
  });
  alert("Đã thêm vào giỏ hàng!");
}
</script>
