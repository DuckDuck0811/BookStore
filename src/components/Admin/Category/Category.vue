<template>
  <div class="container mt-4">
    <h3 class="mb-3">Quản lý loại sản phẩm</h3>

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
          v-for="category in categoriesWithCount"
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

        <tr v-if="!categoriesWithCount.length && !categoryStore.loading">
          <td colspan="5" class="text-center text-muted py-3">
            Chưa có loại sản phẩm nào.
          </td>
        </tr>

        <tr v-if="categoryStore.loading">
          <td colspan="5" class="text-center py-3">Đang tải dữ liệu...</td>
        </tr>
      </tbody>
    </table>

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
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea
                  v-model="formData.description"
                  class="form-control"
                  placeholder="Nhập mô tả..."
                  rows="3"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCategoryStore } from "@/components/Admin/Category/Category";
import { useProductStore } from "@/components/Home/ProductList/ProductStore";

const categoryStore = useCategoryStore();
const productStore = useProductStore();

const showModal = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const formData = ref({ name: "", description: "" });

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

// ===== Submit Form =====
const submitForm = async () => {
  if (!formData.value.name.trim()) {
    alert("Tên loại sản phẩm không được để trống!");
    return;
  }

  try {
    if (isEdit.value) {
      await categoryStore.updateCategory(editingId.value, formData.value);
    } else {
      await categoryStore.addCategory(formData.value);
    }

    await categoryStore.fetchCategories();
    closeModal();
  } catch (err) {
    console.error("Lỗi khi lưu danh mục:", err);
    alert("Không thể lưu danh mục. Kiểm tra lại API URL hoặc ID!");
  }
};

// ===== Xóa Category =====
const deleteCategory = async (id) => {
  if (confirm("Bạn có chắc muốn xóa loại sản phẩm này?")) {
    try {
      await categoryStore.deleteCategory(id);
      await categoryStore.fetchCategories();
    } catch (err) {
      alert("Không thể xóa danh mục (có thể ID không tồn tại trong API).");
    }
  }
};
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
</style>
