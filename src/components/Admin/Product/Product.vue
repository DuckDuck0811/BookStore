<template>
  <!-- Content -->
  <div class="card shadow-sm">
    <div
      class="card-header bg-white fw-bold d-flex justify-content-between align-items-center"
    >
      <!-- Form thêm sản phẩm  -->
      <span>Product</span>
      <button
        class="btn btn-outline-secondary btn-sm"
        data-bs-toggle="modal"
        data-bs-target="#addProductModal"
        @click="openAddForm"
      >
        + Add Product
      </button>
    </div>
    <!-- Bảng dữ liệu các thành phần của sản phẩm -->
    <div class="card-body p-0">
      <table class="table table-bordered table-hover mb-0 align-middle">
        <thead class="table-primary text-center">
          <tr>
            <th style="width: 100px">No</th>
            <th style="width: 150px">Image</th>
            <th>Title</th>
            <th style="width: 150px">Category</th>
            <th style="width: 150px">Price</th>
            <th style="width: 120px">Discount</th>
            <th style="width: 220px">Action</th>
          </tr>
        </thead>
        <tbody>
          <!-- Phân trang của sản phẩm mỗi trang có 9 sản phẩm -->
          <tr v-for="(item, index) in paginatedProducts" :key="item.id">
            <td class="text-center">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>
            <td class="text-center">
              <img
                :src="item.img.startsWith('data:') ? item.img : '/' + item.img"
                alt="cover"
                style="width: 80px; height: auto"
              />
              <!-- Hiển thị ảnh của mỗi sản phẩm -->
            </td>
            <td>{{ item.title }}</td>
            <td class="text-center">{{ item.category }}</td>
            <td class="text-center">{{ item.newPrice }}</td>
            <td class="text-center">{{ item.discount }}</td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-info me-1"
                @click="editProduct(item)"
                data-bs-toggle="modal"
                data-bs-target="#addProductModal"
              >
                Edit
                <!-- Nút edit sản phẩm -->
              </button>
              <button class="btn btn-sm btn-danger" @click="removeProduct(item.id)">
                Delete
                <!-- Nút remove sản phẩm -->
              </button>
            </td>
          </tr>
          <tr v-if="paginatedProducts.length === 0">
            <td colspan="7" class="text-center text-muted py-3">Không có sản phẩm nào</td>
          </tr>
          <!-- Giao diện sẽ hiện thông báo "Không có sản phẩm nào" khi danh sách sản phẩm trống -->
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="card-footer d-flex justify-content-center">
      <nav>
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="prevPage">&laquo;</a>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click.prevent="goToPage(page)">
              {{ page }}
            </a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="nextPage">&raquo;</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- Thêm sửa các sản phẩm -->
  <div class="modal fade" id="addProductModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content rounded-3 shadow-lg">
        <div class="modal-header text-white" style="background: #212529">
          <h5 class="modal-title fw-bold">
            {{ isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới" }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="row g-3">
              <div class="col-md-4 text-center">
                <div class="border rounded p-2 bg-light">
                  <img
                    v-if="previewImage"
                    :src="previewImage"
                    alt="Preview"
                    class="img-fluid rounded mb-2"
                    style="max-height: 200px; object-fit: contain"
                  />
                  <div v-else class="text-muted small">Chưa có ảnh</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  class="form-control mt-2"
                  @change="onFileChange"
                />
                <!-- Chọn ảnh của sản phẩm -->
              </div>

              <div class="col-md-8">
                <div class="mb-3">
                  <label class="form-label">Title</label>
                  <input
                    v-model="newProduct.title"
                    type="text"
                    class="form-control"
                    placeholder="Tên sản phẩm"
                  />
                  <!-- Tên sản phẩm -->
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Price</label>
                    <input
                      v-model="newProduct.newPrice"
                      type="text"
                      class="form-control"
                      placeholder="90,000₫"
                    />
                  </div>
                  <!--Giảm giá của sản phẩm -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Discount</label>
                    <input
                      v-model="newProduct.discount"
                      type="text"
                      class="form-control"
                      placeholder="-25%"
                    />
                  </div>
                </div>
                <!-- Chọn loại sản phẩm qua combobox -->
                <div class="mb-3">
                  <label class="form-label">Category</label>
                  <select v-model="newProduct.category" class="form-select">
                    <option disabled value="">-- Chọn loại sản phẩm --</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Science fiction">Science fiction</option>
                    <option value="Detective">Detective</option>
                  </select>
                </div>
                <!-- Mô tả của sản phẩm -->
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea
                    v-model="newProduct.description"
                    class="form-control"
                    rows="3"
                    placeholder="Mô tả sản phẩm"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="text-end mt-3">
              <button type="submit" class="btn btn-success me-2">
                {{ isEdit ? "Cập nhật" : "Lưu sản phẩm" }}
              </button>
              <!-- Nút cập nhật sẽ được thay đổi khi chọn sản phẩm edit và lưu sản phẩm khi thêm sản phẩm mới  -->
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Hủy
              </button>
              <!-- Nút hủy -->
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "../../Home/ProductList/ProductStore";
// gọi file ProductStore để sử dụng các chức năng trong đó
const productStore = useProductStore();
//dùng để khai báo biến từ productStore
productStore.loadDefaultProducts();
//gọi hàm loadDefaultProducts để load dữ liệu sản phẩm
const products = computed(() => productStore.products);
//dùng để hiển thị dữ liệu theo local Stogare
const loading = ref(false);
// dùng để hiển thị trạng thái đang tải dữ liệu
const isEdit = ref(false);
// dùng để xác định sản phẩm đang ở chế độ sửa hay thêm
const editingId = ref(null);
//dùng để lưu ID sản phẩm đang chỉnh sửa
const newProduct = ref(getEmptyProduct());
//dùng để lưu dữ liệu sản phẩm đang được sửa hay thêm
const previewImage = ref(null);
//dùng để xem hình ảnh khi đc upload sản phẩm

onMounted(() => {
  categories.value = JSON.parse(localStorage.getItem("categories")) || [];
});

const openAddForm = () => {
  isEdit.value = false;
  editingId.value = null;
  newProduct.value = getEmptyProduct();
  previewImage.value = null;
};
//dùng để mở form thêm sản phẩm
function getEmptyProduct() {
  return {
    id: Date.now(),
    img: "",
    title: "",
    oldPrice: "",
    newPrice: "",
    discount: "",
    aspect: "3/4",
    category: "",
    width: "100%",
    height: "300px",
    cardHeight: "500px",
    description: "",
  };
}
//form thêm sản phẩm mới với các trường nhập liệu trống để thêm sản phẩm vào bảng

const saveProduct = () => {
  if (isEdit.value) {
    productStore.updateProduct(editingId.value, { ...newProduct.value });
    isEdit.value = false;
    editingId.value = null;
  } else {
    productStore.addProduct({ ...newProduct.value, id: Date.now() });
  }
  resetForm();
};
//dùng để lưu sản phẩm khi cập nhật sản phẩm có sẵn trong local storge

const editProduct = (item) => {
  isEdit.value = true;
  editingId.value = item.id;
  newProduct.value = { ...item };
  previewImage.value = item.img;
};
//dùng để sửa sản phẩm trong local storge

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImage.value = event.target.result;
      newProduct.value.img = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};
//dùng để lưu ảnh từ máy tính lên đk

const removeProduct = (id) => {
  if (confirm("Bạn có muốn xóa không?")) {
    productStore.deleteProduct(id);
  }
};
//hàm dùng để thông báo xóa sản phẩm

function resetForm() {
  newProduct.value = getEmptyProduct();
  previewImage.value = null;
}
//dùng để reset form khi thêm và sửa sản phẩm

const currentPage = ref(1);
// biến phản ứng mặc định là 1
const pageSize = 9;
// biến có tối đa 9 sản phẩm
const totalPages = computed(() => Math.ceil(products.value.length / pageSize));
//tổng số trang sẽ gồm độ dài của sản phẩm / 9 sản phẩm
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return products.value.slice(start, start + pageSize);
});
//dùng để chia nhỏ sản phẩm theo từng trang và hiển thị đúng 9 sản phẩm mỗi trang
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
//hàm dùng để chuyển lùi số trang dần từ lớn xuống bé
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
//hàm dùng để chuyển lùi số trang dần từ bé đến lớn

function goToPage(page) {
  currentPage.value = page;
}
//dùng đến chuyển số trang bất kỳ mà người dùng được chọn
</script>
