<template>
    <div>
        <div class="container">
            <br><br>
            <h5 class="fw-bold mb-3">TẤT CẢ CÁC SẢN PHẨM</h5>
            <div v-if="filteredBooks.length === 0" class="text-center text-muted">
                Không tìm thấy sách nào phù hợp.
            </div>

            <div class="row g-3" v-else>
                <div class="col-md-3" v-for="book in filteredBooks" :key="book.id">
                    <div class="card h-100 shadow-sm">
                        <!-- Ảnh bìa -->
                        <img :src="book.img" class="book-img" />
                        <div class="card-body text-center">
                            <p class="card-text fw-semibold">{{ book.title }}</p>
                            <div class="price">
                                <del class="text-muted me-2">{{ book.oldPrice }}</del>
                                <span class="new-price text-danger fw-bold">{{ book.newPrice }}</span>
                                <span class="discount badge bg-danger ms-2">{{ book.discount }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br><br>
    </div>
</template>


<script setup>
import Navbar from '../House/Hearder/Navbar.vue';
import Footer from '../House/Footer/Footer.vue';
import TopBar from '../House/Hearder/TopBar.vue';
import { ref, computed } from 'vue';

const props = defineProps({
    searchKeyword: String
});

const product = ref([
    { id: 1, img: "harrypotter1.jpg", title: "Harry Potter và Hòn Đá Phù Thủy", oldPrice: "120,000₫", newPrice: "90,000₫", discount: "-25%", aspect: "3/4", category: "sciFi" },
    { id: 2, img: "harrypotter2.jpg", title: "Harry Potter và Phòng Chứa Bí Mật", oldPrice: "130,000₫", newPrice: "97,500₫", discount: "-25%", aspect: "3/4", category: "sciFi" },
    { id: 3, img: "lotr1.jpg", title: "The Lord of the Rings: Fellowship of the Ring", oldPrice: "200,000₫", newPrice: "150,000₫", discount: "-25%", aspect: "2/3", category: "sciFi" },
    { id: 4, img: "lotr2.jpg", title: "The Lord of the Rings: The Two Towers", oldPrice: "210,000₫", newPrice: "157,500₫", discount: "-25%", aspect: "2/3", category: "sciFi" },
    { id: 5, img: "lotr3.jpg", title: "The Lord of the Rings: Return of the King", oldPrice: "220,000₫", newPrice: "165,000₫", discount: "-25%", aspect: "2/3", category: "sciFi" },
    { id: 6, img: "hobbit.jpg", title: "The Hobbit", oldPrice: "180,000₫", newPrice: "135,000₫", discount: "-25%", aspect: "3/4", category: "sciFi" },
    { id: 7, img: "percyjackson1.jpg", title: "Percy Jackson: The Lightning Thief", oldPrice: "150,000₫", newPrice: "112,500₫", discount: "-25%", aspect: "3/4", category: "sciFi" },
    { id: 8, img: "hungergames1.jpg", title: "The Hunger Games", oldPrice: "160,000₫", newPrice: "120,000₫", discount: "-25%", aspect: "3/4", category: "sciFi" },
    { id: 9, img: "maze1.jpg", title: "The Maze Runner", oldPrice: "170,000₫", newPrice: "127,500₫", discount: "-25%", aspect: "3/4", category: "sciFi" },
    { id: 10, img: "divergent1.jpg", title: "Divergent", oldPrice: "140,000₫", newPrice: "105,000₫", discount: "-25%", aspect: "3/4", category: "sciFi" },

    { id: 11, img: "onepiece.jpg", title: "One Piece", oldPrice: "30,000₫", newPrice: "25,000₫", discount: "-20%", aspect: "3/4", category: "comic" },
    { id: 12, img: "naruto.jpg", title: "Naruto", oldPrice: "35,000₫", newPrice: "30,000₫", discount: "-15%", aspect: "3/4", category: "comic" },
    { id: 13, img: "dragonball.png", title: "Dragon Ball", oldPrice: "31,000₫", newPrice: "28,000₫", discount: "-10%", aspect: "3/4", category: "comic" },

    { id: 14, img: "sherlock1.jpg", title: "Sherlock Holmes: Vụ Án Ở Boscombe", oldPrice: "120,000₫", newPrice: "90,000₫", discount: "-25%", aspect: "3/4", category: "detective" },
    { id: 15, img: "sherlock2.jpg", title: "Sherlock Holmes: Dấu Bộ Tứ", oldPrice: "130,000₫", newPrice: "97,500₫", discount: "-25%", aspect: "3/4", category: "detective" },
    { id: 16, img: "danbrown1.jpg", title: "Mật Mã Da Vinci - Dan Brown", oldPrice: "200,000₫", newPrice: "150,000₫", discount: "-25%", aspect: "2/3", category: "detective" },
    { id: 17, img: "danbrown2.jpg", title: "Thiên Thần và Ác Quỷ - Dan Brown", oldPrice: "210,000₫", newPrice: "157,500₫", discount: "-25%", aspect: "2/3", category: "detective" },
    { id: 18, img: "agatha1.jpg", title: "Án Mạng Trên Sông Nile - Agatha Christie", oldPrice: "180,000₫", newPrice: "135,000₫", discount: "-25%", aspect: "3/4", category: "detective" },
    { id: 19, img: "agatha2.jpg", title: "Mười Người Da Đen Nhỏ - Agatha Christie", oldPrice: "150,000₫", newPrice: "112,500₫", discount: "-25%", aspect: "3/4", category: "detective" },
    { id: 20, img: "trinhtham1.jpg", title: "Phía Sau Nghi Can X - Higashino Keigo", oldPrice: "170,000₫", newPrice: "127,500₫", discount: "-25%", aspect: "3/4", category: "detective" },
    { id: 21, img: "trinhtham2.jpg", title: "Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya", oldPrice: "140,000₫", newPrice: "105,000₫", discount: "-25%", aspect: "3/4", category: "detective" }
]);


const filteredBooks = computed(() => {
    if (!props.searchKeyword) return product.value;
    return product.value.filter(book =>
        book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
    );
});
</script>

<style scoped>
.book-img {
    width: 100%;
    /* full chiều ngang của khung */
    height: 240px;
    /* chiều cao cố định */
    object-fit: contain;
    /* giữ đúng tỉ lệ, không crop */
    padding: 10px;
    aspect-ratio: "book.aspect";
    /* lùi ảnh vào trong */
    background: #fff;
    /* nền trắng đồng bộ */
    display: block;
    margin: auto;

}

.book-img-box {
    margin: 15px auto 0;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    width: 90%;
    text-align: center;
}

.book-img-box {
    padding: 15px;
    text-align: center;
}


.new-price {
    font-size: 1.1rem;
}

.discount {
    font-size: 0.9rem;
}
</style>
