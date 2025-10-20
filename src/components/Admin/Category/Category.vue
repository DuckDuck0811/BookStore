<template>
  <div class="container mt-4">
    <h3 class="mb-3">Quản lý loại sản phẩm</h3>

    <button class="btn btn-primary mb-3" @click="openAddCategory">Thêm loại sản phẩm</button>

    <table class="table table-bordered table-hover align-middle">
      <thead class="table-primary text-center">
        <tr>
          <th>ID</th>
          <th>Tên loại</th>
          <th>Hành động</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="category in categoryStore.categories" :key="category.id" class="text-center">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="editCategory(category)">Sửa</button>
            <button class="btn btn-sm btn-danger" @click="deleteCategory(category.id)">Xóa</button>
          </td>
        </tr>

        <tr v-if="categoryStore.categories.length === 0">
          <td colspan="3" class="text-center text-muted py-3">Chưa có loại sản phẩm nào.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCategoryStore } from "@/components/Admin/Category/Category";
const categoryStore = useCategoryStore();
// Load dữ liệu mặc định nếu chưa có
onMounted(() => {
  categoryStore.loadDefaultCategories();
});

// Thêm/sửa xài prompt đơn giản (có thể đổi thành modal sau)
const openAddCategory = () => {
  const name = prompt("Nhập tên loại sản phẩm mới:");
  if (name) {
    const id = categoryStore.categories.length
      ? Math.max(...categoryStore.categories.map(c => c.id)) + 1
      : 1;
    categoryStore.addCategory({ id, name });
  }
};

const editCategory = (category) => {
  const name = prompt("Sửa tên loại sản phẩm:", category.name);
  if (name) {
    categoryStore.updateCategory(category.id, { name });
  }
};

const deleteCategory = (id) => {
  if (confirm("Bạn có chắc muốn xóa loại sản phẩm này?")) {
    categoryStore.deleteCategory(id);
  }
};
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}
</style>
