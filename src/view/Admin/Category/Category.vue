<template>
  <div class="container mt-4">
    <h3 class="mb-3">Quản lý loại sản phẩm</h3>

    <!-- Tìm kiếm & Sắp xếp -->
    <div class="d-flex gap-3 align-items-center mb-3">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="Tìm kiếm tên loại sản phẩm..."
        style="max-width: 300px"
      />

      <select v-model="sortBy" class="form-select" style="max-width: 200px">
        <option value="">Sắp xếp theo</option>
        <option value="idAsc">ID tăng dần</option>
        <option value="idDesc">ID giảm dần</option>
        <option value="nameAsc">Tên tăng dần</option>
        <option value="nameDesc">Tên giảm dần</option>
        <option value="countAsc">Số lượng tăng dần</option>
        <option value="countDesc">Số lượng giảm dần</option>
      </select>
    </div>

    <!-- Nút mở form -->
    <button class="btn btn-primary mb-3" @click="openAddModal">
      + Thêm loại sản phẩm
    </button>

    <!-- Bảng hiển thị -->
    <table class="table table-bordered table-hover align-middle">
      <thead class="table-primary text-center">
        <tr>
          <th>ID</th>
          <th>Tên loại</th>
          <th>Mô tả</th>
          <th>Số lượng sản phẩm</th>
          <th>Thao tác</th> 
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="category in sortedAndFilteredCategories"
          :key="category.id"
          class="text-center"
        >
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td>{{ category.count }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="openEditModal(category)">
              Sửa
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteCategory(category.id)">
              Xóa
            </button>
          </td>
        </tr>

        <tr v-if="!sortedAndFilteredCategories.length && !categoryStore.loading">
          <td colspan="5" class="text-center text-muted py-3">
            Chưa có loại sản phẩm nào.
          </td>
        </tr>

        <tr v-if="categoryStore.loading">
          <td colspan="5" class="text-center py-3">Đang tải dữ liệu...</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showModal" class="modal-backdrop fade show"></div>
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa loại sản phẩm" : "Thêm loại sản phẩm" }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label">Tên loại sản phẩm</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên loại..."
                  required
                  maxlength="50"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea
                  v-model="formData.description"
                  class="form-control"
                  placeholder="Nhập mô tả..."
                  rows="3"
                  maxlength="255"
                ></textarea>
              </div>

              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeModal">
                  Hủy
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ isEdit ? "Lưu thay đổi" : "Thêm mới" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Container góc trên phải -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 2000">
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
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toast.message }}</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="removeToast(index)"
            aria-label="Close"
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

// ===== Modal Control =====
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
    showToast("Tên loại sản phẩm không được để trống!", "error");
    return;
  }

  if (formData.value.name.length > 50) {
    showToast("Tên loại sản phẩm không được vượt quá 50 ký tự!", "error");
    return;
  }

  if (formData.value.description.length > 255) {
    showToast("Mô tả không được vượt quá 255 ký tự!", "error");
    return;
  }

  const nameExists = categoryStore.categories.some(
    (cat) =>
      cat.name.toLowerCase() === formData.value.name.trim().toLowerCase() &&
      (!isEdit.value || cat.id !== editingId.value)
  );
  if (nameExists) {
    showToast("Tên loại sản phẩm đã tồn tại!", "error");
    return;
  }

  try {
    if (isEdit.value) {
      await categoryStore.updateCategory(editingId.value, formData.value);
      showToast("Cập nhật loại sản phẩm thành công!", "success");
    } else {
      await categoryStore.addCategory(formData.value);
      showToast("Thêm loại sản phẩm mới thành công!", "success");
    }

    await categoryStore.fetchCategories();
    closeModal();
  } catch (err) {
    console.error("Lỗi khi lưu danh mục:", err);
    showToast("Không thể lưu danh mục. Kiểm tra lại API!", "error");
  }
};

// ===== Xóa Category =====
const deleteCategory = async (id) => {
  if (confirm("Bạn có chắc muốn xóa loại sản phẩm này?")) {
    try {
      await categoryStore.deleteCategory(id);
      await categoryStore.fetchCategories();
      showToast("Xóa loại sản phẩm thành công!", "success");
    } catch (err) {
      showToast("Không thể xóa danh mục (có thể ID không tồn tại trong API).", "error");
    }
  }
};

function showToast(message, type = "success") {
  const toastObj = { message, type };
  toasts.value.push(toastObj);

  setTimeout(() => {
    const idx = toasts.value.indexOf(toastObj);
    if (idx !== -1) {
      toasts.value.splice(idx, 1);
    }
  }, 3000);
}

function removeToast(index) {
  toasts.value.splice(index, 1);
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

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

.toast-container {
  top: 1rem !important;
  right: 1rem !important;
}
</style>
