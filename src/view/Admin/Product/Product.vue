<template>
  <div class="product-management">
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <div class="page-header mb-4">
        <div>
          <h2 class="fw-bold mb-2">Quản lý sản phẩm</h2>
          <p class="text-muted mb-0">Quản lý danh sách sản phẩm trong hệ thống</p>
        </div>
      </div>

      <!-- Search & Filter Card -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <div class="search-box">
                <i class="bi bi-search"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Tìm kiếm sản phẩm..."
                  @input="currentPage = 1"
                />
              </div>
            </div>
            <div class="col-md-3">
              <select
                v-model="filterCategory"
                class="form-select"
                @change="currentPage = 1"
              >
                <option value="">Tất cả loại</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="sortBy" class="form-select">
                <option value="">Sắp xếp theo</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
                <option value="titleAsc">Tên A-Z</option>
                <option value="titleDesc">Tên Z-A</option>
              </select>
            </div>
            <div class="col-md-3">
              <button
                class="btn btn-primary w-100"
                data-bs-toggle="modal"
                data-bs-target="#addProductModal"
                @click="openAddForm"
              >
                <i class="bi bi-plus-circle me-2"></i>Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table Card -->
      <div class="card shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th style="width: 80px">STT</th>
                  <th style="width: 120px" class="text-center">Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th style="width: 150px">Loại</th>
                  <th style="width: 120px" class="text-end">Giá</th>
                  <th style="width: 100px" class="text-center">Giảm giá</th>
                  <th style="width: 200px" class="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in paginatedProducts" :key="item.id">
                  <td class="fw-semibold">
                    {{ (currentPage - 1) * pageSize + index + 1 }}
                  </td>
                  <td class="text-center">
                    <img
                      :src="
                        item.img?.startsWith('data:')
                          ? item.img
                          : item.img || 'https://via.placeholder.com/80'
                      "
                      alt="Product"
                      class="product-img"
                    />
                  </td>
                  <td>
                    <div class="product-title">{{ item.title }}</div>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border">{{
                      item.category
                    }}</span>
                  </td>
                  <td class="text-end fw-semibold text-success">
                    {{ item.newPrice }}
                  </td>
                  <td class="text-center">
                    <span v-if="item.discount" class="badge bg-danger">{{
                      item.discount
                    }}</span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-sm btn-outline-info me-1"
                      @click="viewProduct(item)"
                      data-bs-toggle="modal"
                      data-bs-target="#detailProductModal"
                      title="Xem chi tiết"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-warning me-1"
                      @click="editProduct(item)"
                      data-bs-toggle="modal"
                      data-bs-target="#addProductModal"
                      title="Chỉnh sửa"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="removeProduct(item.id)"
                      title="Xóa"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="paginatedProducts.length === 0">
                  <td colspan="7" class="text-center py-5">
                    <div class="empty-state">
                      <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                      <p class="text-muted">Không có sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="card-footer bg-white" v-if="totalPages > 1">
          <nav>
            <ul class="pagination justify-content-center mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="prevPage">
                  <i class="bi bi-chevron-left"></i>
                </a>
              </li>
              <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <a class="page-link" href="#" @click.prevent="goToPage(page)">{{
                  page
                }}</a>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <a class="page-link" href="#" @click.prevent="nextPage">
                  <i class="bi bi-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div class="modal fade" id="addProductModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <i
                :class="[
                  'bi',
                  isEdit ? 'bi-pencil-square' : 'bi-plus-circle',
                  'me-2',
                ]"
              ></i>
              {{ isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row g-3">
              <!-- Image Preview -->
              <div class="col-md-4">
                <label class="form-label fw-semibold">Hình ảnh</label>
                <div class="image-upload-box">
                  <img
                    v-if="previewImage"
                    :src="previewImage"
                    alt="Preview"
                    class="preview-image"
                  />
                  <div v-else class="placeholder-box">
                    <i class="bi bi-image display-4 text-muted"></i>
                    <p class="text-muted small mt-2">Chưa có ảnh</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  class="form-control mt-2"
                  @change="onFileChange"
                />
              </div>

              <!-- Form Fields -->
              <div class="col-md-8">
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Tên sản phẩm <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="newProduct.title"
                    type="text"
                    class="form-control"
                    placeholder="Nhập tên sản phẩm"
                    :class="{ 'is-invalid': errors.title }"
                  />
                  <div v-if="errors.title" class="invalid-feedback">
                    {{ errors.title }}
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">
                      Giá <span class="text-danger">*</span>
                    </label>
                    <input
                      v-model="newProduct.newPrice"
                      type="text"
                      class="form-control"
                      placeholder="90,000₫"
                      :class="{ 'is-invalid': errors.newPrice }"
                    />
                    <div v-if="errors.newPrice" class="invalid-feedback">
                      {{ errors.newPrice }}
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Giảm giá</label>
                    <input
                      v-model="newProduct.discount"
                      type="text"
                      class="form-control"
                      placeholder="-25%"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Loại sản phẩm <span class="text-danger">*</span>
                  </label>
                  <select
                    v-model="newProduct.category"
                    class="form-select"
                    :class="{ 'is-invalid': errors.category }"
                  >
                    <option disabled value="">Chọn loại sản phẩm</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                      {{ cat.name }}
                    </option>
                  </select>
                  <div v-if="errors.category" class="invalid-feedback">
                    {{ errors.category }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Mô tả</label>
                  <textarea
                    v-model="newProduct.description"
                    class="form-control"
                    rows="3"
                    placeholder="Nhập mô tả sản phẩm"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              <i class="bi bi-x-circle me-2"></i>Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="saveProduct">
              <i
                :class="[
                  'bi',
                  isEdit ? 'bi-check-circle' : 'bi-plus-circle',
                  'me-2',
                ]"
              ></i>
              {{ isEdit ? "Cập nhật" : "Lưu sản phẩm" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div class="modal fade" id="detailProductModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-info-circle me-2"></i>{{ detailProduct.title }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-5 text-center">
                <img
                  :src="
                    detailProduct.img?.startsWith('data:')
                      ? detailProduct.img
                      : detailProduct.img || 'https://via.placeholder.com/300'
                  "
                  alt="Product"
                  class="img-fluid rounded detail-image"
                />
              </div>
              <div class="col-md-7">
                <div class="detail-info">
                  <div class="info-item">
                    <strong><i class="bi bi-tag me-2"></i>Loại:</strong>
                    <span class="badge bg-light text-dark border ms-2">{{
                      detailProduct.category
                    }}</span>
                  </div>
                  <div class="info-item">
                    <strong><i class="bi bi-currency-dollar me-2"></i>Giá:</strong>
                    <span class="text-success fw-bold ms-2">{{
                      detailProduct.newPrice
                    }}</span>
                  </div>
                  <div class="info-item">
                    <strong><i class="bi bi-percent me-2"></i>Giảm giá:</strong>
                    <span class="ms-2">{{
                      detailProduct.discount || "Không có"
                    }}</span>
                  </div>
                  <div class="info-item">
                    <strong><i class="bi bi-file-text me-2"></i>Mô tả:</strong>
                    <p class="mt-2 text-muted">
                      {{ detailProduct.description || "Không có mô tả" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/stores/ProductStore";
import { useCategoryStore } from "@/stores/Category";
import { toast } from "vue3-toastify";
import { Modal } from "bootstrap";

const productStore = useProductStore();
const categoryStore = useCategoryStore();

onMounted(() => {
  productStore.fetchProducts();
  categoryStore.fetchCategories();
});

const categories = computed(() => categoryStore.categories);
const products = computed(() => productStore.products);

const searchQuery = ref("");
const filterCategory = ref("");
const sortBy = ref("");

const isEdit = ref(false);
const editingId = ref(null);
const newProduct = ref(getEmptyProduct());
const previewImage = ref(null);
const detailProduct = ref(getEmptyProduct());
const errors = ref({});

function getEmptyProduct() {
  return {
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

// Filter + Sort + Pagination
const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchQuery.value.trim().toLowerCase());
    const matchesCategory = filterCategory.value
      ? p.category === filterCategory.value
      : true;
    return matchesSearch && matchesCategory;
  });
});

const sortedProducts = computed(() => {
  const arr = [...filteredProducts.value];
  switch (sortBy.value) {
    case "priceAsc":
      return arr.sort(
        (a, b) =>
          parseFloat(a.newPrice.replace(/[^\d\.]/g, "")) -
          parseFloat(b.newPrice.replace(/[^\d\.]/g, ""))
      );
    case "priceDesc":
      return arr.sort(
        (a, b) =>
          parseFloat(b.newPrice.replace(/[^\d\.]/g, "")) -
          parseFloat(a.newPrice.replace(/[^\d\.]/g, ""))
      );
    case "titleAsc":
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case "titleDesc":
      return arr.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return arr;
  }
});

const currentPage = ref(1);
const pageSize = 9;
const totalPages = computed(() =>
  Math.ceil(sortedProducts.value.length / pageSize)
);
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedProducts.value.slice(start, start + pageSize);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function goToPage(page) {
  currentPage.value = page;
}

// Form validation
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!newProduct.value.title.trim()) {
    errors.value.title = "Tên sản phẩm không được để trống";
    isValid = false;
  }
  if (!newProduct.value.category) {
    errors.value.category = "Vui lòng chọn loại sản phẩm";
    isValid = false;
  }
  if (!newProduct.value.newPrice.trim()) {
    errors.value.newPrice = "Giá sản phẩm không được để trống";
    isValid = false;
  } else {
    const priceNum = parseFloat(
      newProduct.value.newPrice.replace(/[^\d\.]/g, "")
    );
    if (isNaN(priceNum) || priceNum < 0) {
      errors.value.newPrice = "Giá sản phẩm không hợp lệ";
      isValid = false;
    }
  }
  return isValid;
};

const saveProduct = async () => {
  if (!validateForm()) {
    toast.warning("Vui lòng sửa lỗi trong form!", { autoClose: 2000 });
    return;
  }

  try {
    if (isEdit.value) {
      await productStore.updateProduct(editingId.value, newProduct.value);
      toast.success("Cập nhật sản phẩm thành công!", { autoClose: 2000 });
    } else {
      await productStore.addProduct(newProduct.value);
      toast.success("Thêm sản phẩm mới thành công!", { autoClose: 2000 });
    }
    await productStore.fetchProducts();
    resetForm();
    isEdit.value = false;
    editingId.value = null;

    const modalEl = document.getElementById("addProductModal");
    const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
    modal.hide();
  } catch (err) {
    console.error(err);
    toast.error("Lỗi khi lưu sản phẩm!", { autoClose: 2000 });
  }
};

const editProduct = (item) => {
  isEdit.value = true;
  editingId.value = item.id;
  newProduct.value = { ...item };
  previewImage.value = item.img;
  errors.value = {};
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    previewImage.value = event.target.result;
    newProduct.value.img = event.target.result;
  };
  reader.readAsDataURL(file);
};

const removeProduct = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
  try {
    await productStore.deleteProduct(id);
    await productStore.fetchProducts();
    toast.success("Xóa sản phẩm thành công!", { autoClose: 2000 });
  } catch (err) {
    console.error(err);
    toast.error("Xóa sản phẩm thất bại!", { autoClose: 2000 });
  }
};

function resetForm() {
  newProduct.value = getEmptyProduct();
  previewImage.value = null;
  errors.value = {};
}

function openAddForm() {
  resetForm();
  isEdit.value = false;
}

function viewProduct(item) {
  detailProduct.value = { ...item };
}
</script>

<style scoped>
.product-management {
  background: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header h2 {
  color: #2d3748;
  font-size: 1.75rem;
}

/* Search Box */
.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
}

.search-box .form-control {
  padding-left: 40px;
}

/* Card */
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}

/* Table */
.table thead th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #dee2e6;
  padding: 1rem;
}

.table tbody td {
  padding: 1rem;
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Product Image */
.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
}

.product-title {
  font-weight: 500;
  color: #2d3748;
}

/* Buttons */
.btn {
  transition: all 0.2s ease;
}

.btn-outline-info:hover {
  color: #fff;
}

.btn-outline-warning:hover {
  color: #000;
}

.btn-outline-danger:hover {
  color: #fff;
}

/* Pagination */
.pagination .page-link {
  border-radius: 0.375rem;
  margin: 0 2px;
  color: #0d6efd;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

/* Modal */
.modal-content {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  padding: 1.25rem 1.5rem;
  background: #f8f9fa;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
}

/* Image Upload Box */
.image-upload-box {
  border: 2px dashed #dee2e6;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 0.375rem;
}

.placeholder-box {
  text-align: center;
}

/* Detail Modal */
.detail-image {
  max-height: 400px;
  object-fit: contain;
  border: 1px solid #dee2e6;
}

.detail-info {
  padding: 1rem 0;
}

.info-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

/* Empty State */
.empty-state {
  padding: 2rem 0;
  text-align: center;
}

/* Form */
.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header h2 {
    font-size: 1.5rem;
  }

  .table thead th,
  .table tbody td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }

  .product-img {
    width: 60px;
    height: 60px;
  }

  .btn-sm {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
}
</style>