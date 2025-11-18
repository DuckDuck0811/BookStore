<template>
  <!-- Content -->

  <!-- Header với tìm kiếm, lọc, sắp xếp và nút thêm -->
  <div
    class="card-header bg-white fw-bold d-flex flex-wrap gap-2 align-items-center justify-content-between"
  >
    <span>Product</span>
    <div
      class="d-flex flex-wrap align-items-center gap-3 mb-3"
      style="justify-content: space-between"
    >
      <!-- Nhóm tìm kiếm + filter + sort -->
      <div class="d-flex flex-wrap align-items-center gap-2">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control form-control-sm"
          placeholder="Tìm kiếm sản phẩm..."
          style="width: 200px"
          @input="currentPage = 1"
        />

        <select
          v-model="filterCategory"
          class="form-select form-select-sm"
          style="width: 180px"
          @change="currentPage = 1"
        >
          <option value="">-- Tất cả loại --</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>

        <select v-model="sortBy" class="form-select form-select-sm" style="width: 180px">
          <option value="">-- Sắp xếp --</option>
          <option value="priceAsc">Giá tăng dần</option>
          <option value="priceDesc">Giá giảm dần</option>
          <option value="titleAsc">Tên A-Z</option>
          <option value="titleDesc">Tên Z-A</option>
        </select>
      </div>

      <!-- Nút thêm sản phẩm -->
      <button
        class="btn btn-primary btn-sm"
        data-bs-toggle="modal"
        data-bs-target="#addProductModal"
        @click="openAddForm"
      >
        + Thêm sản phẩm
      </button>
    </div>
  </div>

  <!-- Bảng dữ liệu -->
  <div class="card-body p-0">
    <table class="table table-bordered table-hover mb-0 align-middle">
      <thead class="table-primary text-center">
        <tr>
          <th style="width: 100px">#</th>
          <th style="width: 150px">Image</th>
          <th>Title</th>
          <th style="width: 150px">Category</th>
          <th style="width: 150px">Price</th>
          <th style="width: 120px">Discount</th>
          <th style="width: 270px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedProducts" :key="item.id">
          <td class="text-center">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td class="text-center">
            <img
              :src="item.img?.startsWith('data:') ? item.img : item.img || 'default.jpg'"
              alt="cover"
              style="width: 80px; height: auto"
            />
          </td>
          <td>{{ item.title }}</td>
          <td class="text-center">{{ item.category }}</td>
          <td class="text-center">{{ item.newPrice }}</td>
          <td class="text-center">{{ item.discount }}</td>
          <td class="text-center">
            <button
              class="btn btn-sm btn-secondary me-1"
              @click="viewProduct(item)"
              data-bs-toggle="modal"
              data-bs-target="#detailProductModal"
            >
              View
            </button>
            <button
              class="btn btn-sm btn-info me-1"
              @click="editProduct(item)"
              data-bs-toggle="modal"
              data-bs-target="#addProductModal"
            >
              Edit
            </button>
            <button class="btn btn-sm btn-danger" @click="removeProduct(item.id)">
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="paginatedProducts.length === 0">
          <td colspan="7" class="text-center text-muted py-3">Không có sản phẩm nào</td>
        </tr>
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
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">&raquo;</a>
        </li>
      </ul>
    </nav>
  </div>

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
          <form @submit.prevent="saveProduct" novalidate>
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
              </div>

              <div class="col-md-8">
                <div class="mb-3">
                  <label class="form-label">Title *</label>
                  <input
                    v-model="newProduct.title"
                    type="text"
                    class="form-control"
                    placeholder="Tên sản phẩm"
                    :class="{ 'is-invalid': errors.title }"
                  />
                  <div v-if="errors.title" class="invalid-feedback">
                    {{ errors.title }}
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Price *</label>
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
                    <label class="form-label">Discount</label>
                    <input
                      v-model="newProduct.discount"
                      type="text"
                      class="form-control"
                      placeholder="-25%"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Category *</label>
                  <select
                    v-model="newProduct.category"
                    class="form-select"
                    :class="{ 'is-invalid': errors.category }"
                  >
                    <option disabled value="">-- Chọn loại sản phẩm --</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                      {{ cat.name }}
                    </option>
                  </select>
                  <div v-if="errors.category" class="invalid-feedback">
                    {{ errors.category }}
                  </div>
                </div>

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
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal xem chi tiết sản phẩm -->
  <div class="modal fade" id="detailProductModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content rounded-3 shadow-lg">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">{{ detailProduct.title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-5 text-center">
              <img
                :src="
                  detailProduct.img?.startsWith('data:')
                    ? detailProduct.img
                    : detailProduct.img || 'default.jpg'
                "
                alt="Image"
                class="img-fluid rounded"
                style="max-height: 300px; object-fit: contain"
              />
            </div>
            <div class="col-md-7">
              <p><strong>Category:</strong> {{ detailProduct.category }}</p>
              <p><strong>Price:</strong> {{ detailProduct.newPrice }}</p>
              <p><strong>Discount:</strong> {{ detailProduct.discount }}</p>
              <p><strong>Description:</strong></p>
              <p>{{ detailProduct.description || "Không có mô tả" }}</p>
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

  <!-- Toast thông báo -->
  <div
    class="position-fixed top-0 end-0 p-3 mt-3 me-3"
    style="z-index: 1055"
    aria-live="polite"
    aria-atomic="true"
  >
    <div
      ref="toastElement"
      class="toast align-items-center text-bg-success border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toastMessage }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/stores/ProductStore";
import { useCategoryStore } from "@/stores/Category";
import { toast } from "vue3-toastify";
import Toast from "bootstrap/js/dist/toast";
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

const toastMessage = ref("");
let toastInstance = null;
const toastElement = ref(null);

onMounted(() => {
  if (toastElement.value) {
    toastInstance = new Toast(toastElement.value);
  }
});

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

// --- Filter + Sort + Pagination ---
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
const totalPages = computed(() => Math.ceil(sortedProducts.value.length / pageSize));
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

//  Form

const errors = ref({});

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
    // Kiểm tra định dạng giá (có thể mở rộng theo định dạng bạn muốn)
    const priceNum = parseFloat(newProduct.value.newPrice.replace(/[^\d\.]/g, ""));
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
  } catch (err) {
    console.error(err);
    toast.error("Lỗi khi lưu sản phẩm!", "danger");
  }
  const modalEl = document.getElementById("addProductModal");
  const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
  modal.hide();
};

const editProduct = (item) => {
  isEdit.value = true;
  editingId.value = item.id;
  newProduct.value = { ...item };
  previewImage.value = item.img;
  errors.value = {};
  const modalEl = document.getElementById("addProductModal");
  const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
  modal.show();
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  newProduct.value.img = file.name;
  previewImage.value = file.name;
};

const removeProduct = async (id) => {
  if (!confirm("Bạn có muốn xóa không?")) return;
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
