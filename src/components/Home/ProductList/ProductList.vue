<template>
    <div>
        <!-- Nếu chưa chọn sách thì hiển thị danh sách -->
        <div v-if="!selectedBook">
            <div class="container">
                <br /><br />
                <h5 class="fw-bold mb-3">TẤT CẢ CÁC SẢN PHẨM</h5>

                <div v-if="paginatedBooks.length === 0" class="text-center text-muted">
                    Không tìm thấy sách nào phù hợp.
                </div>

                <div class="row g-3" v-else>
                    <div class="col-md-3" v-for="book in paginatedBooks" :key="book.id">
                        <div class="card shadow-sm product-card" :style="{ height: book.cardHeight || '500px' }"
                            @click="viewBookDetail(book)">
                            <!-- ảnh -->
                            <img :src="book.img" :class="{
                                'special-hp': book.id === 1 || book.id === 23 || book.id === 25,
                            }" :style="{
                                width: book.width || '100%',
                                height: book.height || '300px',
                                objectFit: book.objectFit || 'contain',
                                padding: '10px',
                                background: '#fff',
                                display: 'block',
                                margin: 'auto',
                            }" />

                            <!-- nội dung -->
                            <div class="card-body text-center">
                                <p class="card-text fw-semibold">{{ book.title }}</p>
                                <div class="price">
                                    <del class="text-muted me-2">{{ book.oldPrice }}</del>
                                    <span class="new-price text-danger fw-bold">
                                        {{ book.newPrice }}
                                    </span>
                                    <span class="discount badge bg-danger ms-2">
                                        {{ book.discount }}
                                    </span>
                                </div>
                            </div>

                            <!-- overlay -->
                            <div class="overlay d-flex justify-content-center align-items-end">
                                <button class="btn btn-danger mb-4" @click.stop="addToCart(book)">
                                    Thêm vô giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- phân trang -->
                <nav class="mt-4" v-if="totalPages > 1">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="prevPage" :disabled="currentPage === 1">
                                Trước
                            </button>
                        </li>

                        <li v-for="page in totalPages" :key="page" class="page-item"
                            :class="{ active: currentPage === page }">
                            <button class="page-link" @click="goToPage(page)">
                                {{ page }}
                            </button>
                        </li>

                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">
                                Sau
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Trang chi tiết -->
        <ProductDetail v-else :book="selectedBook" @back="selectedBook = null" />

        <br /><br />
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import ProductDetail from "../ProductDetail/ProductDetail.vue"

const props = defineProps({
    searchKeyword: String,
    category: String,
})

const product = ref([
    { id: 1, img: "harrypotter1.jpg", title: "Harry Potter và Hòn Đá Phù Thủy", oldPrice: "120,000₫", newPrice: "90,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Cuốn sách mở đầu hành trình kỳ diệu của Harry Potter, cậu bé phù thủy được mời đến học tại Hogwarts. Tại đây, Harry khám phá ra sức mạnh phép thuật của mình, những bí mật trong quá khứ, và kết bạn với Ron và Hermione để chống lại thế lực hắc ám." },
    { id: 2, img: "harrypotter2.jpg", title: "Harry Potter và Phòng Chứa Bí Mật", oldPrice: "130,000₫", newPrice: "97,500₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Harry trở lại Hogwarts trong năm học thứ hai và phát hiện ra những bí ẩn trong Phòng Chứa Bí Mật. Cùng bạn bè, cậu phải đối mặt với quái vật nguy hiểm, giải mã những lời đồn và cứu nguy cho ngôi trường khỏi hiểm họa." },
    { id: 3, img: "lotr1.jpg", title: "The Lord of the Rings: Fellowship of the Ring", oldPrice: "200,000₫", newPrice: "150,000₫", discount: "-25%", aspect: "2/3", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Phần mở đầu của bộ sử thi Chúa Tể Những Chiếc Nhẫn, theo chân Frodo và Nhóm Bạn Đồng Hành bắt đầu hành trình hủy diệt Chiếc Nhẫn Quyền Lực để cứu Trung Địa khỏi bóng tối Sauron." },
    { id: 4, img: "lotr2.jpg", title: "The Lord of the Rings: The Two Towers", oldPrice: "210,000₫", newPrice: "157,500₫", discount: "-25%", aspect: "2/3", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Phần hai tiếp tục cuộc phiêu lưu của Nhóm Bạn Đồng Hành khi họ tách ra đối phó với những thế lực riêng biệt. Frodo và Sam tiếp tục tiến vào Mordor trong khi Aragorn dẫn đầu cuộc chiến bảo vệ Rohan." },
    { id: 5, img: "lotr3.jpg", title: "The Lord of the Rings: Return of the King", oldPrice: "220,000₫", newPrice: "165,000₫", discount: "-25%", aspect: "2/3", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Phần kết hoành tráng của bộ truyện, khi các anh hùng hợp lực trong trận chiến cuối cùng chống Sauron và Frodo tiến đến đỉnh núi Doom để hủy diệt Chiếc Nhẫn." },
    { id: 6, img: "hobbit.jpg", title: "The Hobbit", oldPrice: "180,000₫", newPrice: "135,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Câu chuyện về Bilbo Baggins, một Hobbit bình dị bị cuốn vào cuộc phiêu lưu cùng các chú lùn và pháp sư Gandalf để giành lại kho báu từ rồng Smaug." },
    { id: 7, img: "percyjackson1.jpg", title: "Percy Jackson: The Lightning Thief", oldPrice: "150,000₫", newPrice: "112,500₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Percy phát hiện mình là con trai của Poseidon và bị kéo vào cuộc phiêu lưu nguy hiểm để tìm lại Tia Chớp của Zeus, đồng thời khám phá thế giới thần thoại Hy Lạp." },
    { id: 8, img: "hungergames1.jpg", title: "The Hunger Games", oldPrice: "160,000₫", newPrice: "120,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Katniss Everdeen tình nguyện thay em gái tham gia Hunger Games – một cuộc đấu sinh tử truyền hình trực tiếp, nơi cô trở thành biểu tượng hy vọng của toàn quốc." },
    { id: 9, img: "maze1.jpg", title: "The Maze Runner", oldPrice: "170,000₫", newPrice: "127,500₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Thomas thức tỉnh trong một mê cung khổng lồ không nhớ gì về quá khứ. Cùng nhóm Gladers, cậu phải tìm cách thoát ra và khám phá sự thật về tổ chức bí ẩn WICKED." },
    { id: 10, img: "divergent1.jpg", title: "Divergent", oldPrice: "140,000₫", newPrice: "105,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Trong một xã hội chia thành các phe phái theo tính cách, Tris phát hiện mình là Divergent – người không thuộc phe nào – và đối mặt với âm mưu lật đổ chính quyền." },

  { id: 11, img: "onepiece.jpg", title: "One Piece", oldPrice: "30,000₫", newPrice: "25,000₫", discount: "-20%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Bộ truyện tranh nổi tiếng kể về hành trình của Luffy – cậu bé có năng lực cao su sau khi ăn Trái Ác Quỷ – cùng các đồng đội tìm kiếm kho báu One Piece và trở thành Vua Hải Tặc." },
  { id: 12, img: "naruto.jpg", title: "Naruto", oldPrice: "35,000₫", newPrice: "30,000₫", discount: "-15%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Naruto Uzumaki – cậu bé mang trong mình sức mạnh của Cửu Vĩ Hồ – vượt qua sự cô lập của làng Lá để trở thành ninja mạnh nhất và đạt ước mơ trở thành Hokage." },
  { id: 13, img: "dragonball.png", title: "Dragon Ball", oldPrice: "31,000₫", newPrice: "28,000₫", discount: "-10%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Theo chân Son Goku từ thời niên thiếu đến khi trưởng thành, bộ truyện kể về những cuộc phiêu lưu tìm ngọc rồng, đấu tranh bảo vệ Trái Đất và khám phá những sức mạnh mới." },
  { id: 14, img: "bleach.jpg", title: "Bleach", oldPrice: "32,000₫", newPrice: "27,000₫", discount: "-15%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Ichigo Kurosaki bất ngờ nhận được sức mạnh Shinigami và phải chiến đấu chống lại Hollow, bảo vệ linh hồn con người và giải quyết những âm mưu trong Thế Giới Linh Hồn." },
  { id: 15, img: "attack_on_titan.jpg", title: "Attack on Titan", oldPrice: "40,000₫", newPrice: "35,000₫", discount: "-12%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Con người sống trong thành phố được bao quanh bởi tường thành để tránh loài Titan khổng lồ. Eren và bạn bè gia nhập quân đội để chiến đấu và khám phá bí mật về Titan." },
  { id: 16, img: "my_hero_academia.jpg", title: "My Hero Academia", oldPrice: "38,000₫", newPrice: "33,000₫", discount: "-13%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Trong thế giới nơi hầu hết mọi người có siêu năng lực (Quirk), Midoriya Izuku – một cậu bé không có Quirk – quyết tâm trở thành anh hùng vĩ đại sau khi gặp thần tượng All Might." },
  { id: 17, img: "demon_slayer.jpg", title: "Demon Slayer", oldPrice: "36,000₫", newPrice: "30,000₫", discount: "-17%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Tanjiro Kamado trở thành thợ săn quỷ sau khi gia đình bị tấn công, chỉ còn em gái Nezuko sống sót nhưng bị biến thành quỷ. Cậu chiến đấu để tìm cách biến em gái trở lại người." },
  { id: 18, img: "black_clover.jpg", title: "Black Clover", oldPrice: "34,000₫", newPrice: "29,000₫", discount: "-15%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Asta – một cậu bé sinh ra không có ma thuật trong một thế giới mà ma thuật là tất cả – nhưng quyết tâm trở thành Ma Pháp Vương với sự hỗ trợ của cuốn grimoire đặc biệt." },
  { id: 19, img: "hunterxhunter.jpg", title: "Hunter x Hunter", oldPrice: "37,000₫", newPrice: "32,000₫", discount: "-14%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Gon Freecss rời đảo cá nhân để trở thành Hunter và tìm cha mình, gặp gỡ những người bạn mới và tham gia các kỳ thi, chiến đấu trong những cuộc phiêu lưu đầy nguy hiểm." },
  { id: 20, img: "fullmetal_alchemist.jpg", title: "Fullmetal Alchemist", oldPrice: "39,000₫", newPrice: "34,000₫", discount: "-13%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Hai anh em Edward và Alphonse Elric phạm sai lầm trong thuật giả kim, mất cơ thể và phải lên đường tìm Hòn Đá Triết Gia để khôi phục mọi thứ, khám phá âm mưu lớn hơn phía sau." },

  { id: 21, img: "sherlock1.jpg", title: "Sherlock Holmes: Vụ Án Ở Boscombe", oldPrice: "120,000₫", newPrice: "90,000₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Một trong những vụ án nổi tiếng của thám tử Sherlock Holmes khi điều tra cái chết bí ẩn tại Boscombe Valley, nơi mà mọi bằng chứng ban đầu đều hướng về một nghi phạm duy nhất." },
  { id: 22, img: "sherlock2.jpg", title: "Sherlock Holmes: Dấu Bộ Tứ", oldPrice: "130,000₫", newPrice: "97,500₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Holmes và Watson đối mặt với vụ án đầy phức tạp liên quan tới kho báu Ấn Độ, lời hứa bí mật và bốn dấu hiệu kỳ lạ dẫn đến một chuỗi tội ác rùng rợn." },
  { id: 23, img: "danbrown1.jpg", title: "Mật Mã Da Vinci - Dan Brown", oldPrice: "200,000₫", newPrice: "150,000₫", discount: "-25%", aspect: "2/3", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Giáo sư Robert Langdon cùng nữ chuyên gia mật mã Sophie Neveu lần theo chuỗi mật mã bí ẩn ẩn trong các tác phẩm của Leonardo da Vinci để khám phá một âm mưu tôn giáo hàng nghìn năm." },
  { id: 24, img: "danbrown2.jpg", title: "Thiên Thần và Ác Quỷ - Dan Brown", oldPrice: "210,000₫", newPrice: "157,500₫", discount: "-25%", aspect: "2/3", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Cuộc chiến giữa khoa học và tôn giáo bùng nổ khi Robert Langdon phải ngăn chặn một quả bom hủy diệt giấu trong thành Vatican, đồng thời vạch trần âm mưu của hội Illuminati." },
  { id: 25, img: "agatha1.jpg", title: "Án Mạng Trên Sông Nile - Agatha Christie", oldPrice: "180,000₫", newPrice: "135,000₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Thám tử Hercule Poirot phải giải mã vụ án giết người trên du thuyền sang trọng giữa dòng sông Nile, nơi mọi hành khách đều có thể là hung thủ." },
  { id: 26, img: "agatha2.jpg", title: "Mười Người Da Đen Nhỏ - Agatha Christie", oldPrice: "150,000₫", newPrice: "112,500₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Mười người lạ mặt được mời đến một hòn đảo biệt lập và lần lượt bị giết theo bài đồng dao kỳ lạ. Một trong những tác phẩm hồi hộp nhất của Agatha Christie." },
  { id: 27, img: "trinhtham1.jpg", title: "Phía Sau Nghi Can X - Higashino Keigo", oldPrice: "170,000₫", newPrice: "127,500₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Một thiên tài toán học lập kế hoạch hoàn hảo để che giấu tội ác của người phụ nữ mình yêu, mở ra cuộc đấu trí căng thẳng giữa hung thủ và cảnh sát." },
  { id: 28, img: "trinhtham2.jpg", title: "Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya", oldPrice: "140,000₫", newPrice: "105,000₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Ba thanh niên trốn vào tiệm tạp hóa cũ và phát hiện ra những lá thư cầu cứu từ quá khứ. Mỗi bức thư hé lộ một câu chuyện kỳ diệu về sự cảm thông và thay đổi cuộc đời." },

])


const selectedBook = ref(null)

const filteredBooks = computed(() => {
    return product.value.filter((book) => {
        const matchKeyword =
            !props.searchKeyword ||
            book.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
        const matchCategory =
            !props.category || book.category === props.category
        return matchKeyword && matchCategory
    })
})

const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredBooks.value.length / itemsPerPage.value))
)

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

function viewBookDetail(book) {
    selectedBook.value = book
}

function addToCart(book) {
    console.log("Đã thêm vào giỏ:", book.title)
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
    cursor: pointer;
    transition: transform 0.2s;
}

.product-card:hover {
    transform: scale(1.03);
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
