<template>
  <div class="container mt-4">
    <h3 class="mb-3">Danh sách tài khoản</h3>
    <button
      class="btn btn-primary mb-3"
      data-bs-toggle="modal"
      data-bs-target="#userModal"
      @click="openAddForm"
    >
      + Thêm tài khoản
    </button>
    <!-- Thêm/Sửa tài khoản -->
    <div
      class="modal fade"
      id="userModal"
      tabindex="-1"
      aria-labelledby="userModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md">
        <div class="modal-content rounded-3 shadow-lg">
          <div class="modal-header text-white" style="background: #212529">
            <h5 class="modal-title fw-bold" id="userModalLabel">
              {{ isEdit ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input
                  v-model="currentUser.username"
                  type="text"
                  class="form-control"
                  placeholder="Tên đăng nhập"
                  :disabled="isEdit"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input
                  v-model="currentUser.fullname"
                  type="text"
                  class="form-control"
                  placeholder="Họ tên đầy đủ"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  v-model="currentUser.password"
                  type="password"
                  class="form-control"
                  placeholder="Mật khẩu"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Role</label>
                <select class="form-select" v-model="currentUser.role" required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div class="text-end">
                <button
                  type="button"
                  class="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                >
                  Hủy
                </button>
                <button type="submit" class="btn btn-success" data-bs-dismiss="modal">
                  {{ isEdit ? "Cập nhật" : "Lưu tài khoản" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng danh sách tài khoản -->
    <table class="table table-bordered table-hover align-middle">
      <thead class="table-primary text-center">
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Role</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.username" class="text-center">
          <td>{{ index + 1 }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.role }}</td>
          <td>
            {{ user.status }}
          </td>
          <td>
            <button
              class="btn btn-sm btn-warning me-2"
              data-bs-toggle="modal"
              data-bs-target="#userModal"
              @click="openEditForm(user)"
            >
              Update
            </button>
            <button class="btn btn-sm btn-danger me-2" @click="deleteUser(user.username)">
              Delete
            </button>
            <button
              class="btn btn-sm"
              :class="user.status === 'locked' ? 'btn-success' : 'btn-secondary'"
              @click="toggleLock(user)"
            >
              {{ user.status === "locked" ? "Mở khóa" : "Khóa" }}
            </button>
          </td>
        </tr>

        <tr v-if="users.length === 0">
          <td colspan="6" class="text-center text-muted py-3">Chưa có tài khoản nào.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API_URL = "http://localhost:3000/accounts";

const users = ref([]); // danh sách tài khoản
const isEdit = ref(false);
const currentUser = ref({
  username: "",
  fullname: "",
  password: "",
  role: "user",
  status: "active",
});

const fetchUsers = async () => {
  try {
    const res = await axios.get(API_URL);
    users.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách tài khoản:", err);
    alert("Không thể tải danh sách tài khoản từ API!");
  }
};

onMounted(fetchUsers);

// ===== Lưu tài khoản (Thêm hoặc Sửa) =====
const saveUser = async () => {
  try {
    if (isEdit.value) {
      // Cập nhật tài khoản
      const existingUser = users.value.find((u) => u.username === currentUser.value.username);
      if (!existingUser) {
        alert("Không tìm thấy tài khoản để cập nhật!");
        return;
      }

      await axios.put(`${API_URL}/${existingUser.id}`, currentUser.value);
      alert("Cập nhật tài khoản thành công!");
    } else {
      // Thêm tài khoản mới
      const exists = users.value.find((u) => u.username === currentUser.value.username);
      if (exists) {
        alert("Username đã tồn tại!");
        return;
      }

      await axios.post(API_URL, currentUser.value);
      alert("Thêm tài khoản thành công!");
    }

    await fetchUsers();
    resetForm();
  } catch (err) {
    alert("Không thể lưu tài khoản!");
  }
};

// ===== Mở form thêm =====
const openAddForm = () => {
  resetForm();
  isEdit.value = false;
};

// ===== Mở form sửa =====
const openEditForm = (user) => {
  currentUser.value = { ...user };
  isEdit.value = true;
};

// ===== Xóa tài khoản =====
const deleteUser = async (username) => {
  if (confirm("Bạn có chắc muốn xóa tài khoản này?")) {
    try {
      const user = users.value.find((u) => u.username === username);
      if (!user) return alert("Không tìm thấy tài khoản!");

      await axios.delete(`${API_URL}/${user.id}`);
      await fetchUsers();
      alert("Đã xóa tài khoản!");
    } catch (err) {
      console.error("Lỗi khi xóa tài khoản:", err);
      alert("Không thể xóa tài khoản!");
    }
  }
};

// ===== Khóa / Mở khóa =====
const toggleLock = async (user) => {
  try {
    const updatedStatus = user.status === "locked" ? "active" : "locked";
    await axios.patch(`${API_URL}/${user.id}`, { status: updatedStatus });
    user.status = updatedStatus;
    alert(updatedStatus === "locked" ? "Tài khoản đã bị khóa!" : "Tài khoản đã được mở khóa!");
  } catch (err) {
    alert("Không thể thay đổi trạng thái tài khoản!");
  }
};

// ===== Reset form =====
const resetForm = () => {
  currentUser.value = {
    username: "",
    fullname: "",
    password: "",
    role: "user",
    status: "active",
  };
};
</script>

