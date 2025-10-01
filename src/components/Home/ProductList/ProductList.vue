<template>
    <div>
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
                                <button class="btn btn-danger mb-4" style="height: 40px; width: 170px;"
                                    @click.stop="addToCart(book)">
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

        <ProductDetail v-else :book="selectedBook" @back="selectedBook = null" />
        <br /><br />
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import ProductDetail from "../ProductDetail/ProductDetail.vue"
import { useCartStore } from "@/components/Cart/CartStore"
import { useRouter } from "vue-router"


const cartStore = useCartStore()
const router = useRouter()

const props = defineProps({
    searchKeyword: String,
    category: String,
})


const product = ref([
    { id: 1, img: "harrypotter1.jpg", title: "Harry Potter và Hòn Đá Phù Thủy", oldPrice: "120,000₫", newPrice: "90,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Cuốn mở đầu hành trình kỳ diệu của Harry Potter – cậu bé phù thủy mồ côi sống với gia đình Dursley khắc nghiệt, bỗng nhận được thư mời nhập học Hogwarts. Ở đây, Harry khám phá sức mạnh phép thuật tiềm ẩn, làm quen Ron và Hermione, phát hiện những bí mật về cha mẹ mình và đối mặt với thế lực hắc ám đe dọa thế giới phù thủy ngay trong năm học đầu tiên." },
    { id: 2, img: "harrypotter2.jpg", title: "Harry Potter và Phòng Chứa Bí Mật", oldPrice: "130,000₫", newPrice: "97,500₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Harry trở lại Hogwarts trong năm học thứ hai với hàng loạt sự kiện bí ẩn: Phòng Chứa Bí Mật bị mở, học sinh hóa đá và những lời đồn đáng sợ lan truyền. Cùng Ron và Hermione, cậu phải giải mã di sản của Salazar Slytherin, đối mặt với quái vật nguy hiểm và cứu ngôi trường khỏi hiểm họa đang đe dọa từng ngày." },
    { id: 3, img: "lotr1.jpg", title: "The Lord of the Rings: Fellowship of the Ring", oldPrice: "200,000₫", newPrice: "150,000₫", discount: "-25%", aspect: "2/3", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Phần mở đầu sử thi Chúa Tể Những Chiếc Nhẫn theo chân Frodo Baggins – người thừa kế Chiếc Nhẫn Quyền Lực – cùng Nhóm Bạn Đồng Hành gồm người, elf, dwarf và pháp sư Gandalf khởi hành từ Shire, vượt qua bao hiểm nguy để mang chiếc nhẫn tới Mordor, hủy diệt nó trước khi bóng tối Sauron nuốt chửng Trung Địa." },
    { id: 4, img: "lotr2.jpg", title: "The Lord of the Rings: The Two Towers", oldPrice: "210,000₫", newPrice: "157,500₫", discount: "-25%", aspect: "2/3", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Phần hai tiếp tục cuộc phiêu lưu của Nhóm Bạn Đồng Hành khi họ chia tách để đối phó với những thế lực riêng biệt. Frodo và Sam lặng lẽ tiến vào Mordor dưới sự dẫn dắt mờ ám của Gollum, trong khi Aragorn, Legolas và Gimli dẫn đầu cuộc chiến bảo vệ Rohan chống lại đạo quân khổng lồ của Saruman." },
    { id: 5, img: "lotr3.jpg", title: "The Lord of the Rings: Return of the King", oldPrice: "220,000₫", newPrice: "165,000₫", discount: "-25%", aspect: "2/3", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Phần kết hoành tráng của bộ truyện khi các anh hùng hợp lực trong trận chiến cuối cùng chống Sauron. Aragorn chấp nhận ngôi vị vua, Gandalf dẫn dắt lực lượng con người đánh lạc hướng kẻ thù, còn Frodo và Sam phải vượt qua hiểm nguy để mang Chiếc Nhẫn lên đỉnh Núi Doom và hủy diệt nó." },
    { id: 6, img: "hobbit.jpg", title: "The Hobbit", oldPrice: "180,000₫", newPrice: "135,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Câu chuyện về Bilbo Baggins – một Hobbit bình dị yêu thích cuộc sống yên ổn – bất ngờ bị cuốn vào chuyến phiêu lưu cùng nhóm chú lùn và pháp sư Gandalf để giành lại kho báu bị rồng Smaug chiếm giữ. Trên đường đi, Bilbo trải qua nhiều thử thách, trưởng thành hơn và phát hiện ra lòng dũng cảm của chính mình." },
    { id: 7, img: "percyjackson1.jpg", title: "Percy Jackson: The Lightning Thief", oldPrice: "150,000₫", newPrice: "112,500₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Percy Jackson – cậu bé tưởng như bình thường – phát hiện mình là con trai của Poseidon và bị kéo vào thế giới thần thoại Hy Lạp. Khi bị buộc tội lấy trộm Tia Chớp của Zeus, Percy cùng bạn bè bước vào cuộc phiêu lưu đầy nguy hiểm, chiến đấu với quái vật và tìm hiểu sự thật về nguồn gốc của mình." },
    { id: 8, img: "hungergames1.jpg", title: "The Hunger Games", oldPrice: "160,000₫", newPrice: "120,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Katniss Everdeen tình nguyện thay em gái tham gia Hunger Games – cuộc đấu sinh tử truyền hình trực tiếp giữa các quận. Trong đấu trường khốc liệt, cô vừa phải tìm cách sinh tồn vừa trở thành biểu tượng phản kháng của cả quốc gia, khơi dậy hy vọng cho những con người bị áp bức." },
    { id: 9, img: "maze1.jpg", title: "The Maze Runner", oldPrice: "170,000₫", newPrice: "127,500₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Thomas tỉnh dậy trong một thang máy, mất hết ký ức, và xuất hiện ở một mê cung khổng lồ cùng nhiều cậu bé khác. Họ tự tổ chức cuộc sống, tìm lối ra khỏi mê cung và đối mặt với sinh vật nguy hiểm. Thomas phải khám phá sự thật về tổ chức bí ẩn WICKED và vai trò của chính mình trong thí nghiệm tàn khốc này." },
    { id: 10, img: "divergent1.jpg", title: "Divergent", oldPrice: "140,000₫", newPrice: "105,000₫", discount: "-25%", aspect: "3/4", category: "sciFi", cardHeight: '500px', width: '100%', height: '300px', description: "Trong một xã hội chia thành các phe phái dựa trên tính cách, Tris Prior phát hiện mình là Divergent – người không thuộc bất kỳ phe nào – và trở thành mối đe dọa cho chế độ. Cô phải che giấu thân phận, vượt qua những thử thách khắc nghiệt trong khóa huấn luyện và đối mặt với âm mưu lật đổ chính quyền." },

    { id: 11, img: "onepiece.jpg", title: "One Piece", oldPrice: "30,000₫", newPrice: "25,000₫", discount: "-20%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Bộ truyện tranh phiêu lưu nổi tiếng toàn cầu kể về hành trình dài bất tận của Monkey D. Luffy – cậu bé sở hữu năng lực cao su sau khi ăn Trái Ác Quỷ Gomu Gomu – cùng những đồng đội đầy cá tính trên con tàu Going Merry, họ vượt qua các vùng biển nguy hiểm, hải quân và tứ hoàng để tìm kiếm kho báu huyền thoại One Piece và biến giấc mơ trở thành Vua Hải Tặc thành hiện thực." },
    { id: 12, img: "naruto.jpg", title: "Naruto", oldPrice: "35,000₫", newPrice: "30,000₫", discount: "-15%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Naruto Uzumaki – cậu bé mang trong mình sức mạnh phong ấn của Cửu Vĩ Hồ – lớn lên trong sự cô lập và dè bỉu của dân làng Lá. Dù vậy, Naruto không bỏ cuộc, kiên trì rèn luyện, xây dựng tình bạn, học hỏi từ các thầy và từng bước trưởng thành qua các cuộc chiến để trở thành ninja mạnh nhất và hiện thực hóa ước mơ trở thành Hokage được mọi người công nhận." },
    { id: 13, img: "dragonball.png", title: "Dragon Ball", oldPrice: "31,000₫", newPrice: "28,000₫", discount: "-10%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Bộ truyện huyền thoại theo chân Son Goku từ thời niên thiếu đến khi trưởng thành, trong hành trình tìm kiếm bảy viên Ngọc Rồng thần kỳ có thể triệu hồi Rồng Thần để ban điều ước. Goku cùng bạn bè tham gia các giải đấu võ thuật, chiến đấu với những kẻ thù hùng mạnh khắp vũ trụ, bảo vệ Trái Đất và liên tục khám phá những giới hạn sức mạnh mới." },
    { id: 14, img: "bleach.jpg", title: "Bleach", oldPrice: "32,000₫", newPrice: "27,000₫", discount: "-15%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Ichigo Kurosaki – một cậu học sinh trung học có khả năng nhìn thấy linh hồn – bất ngờ nhận được sức mạnh Shinigami từ Rukia và bị cuốn vào cuộc chiến chống lại Hollow, bảo vệ linh hồn con người. Trong khi khám phá Thế Giới Linh Hồn, Ichigo phải đối mặt với những âm mưu phức tạp, những trận chiến đẫm lửa và dần trở thành chiến binh quan trọng." },
    { id: 15, img: "attack_on_titan.jpg", title: "Attack on Titan", oldPrice: "40,000₫", newPrice: "35,000₫", discount: "-12%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Con người sống trong thành phố kiên cố được bao quanh bởi ba bức tường khổng lồ để tránh loài Titan ăn thịt người. Eren Yeager cùng Mikasa và Armin gia nhập quân đội Trinh Sát để chiến đấu chống lại Titan, tìm kiếm sự thật về nguồn gốc của chúng và dần khám phá những bí mật kinh hoàng ẩn giấu bên trong chính nhân loại." },
    { id: 16, img: "my_hero_academia.jpg", title: "My Hero Academia", oldPrice: "38,000₫", newPrice: "33,000₫", discount: "-13%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Trong thế giới nơi hầu hết mọi người sinh ra đều sở hữu siêu năng lực gọi là Quirk, Midoriya Izuku – một cậu bé không có Quirk – vẫn nuôi mơ trở thành anh hùng vĩ đại. Sau khi gặp thần tượng All Might, cậu được truyền lại sức mạnh One For All, gia nhập Học viện U.A. và bước vào hành trình gian nan để chứng minh bản thân giữa vô số kẻ thù nguy hiểm." },
    { id: 17, img: "demon_slayer.jpg", title: "Demon Slayer", oldPrice: "36,000₫", newPrice: "30,000₫", discount: "-17%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Tanjiro Kamado – cậu bé hiền lành – trở thành thợ săn quỷ sau khi gia đình bị quỷ tàn sát, chỉ còn em gái Nezuko sống sót nhưng bị biến thành quỷ. Với thanh kiếm Nichirin và kỹ thuật Hơi Thở Nước, Tanjiro cùng các đồng đội trong Sát Quỷ Đoàn chiến đấu không ngừng để tiêu diệt quỷ dữ và tìm cách biến em gái trở lại thành người." },
    { id: 18, img: "black_clover.jpg", title: "Black Clover", oldPrice: "34,000₫", newPrice: "29,000₫", discount: "-15%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Asta – cậu bé mồ côi sinh ra không có ma thuật trong một thế giới mà ma thuật là tất cả – vẫn nuôi quyết tâm trở thành Ma Pháp Vương. Nhờ ý chí kiên định và sự hỗ trợ của cuốn grimoire năm lá cỏ chứa ma kiếm chống phép thuật, Asta cùng người bạn Yuno trải qua vô số trận chiến khốc liệt và dần chứng minh sức mạnh đặc biệt của mình." },
    { id: 19, img: "hunterxhunter.jpg", title: "Hunter x Hunter", oldPrice: "37,000₫", newPrice: "32,000₫", discount: "-14%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Gon Freecss rời đảo cá nhân để trở thành Hunter – một nghề nghiệp mạo hiểm được cả thế giới ngưỡng mộ – với hy vọng tìm được người cha mất tích. Trên đường đi, cậu gặp Killua, Kurapika, Leorio và cùng họ vượt qua kỳ thi khắc nghiệt, chiến đấu với tội phạm, khám phá những vùng đất bí ẩn và tham gia vào các cuộc phiêu lưu đầy nguy hiểm." },
    { id: 20, img: "fullmetal_alchemist.jpg", title: "Fullmetal Alchemist", oldPrice: "39,000₫", newPrice: "34,000₫", discount: "-13%", aspect: "3/4", category: "comic", width: '100%', height: '300px', cardHeight: '500px', description: "Hai anh em Edward và Alphonse Elric – những thần đồng giả kim – phạm sai lầm khi cố gắng hồi sinh mẹ và phải trả giá đắt: Edward mất tay chân, Alphonse mất toàn bộ cơ thể. Để khôi phục mọi thứ, họ lên đường tìm Hòn Đá Triết Gia, đối mặt với Homunculus, bí mật quân sự và âm mưu khổng lồ đằng sau chính quyền." },

    { id: 21, img: "sherlock1.jpg", title: "Sherlock Holmes: Vụ Án Ở Boscombe", oldPrice: "120,000₫", newPrice: "90,000₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Một trong những vụ án nổi tiếng của thám tử Sherlock Holmes khi ông cùng bác sĩ Watson điều tra cái chết bí ẩn tại Boscombe Valley. Ban đầu mọi bằng chứng đều hướng về một nghi phạm duy nhất, nhưng Holmes bằng sự quan sát tinh tường và phân tích sắc bén đã lật ngược tình thế, vạch trần sự thật ẩn sau những dấu vết tưởng chừng đơn giản." },
    { id: 22, img: "sherlock2.jpg", title: "Sherlock Holmes: Dấu Bộ Tứ", oldPrice: "130,000₫", newPrice: "97,500₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Holmes và Watson đối mặt với vụ án phức tạp liên quan tới kho báu Ấn Độ, lời hứa bí mật của những người lính cũ và bốn dấu hiệu kỳ lạ dẫn đến một chuỗi tội ác rùng rợn. Sự nhạy bén của Holmes đưa người đọc qua từng manh mối, mở ra bức tranh âm mưu và lòng tham của con người." },
    { id: 23, img: "danbrown1.jpg", title: "Mật Mã Da Vinci - Dan Brown", oldPrice: "200,000₫", newPrice: "150,000₫", discount: "-25%", aspect: "2/3", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Giáo sư Robert Langdon cùng nữ chuyên gia mật mã Sophie Neveu lần theo chuỗi mật mã bí ẩn ẩn trong các tác phẩm của Leonardo da Vinci để khám phá một âm mưu tôn giáo hàng nghìn năm. Cuộc truy đuổi nghẹt thở qua Paris và London hé lộ những bí mật chấn động về Chén Thánh và lịch sử Ki-tô giáo." },
    { id: 24, img: "danbrown2.jpg", title: "Thiên Thần và Ác Quỷ - Dan Brown", oldPrice: "210,000₫", newPrice: "157,500₫", discount: "-25%", aspect: "2/3", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Cuộc chiến giữa khoa học và tôn giáo bùng nổ khi Robert Langdon được mời đến CERN và sau đó phải ngăn chặn một quả bom hủy diệt giấu trong thành Vatican. Trên đường truy tìm manh mối, ông vạch trần âm mưu của hội Illuminati cổ xưa và chạy đua với thời gian để cứu các Hồng Y khỏi số phận bi thảm." },
    { id: 25, img: "agatha1.jpg", title: "Án Mạng Trên Sông Nile - Agatha Christie", oldPrice: "180,000₫", newPrice: "135,000₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Trên du thuyền sang trọng giữa dòng sông Nile, một vụ giết người bí ẩn xảy ra khiến mọi hành khách đều trở thành nghi phạm. Thám tử Hercule Poirot phải sử dụng tài quan sát và suy luận để giải mã từng lời khai, từng mối quan hệ phức tạp để tìm ra hung thủ thật sự trong khung cảnh đầy hào nhoáng." },
    { id: 26, img: "agatha2.jpg", title: "Mười Người Da Đen Nhỏ - Agatha Christie", oldPrice: "150,000₫", newPrice: "112,500₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Mười người lạ mặt được mời đến một hòn đảo biệt lập bởi một chủ nhân bí ẩn và lần lượt bị giết theo bài đồng dao kỳ lạ treo trong phòng. Từng chương truyện căng thẳng với bầu không khí ngột ngạt và sự hồi hộp tăng dần, khiến đây trở thành một trong những tác phẩm kinh điển nhất của Agatha Christie." },
    { id: 27, img: "trinhtham1.jpg", title: "Phía Sau Nghi Can X - Higashino Keigo", oldPrice: "170,000₫", newPrice: "127,500₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Một thiên tài toán học lập kế hoạch hoàn hảo để che giấu tội ác của người phụ nữ mình yêu. Câu chuyện mở ra cuộc đấu trí căng thẳng giữa hung thủ và vị thám tử thiên tài, hé lộ sự hy sinh, tình yêu, và những tính toán vượt ngoài dự đoán của độc giả." },
    { id: 28, img: "trinhtham2.jpg", title: "Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya", oldPrice: "140,000₫", newPrice: "105,000₫", discount: "-25%", aspect: "3/4", category: "detective", width: '100%', height: '300px', cardHeight: '500px', description: "Ba thanh niên trốn vào tiệm tạp hóa cũ và phát hiện ra những lá thư cầu cứu từ quá khứ trôi qua khe cửa. Mỗi bức thư hé lộ một câu chuyện kỳ diệu về sự cảm thông, thay đổi cuộc đời và những bí ẩn kết nối quá khứ – hiện tại trong một vòng tròn ấm áp nhưng đầy bất ngờ." },

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
    cartStore.addToCart({
        id: book.id,
        title: book.title,
        price: Number(book.newPrice.replace(/[^\d]/g, "")),
        img: book.img, 
    });
    router.push("/cart"); 
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
