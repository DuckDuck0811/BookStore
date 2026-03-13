<template>
  <div class="category-management">
    <div class="container-fluid p-4">
      <!-- Header -->
      <div class="page-header mb-4">
        <div>
          <h2 class="fw-bold mb-2">Quản lý loại sản phẩm</h2>
          <p class="text-muted mb-0">Quản lý các danh mục sản phẩm trong hệ thống</p>
        </div>
      </div>

      <!-- Search & Filter Card -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-5">
              <div class="search-box">
                <i class="bi bi-search"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Tìm kiếm tên loại sản phẩm..."
                />
              </div>
            </div>
            <div class="col-md-4">
              <select v-model="sortBy" class="form-select">
                <option value="">Sắp xếp theo</option>
                <option value="idAsc">ID tăng dần</option>
                <option value="idDesc">ID giảm dần</option>
                <option value="nameAsc">Tên tăng dần</option>
                <option value="nameDesc">Tên giảm dần</option>
                <option value="countAsc">Số lượng tăng dần</option>
                <option value="countDesc">Số lượng giảm dần</option>
              </select>
            </div>
            <div class="col-md-3">
              <button class="btn btn-primary w-100" @click="openAddModal">
                <i class="bi bi-plus-circle me-2"></i>
                Thêm loại sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="card shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th style="width: 80px">ID</th>
                  <th>Tên loại</th>
                  <th>Mô tả</th>
                  <th style="width: 150px" class="text-center">Số lượng SP</th>
                  <th style="width: 150px" class="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in sortedAndFilteredCategories" :key="category.id">
                  <td>
                    <span class="badge bg-primary">{{ category.id }}</span>
                  </td>
                  <td class="fw-semibold">{{ category.name }}</td>
                  <td class="text-muted">{{ category.description }}</td>
                  <td class="text-center">
                    <span class="count-badge">{{ category.count }}</span>
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-sm btn-outline-warning me-2"
                      @click="openEditModal(category)"
                      title="Sửa"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteCategory(category.id)"
                      title="Xóa"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>

                <tr v-if="!sortedAndFilteredCategories.length && !categoryStore.loading">
                  <td colspan="5" class="text-center py-5">
                    <div class="empty-state">
                      <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                      <p class="text-muted">Chưa có loại sản phẩm nào.</p>
                    </div>
                  </td>
                </tr>

                <tr v-if="categoryStore.loading">
                  <td colspan="5" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-backdrop fade show" @click="closeModal"></div>
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <i
                :class="['bi', isEdit ? 'bi-pencil-square' : 'bi-plus-circle', 'me-2']"
              ></i>
              {{ isEdit ? "Sửa loại sản phẩm" : "Thêm loại sản phẩm" }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">
                Tên loại sản phẩm <span class="text-danger">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="form-control"
                placeholder="Nhập tên loại..."
                maxlength="50"
              />
              <small class="text-muted">Tối đa 50 ký tự</small>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">
                Mô tả <span class="text-danger">*</span>
              </label>
              <textarea
                v-model="formData.description"
                class="form-control"
                placeholder="Nhập mô tả..."
                rows="4"
                maxlength="255"
              ></textarea>
              <small class="text-muted">Tối đa 255 ký tự</small>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              <i class="bi bi-x-circle me-2"></i>Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="submitForm">
              <i
                :class="['bi', isEdit ? 'bi-check-circle' : 'bi-plus-circle', 'me-2']"
              ></i>
              {{ isEdit ? "Lưu thay đổi" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Container -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <div
        v-for="(toast, index) in toasts"
        :key="index"
        class="toast align-items-center text-white border-0 mb-2 show"
        :class="{
          'bg-success': toast.type === 'success',
          'bg-danger': toast.type === 'error',
          'bg-warning text-dark': toast.type === 'warning',
        }"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body">
            <i
              :class="[
                'bi',
                toast.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle',
                'me-2',
              ]"
            ></i>
            {{ toast.message }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="removeToast(index)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCategoryStore } from "@/stores/Category";
import { useProductStore } from "@/stores/ProductStore";
import { toast } from "vue3-toastify";

const categoryStore = useCategoryStore();
const productStore = useProductStore();

const showModal = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const formData = ref({ name: "", description: "" });

const searchQuery = ref("");
const sortBy = ref("");

const toasts = ref([]);

// Load data khi mounted
onMounted(async () => {
  await Promise.all([categoryStore.fetchCategories(), productStore.fetchProducts()]);
});

// Tính số lượng sản phẩm trong từng loại
const categoriesWithCount = computed(() =>
  categoryStore.categories.map((cat) => {
    const count = productStore.products.filter((p) => p.category === cat.name).length;
    return { ...cat, count };
  })
);

// Lọc theo tìm kiếm
const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return categoriesWithCount.value;
  return categoriesWithCount.value.filter(
    (cat) =>
      cat.name.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
  );
});

// Sắp xếp theo chọn
const sortedAndFilteredCategories = computed(() => {
  const cats = [...filteredCategories.value];
  switch (sortBy.value) {
    case "idAsc":
      return cats.sort((a, b) => (a.id > b.id ? 1 : -1));
    case "idDesc":
      return cats.sort((a, b) => (a.id < b.id ? 1 : -1));
    case "nameAsc":
      return cats.sort((a, b) => a.name.localeCompare(b.name));
    case "nameDesc":
      return cats.sort((a, b) => b.name.localeCompare(a.name));
    case "countAsc":
      return cats.sort((a, b) => a.count - b.count);
    case "countDesc":
      return cats.sort((a, b) => b.count - a.count);
    default:
      return cats;
  }
});

const openAddModal = () => {
  isEdit.value = false;
  formData.value = { name: "", description: "" };
  showModal.value = true;
};

const openEditModal = (category) => {
  isEdit.value = true;
  editingId.value = category.id;
  formData.value = { name: category.name, description: category.description };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitForm = async () => {
  if (!formData.value.name.trim()) {
    toast.error("Tên loại sản phẩm không được để trống!", { autoClose: 2000 });
    return;
  }

  if (formData.value.name.length > 50) {
    toast.error("Tên loại sản phẩm không được vượt quá 50 ký tự!", {
      autoClose: 2000,
    });
    return;
  }

  if (formData.value.description.length > 255) {
    toast.error("Mô tả không được vượt quá 255 ký tự!", { autoClose: 2000 });
    return;
  }

  if (!formData.value.description.trim()) {
    toast.error("Mô tả loại sản phẩm không được để trống!", {
      autoClose: 2000,
    });
    return;
  }

  const nameExists = categoryStore.categories.some(
    (cat) =>
      cat.name.toLowerCase() === formData.value.name.trim().toLowerCase() &&
      (!isEdit.value || cat.id !== editingId.value)
  );
  if (nameExists) {
    toast.error("Tên loại sản phẩm đã tồn tại. Vui lòng chọn tên khác.", {
      autoClose: 2000,
    });
    return;
  }

  try {
    if (isEdit.value) {
      await categoryStore.updateCategory(editingId.value, formData.value);
      toast.success("Cập nhật loại sản phẩm thành công!", { autoClose: 2000 });
    } else {
      await categoryStore.addCategory(formData.value);
      toast.success("Thêm loại sản phẩm thành công!", { autoClose: 2000 });
    }

    await categoryStore.fetchCategories();
    closeModal();
  } catch (err) {
    console.error("Lỗi khi lưu danh mục:", err);
  }
};

//  Xóa Category
const deleteCategory = async (id) => {
  if (confirm("Bạn có chắc muốn xóa loại sản phẩm này?")) {
    try {
      await categoryStore.deleteCategory(id);
      await categoryStore.fetchCategories();
      toast.success("Xóa loại sản phẩm thành công!", { autoClose: 2000 });
    } catch (err) {
      toast.error("Lỗi khi xóa loại sản phẩm!", { autoClose: 2000 });
      console.error("Lỗi khi xóa danh mục:", err);
    }
  }
};

function removeToast(index) {
  toasts.value.splice(index, 1);
}
</script>

<style scoped>
.category-management {
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

/* Card Styling */
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}

.card-body {
  padding: 1.5rem;
}

/* Table Styling */
.table {
  margin-bottom: 0;
}

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

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Count Badge */
.count-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Button Styling */
.btn {
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background: #0b5ed7;
  border-color: #0a58ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.2);
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
}

.btn-outline-warning {
  color: #ffc107;
  border-color: #ffc107;
}

.btn-outline-warning:hover {
  background: #ffc107;
  border-color: #ffc107;
  color: #000;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

/* Empty State */
.empty-state {
  padding: 2rem 0;
}

.empty-state i {
  color: #cbd5e0;
}

/* Modal Styling */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  z-index: 1050;
  overflow-y: auto;
}

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

.modal-title {
  color: #2d3748;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
}

/* Form Styling */
.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

textarea.form-control {
  resize: vertical;
}

/* Toast Styling */
.toast {
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
}

.toast-body {
  padding: 0.75rem 1rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header h2 {
    font-size: 1.5rem;
  }

  .card-body {
    padding: 1rem;
  }

  .table thead th,
  .table tbody td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }

  .btn-sm {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }

  .modal-dialog {
    margin: 0.5rem;
  }
}

/* Loading Spinner */
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
