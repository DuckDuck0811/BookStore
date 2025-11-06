<template>
  <!-- Content -->
  <div class="card shadow-sm">
    <div
      class="card-header bg-white fw-bold d-flex justify-content-between align-items-center"
    >
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
            <th style="width: 220px">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedProducts" :key="item.id">
            <td class="text-center">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td class="text-center">
              <img
                :src="
                  item.img?.startsWith('data:')
                    ? item.img
                    : '/' + (item.img || 'default.jpg')
                "
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
  </div>

  <!-- Modal thêm / sửa -->
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
                  <label class="form-label">Category</label>
                  <select v-model="newProduct.category" class="form-select">
                    <option disabled value="">-- Chọn loại sản phẩm --</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                      {{ cat.name }}
                    </option>
                  </select>
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
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/stores/ProductStore";
import { useCategoryStore } from "@/stores/Category";

const productStore = useProductStore();
const categoryStore = useCategoryStore();

onMounted(() => {
  productStore.fetchProducts();
  categoryStore.fetchCategories();
});

const categories = computed(() => categoryStore.categories);
const products = computed(() => productStore.products);
const isEdit = ref(false);
const editingId = ref(null);
const newProduct = ref(getEmptyProduct());
const previewImage = ref(null);

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

const saveProduct = async () => {
  if (
    !newProduct.value.title ||
    !newProduct.value.category ||
    !newProduct.value.newPrice
  ) {
    alert("Vui lòng điền đủ thông tin bắt buộc!");
    return;
  }

  try {
    if (isEdit.value) {
      await productStore.updateProduct(editingId.value, newProduct.value);
      await productStore.fetchProducts();
    } else {
      await productStore.addProduct(newProduct.value);
    }
    resetForm();
    isEdit.value = false;
    editingId.value = null;
  } catch (err) {
    console.error(err);
    alert("Lỗi khi lưu sản phẩm!");
  }
};

const editProduct = (item) => {
  isEdit.value = true;
  editingId.value = item.id;
  newProduct.value = { ...item };
  previewImage.value = item.img;
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  newProduct.value.img = file.name;
  previewImage.value = "/" + file.name;
};

const removeProduct = async (id) => {
  if (!confirm("Bạn có muốn xóa không?")) return;
  try {
    await productStore.deleteProduct(id);
    await productStore.fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Xóa sản phẩm thất bại!");
  }
};

function resetForm() {
  newProduct.value = getEmptyProduct();
  previewImage.value = null;
}

const currentPage = ref(1);
const pageSize = 9;
const totalPages = computed(() => Math.ceil(products.value.length / pageSize));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return products.value.slice(start, start + pageSize);
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
function openAddForm() {
  resetForm();
  isEdit.value = false;
}
</script>
