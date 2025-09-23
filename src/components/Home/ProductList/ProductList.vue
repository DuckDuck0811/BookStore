<template>
    <div>
        <div class="container">
            <br><br>
            <h5 class="fw-bold mb-3">TẤT CẢ CÁC SẢN PHẨM</h5>

            <div v-if="paginatedBooks.length === 0" class="text-center text-muted">
                Không tìm thấy sách nào phù hợp.
            </div>

            <div class="row g-3" v-else>
                <div class="col-md-3" v-for="book in paginatedBooks" :key="book.id">
                    <div class="card shadow-sm product-card" :style="{ height: book.cardHeight || '500px' }">
                        <img :src="book.img"
                            :class="{ 'special-hp': book.id === 1 || book.id === 23 || book.id === 25 }" :style="{
                                width: book.width || '100%',
                                height: book.height || '300px',
                                objectFit: book.objectFit || 'contain',
                                padding: '10px',
                                background: '#fff',
                                display: 'block',
                                margin: 'auto'
                            }" />
                        <div class="card-body text-center">
                            <p class="card-text fw-semibold">{{ book.title }}</p>
                            <div class="price">
                                <del class="text-muted me-2">{{ book.oldPrice }}</del>
                                <span class="new-price text-danger fw-bold">{{ book.newPrice }}</span>
                                <span class="discount badge bg-danger ms-2">{{ book.discount }}</span>
                            </div>
                        </div>
                        <div class="overlay d-flex justify-content-center align-items-end">
                            <button class="btn btn-danger mb-4">Thêm vô giỏ hàng</button>
                        </div>
                    </div>
                </div>
            </div>

            <nav class="mt-4" v-if="totalPages > 1">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="prevPage" :disabled="currentPage === 1">Trước</button>
                    </li>

                    <li v-for="page in totalPages" :key="page" class="page-item"
                        :class="{ active: currentPage === page }">
                        <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                    </li>

                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">Sau</button>
                    </li>
                </ul>
            </nav>

        </div>
        <br><br>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    searchKeyword: String,
    category: String
})

const product = ref([
    { id: 1, img: "harrypotter1.jpg", title: "Harry Potter và Hòn Đá Phù Thủy", oldPrice: "120,000₫", newPrice: "90,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px' },
    { id: 2, img: "harrypotter2.jpg", title: "Harry Potter và Phòng Chứa Bí Mật", oldPrice: "130,000₫", newPrice: "97,500₫", discount: "-25%", aspect: "3/4", category: "sciFi", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 3, img: "lotr1.jpg", title: "The Lord of the Rings: Fellowship of the Ring", oldPrice: "200,000₫", newPrice: "150,000₫", discount: "-25%", aspect: "2/3", category: "sciFi", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 4, img: "lotr2.jpg", title: "The Lord of the Rings: The Two Towers", oldPrice: "210,000₫", newPrice: "157,500₫", discount: "-25%", aspect: "2/3", category: "sciFi", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 5, img: "lotr3.jpg", title: "The Lord of the Rings: Return of the King", oldPrice: "220,000₫", newPrice: "165,000₫", discount: "-25%", aspect: "2/3", category: "sciFi", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 6, img: "hobbit.jpg", title: "The Hobbit", oldPrice: "180,000₫", newPrice: "135,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 7, img: "percyjackson1.jpg", title: "Percy Jackson: The Lightning Thief", oldPrice: "150,000₫", newPrice: "112,500₫", discount: "-25%", aspect: "3/4", category: "sciFi", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 8, img: "hungergames1.jpg", title: "The Hunger Games", oldPrice: "160,000₫", newPrice: "120,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 9, img: "maze1.jpg", title: "The Maze Runner", oldPrice: "170,000₫", newPrice: "127,500₫", discount: "-25%", aspect: "3/4", category: "sciFi", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 10, img: "divergent1.jpg", title: "Divergent", oldPrice: "140,000₫", newPrice: "105,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", width: '100%', height: '300px', cardHeight: '500px' },

    { id: 11, img: "onepiece.jpg", title: "One Piece", oldPrice: "30,000₫", newPrice: "25,000₫", discount: "-20%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 12, img: "naruto.jpg", title: "Naruto", oldPrice: "35,000₫", newPrice: "30,000₫", discount: "-15%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 13, img: "dragonball.png", title: "Dragon Ball", oldPrice: "31,000₫", newPrice: "28,000₫", discount: "-10%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 14, img: "bleach.jpg", title: "Bleach", oldPrice: "32,000₫", newPrice: "27,000₫", discount: "-15%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 15, img: "attack_on_titan.jpg", title: "Attack on Titan", oldPrice: "40,000₫", newPrice: "35,000₫", discount: "-12%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 16, img: "my_hero_academia.jpg", title: "My Hero Academia", oldPrice: "38,000₫", newPrice: "33,000₫", discount: "-13%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 17, img: "demon_slayer.jpg", title: "Demon Slayer", oldPrice: "36,000₫", newPrice: "30,000₫", discount: "-17%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 18, img: "black_clover.jpg", title: "Black Clover", oldPrice: "34,000₫", newPrice: "29,000₫", discount: "-15%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 19, img: "hunterxhunter.jpg", title: "Hunter x Hunter", oldPrice: "37,000₫", newPrice: "32,000₫", discount: "-14%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 20, img: "fullmetal_alchemist.jpg", title: "Fullmetal Alchemist", oldPrice: "39,000₫", newPrice: "34,000₫", discount: "-13%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px' },

    { id: 21, img: "sherlock1.jpg", title: "Sherlock Holmes: Vụ Án Ở Boscombe", oldPrice: "120,000₫", newPrice: "90,000₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 22, img: "sherlock2.jpg", title: "Sherlock Holmes: Dấu Bộ Tứ", oldPrice: "130,000₫", newPrice: "97,500₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 23, img: "danbrown1.jpg", title: "Mật Mã Da Vinci - Dan Brown", oldPrice: "200,000₫", newPrice: "150,000₫", discount: "-25%", aspect: "2/3", category: "detective", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 24, img: "danbrown2.jpg", title: "Thiên Thần và Ác Quỷ - Dan Brown", oldPrice: "210,000₫", newPrice: "157,500₫", discount: "-25%", aspect: "2/3", category: "detective", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 25, img: "agatha1.jpg", title: "Án Mạng Trên Sông Nile - Agatha Christie", oldPrice: "180,000₫", newPrice: "135,000₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 26, img: "agatha2.jpg", title: "Mười Người Da Đen Nhỏ - Agatha Christie", oldPrice: "150,000₫", newPrice: "112,500₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 27, img: "trinhtham1.jpg", title: "Phía Sau Nghi Can X - Higashino Keigo", oldPrice: "170,000₫", newPrice: "127,500₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px' },
    { id: 28, img: "trinhtham2.jpg", title: "Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya", oldPrice: "140,000₫", newPrice: "105,000₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px' }
])

const filteredBooks = computed(() => {
    return product.value.filter(book => {
        const matchKeyword = !props.searchKeyword || book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
        const matchCategory = !props.category || book.category === props.category
        return matchKeyword && matchCategory
    })
})

const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => {
    return Math.max(1, Math.ceil(filteredBooks.value.length / itemsPerPage.value))
})

const paginatedBooks = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredBooks.value.slice(start, start + itemsPerPage.value)
})

watch([filteredBooks, () => props.category], () => {
    currentPage.value = 1
})


function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
}
function prevPage() {
    if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<style scoped>
.new-price {
    font-size: 1.1rem;
}

.discount {
    font-size: 0.9rem;
}

.special-hp {
    width: 100% !important;
    height: 300px !important;
    object-fit: cover !important;
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
    background: rgba(0, 0, 0, 0.1);
}

.product-card:hover .overlay {
    opacity: 1;
}

.product-card .overlay button {
    position: absolute;
    bottom: 20px;
}
</style>
