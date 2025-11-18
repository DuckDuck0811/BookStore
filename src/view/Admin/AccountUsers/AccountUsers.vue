<template>
  <div class="container mt-4">
    <h3 class="mb-3">Danh sách tài khoản</h3>

    <!-- Tìm kiếm & Lọc -->
    <div class="mb-3 d-flex gap-3 align-items-center">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        style="width: 800px"
        placeholder="Tìm kiếm username hoặc email..."
      />

      <select v-model="filterRole" class="form-select" style="width: 150px">
        <option value="">Tất cả vai trò</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <select v-model="filterStatus" class="form-select" style="width: 200px">
        <option value="">Tất cả trạng thái</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <button
      class="btn btn-primary mb-3"
      data-bs-toggle="modal"
      data-bs-target="#userModal"
      @click="openAddForm"
    >
      + Thêm tài khoản
    </button>

    <!-- Thêm/Sửa tài khoản Modal -->
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
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="currentUser.email"
                  type="email"
                  class="form-control"
                  placeholder="Địa chỉ email"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  v-model="currentUser.password"
                  type="password"
                  class="form-control"
                  placeholder="Mật khẩu"
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
                <button type="submit" class="btn btn-success">
                  {{ isEdit ? "Cập nhật" : "Lưu tài khoản" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Xem chi tiết tài khoản Modal -->
    <div
      class="modal fade"
      id="userDetailModal"
      tabindex="-1"
      aria-labelledby="userDetailModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md">
        <div class="modal-content rounded-3 shadow-lg">
          <div class="modal-header text-white" style="background: #007bff">
            <h5 class="modal-title fw-bold" id="userDetailModalLabel">
              Thông tin chi tiết tài khoản
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <ul class="list-group">
              <li class="list-group-item"><strong>ID:</strong> {{ detailUser.id }}</li>
              <li class="list-group-item">
                <strong>Username:</strong> {{ detailUser.username }}
              </li>
              <li class="list-group-item">
                <strong>Email:</strong> {{ detailUser.email }}
              </li>
              <li class="list-group-item">
                <strong>Role:</strong> {{ detailUser.role }}
              </li>
              <li class="list-group-item">
                <strong>Status:</strong> {{ detailUser.status }}
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Đổi mật khẩu -->
    <div
      class="modal fade"
      id="changePasswordModal"
      tabindex="-1"
      aria-labelledby="changePasswordModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md">
        <div class="modal-content rounded-3 shadow-lg">
          <div class="modal-header text-white" style="background: #6c757d">
            <h5 class="modal-title fw-bold" id="changePasswordModalLabel">
              Đổi mật khẩu cho {{ passwordUser.username }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="resetChangePasswordForm"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label class="form-label">Mật khẩu cũ</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="passwordForm.oldPassword"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="passwordForm.newPassword"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Nhập lại mật khẩu mới</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="passwordForm.confirmPassword"
                  required
                />
              </div>

              <div class="text-end">
                <button
                  type="button"
                  class="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                  @click="resetChangePasswordForm"
                >
                  Hủy
                </button>
                <button type="submit" class="btn btn-primary">Đổi mật khẩu</button>
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
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, index) in filteredUsers"
          :key="user.username"
          class="text-center"
        >
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.status }}</td>
          <td>
            <button
              class="btn btn-sm btn-info me-2"
              data-bs-toggle="modal"
              data-bs-target="#userDetailModal"
              @click="openDetailModal(user)"
            >
              Detail
            </button>

            <button
              class="btn btn-sm btn-warning me-2"
              data-bs-toggle="modal"
              data-bs-target="#userModal"
              @click="openEditForm(user)"
            >
              Update
            </button>

            <button
              class="btn btn-sm btn-secondary me-2"
              data-bs-toggle="modal"
              data-bs-target="#changePasswordModal"
              @click="openChangePasswordModal(user)"
            >
              Change Password
            </button>

            <button class="btn btn-sm btn-danger me-2" @click="deleteUser(user.username)">
              Delete
            </button>

            <button
              class="btn btn-sm"
              :class="user.status === 'Inactive' ? 'btn-success' : 'btn-secondary'"
              @click="toggleLock(user)"
            >
              {{ user.status === "Inactive" ? "Mở khóa" : "Khóa" }}
            </button>
          </td>
        </tr>

        <tr v-if="filteredUsers.length === 0">
          <td colspan="6" class="text-center text-muted py-3">Chưa có tài khoản nào.</td>
        </tr>
      </tbody>
    </table>

    <!-- Toast Container góc trên phải -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 2000">
      <div
        v-for="(toast, index) in toasts"
        :key="index"
        class="toast align-items-center text-white border-0 mb-2 show fade"
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

const API_URL = "http://localhost:3000/accounts";
import { getCurrentInstance } from "vue";

const internalInstance = getCurrentInstance();
const bootstrap = internalInstance.appContext.config.globalProperties.$bootstrap;
const users = ref([]);
const isEdit = ref(false);
const currentUser = ref({
  id: "",
  username: "",
  email: "",
  password: "",
  role: "user",
  status: "Active",
});

// Thêm state cho detail modal
const detailUser = ref({
  id: "",
  username: "",
  email: "",
  role: "",
  status: "",
});

// State cho đổi mật khẩu
const passwordUser = ref({
  id: "",
  username: "",
  password: "",
});

const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const searchQuery = ref("");
const filterRole = ref("");
const filterStatus = ref("");

//Toast state
const toasts = ref([]);

const fetchUsers = async () => {
  try {
    const res = await axios.get(API_URL);
    users.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách tài khoản:", err);
    toast.error("Không thể tải danh sách tài khoản từ API!", { autoClose: 2000 });
  }
};

onMounted(fetchUsers);

const generateNextUserId = () => {
  if (!users.value.length) return "AC001";
  let maxNum = -1;
  users.value.forEach((u) => {
    const match = u.id?.match(/^AC(\d{3})$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  const nextNum = maxNum + 1;
  return `AC${String(nextNum).padStart(3, "0")}`;
};

const saveUser = async () => {
  if (!currentUser.value.username || currentUser.value.username.trim() === "") {
    toast.error("Username không được để trống!", { autoClose: 2000 });
    return;
  }
  if (!currentUser.value.email || currentUser.value.email.trim() === "") {
    toast.error("Email không được để trống!", { autoClose: 2000 });
    return;
  }
  if (!currentUser.value.password || currentUser.value.password.trim() === "") {
    toast.error("Password không được để trống!", { autoClose: 2000 });
    return;
  }
  if (!currentUser.value.role || currentUser.value.role.trim() === "") {
    toast.error("Role không được để trống!", { autoClose: 2000 });
    return;
  }

  // Kiểm tra trùng username (trừ chính tài khoản khi edit)
  const usernameExists = users.value.some(
    (u) =>
      u.username === currentUser.value.username &&
      (!isEdit.value || u.id !== currentUser.value.id)
  );

  if (usernameExists) {
    toast.error("Username đã tồn tại!", { autoClose: 2000 });
    return;
  }

  // Kiểm tra trùng email (trừ chính tài khoản khi edit)
  const emailExists = users.value.some(
    (u) =>
      u.email === currentUser.value.email &&
      (!isEdit.value || u.id !== currentUser.value.id)
  );

  if (emailExists) {
    toast.error("Email đã được sử dụng!", { autoClose: 2000 });
    return;
  }

  try {
    if (isEdit.value) {
      await axios.put(`${API_URL}/${currentUser.value.id}`, currentUser.value);
      toast.success("Cập nhật tài khoản thành công!", { autoClose: 2000 });
    } else {
      currentUser.value.id = generateNextUserId();
      await axios.post(API_URL, currentUser.value);
      toast.success("Thêm tài khoản thành công!", { autoClose: 2000 });
    }

    await fetchUsers();
    resetForm();

    // Đóng modal thủ công khi thành công
    const modalEl = document.getElementById("userModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
  } catch (error) {
    console.error(error);
    toast.error("Không thể lưu tài khoản!", { autoClose: 2000 });
  }
};

const openAddForm = () => {
  resetForm();
  isEdit.value = false;
};

const openEditForm = (user) => {
  currentUser.value = { ...user };
  isEdit.value = true;
};

// Hàm mở modal xem chi tiết
const openDetailModal = (user) => {
  detailUser.value = { ...user };
};

// Hàm mở modal đổi mật khẩu
const openChangePasswordModal = (user) => {
  passwordUser.value = { ...user };
  resetChangePasswordForm();
};

const resetChangePasswordForm = () => {
  passwordForm.value.oldPassword = "";
  passwordForm.value.newPassword = "";
  passwordForm.value.confirmPassword = "";
};

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error("Mật khẩu mới và xác nhận mật khẩu mới không khớp!", { autoClose: 2000 });
    return;
  }

  if (passwordForm.value.oldPassword !== passwordUser.value.password) {
    toast.error("Mật khẩu cũ không đúng!", { autoClose: 2000 });
    return;
  }

  try {
    await axios.patch(`${API_URL}/${passwordUser.value.id}`, {
      password: passwordForm.value.newPassword,
    });

    // Cập nhật password ở client luôn
    const userIndex = users.value.findIndex((u) => u.id === passwordUser.value.id);
    if (userIndex !== -1) {
      users.value[userIndex].password = passwordForm.value.newPassword;
    }

    toast.success("Đổi mật khẩu thành công!", { autoClose: 2000 });

    const modalEl = document.getElementById("changePasswordModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();

    resetChangePasswordForm();
  } catch (error) {
    console.error(error);
    toast.error("Không thể đổi mật khẩu!", { autoClose: 2000 });
  }
};

const deleteUser = async (username) => {
  if (confirm("Bạn có chắc muốn xóa tài khoản này?")) {
    try {
      const user = users.value.find((u) => u.username === username);
      if (!user) {
        toast.error("Không tìm thấy tài khoản!", { autoClose: 2000 });
        return;
      }
      await axios.delete(`${API_URL}/${user.id}`);
      await fetchUsers();
      toast.success("Đã xóa tài khoản!", { autoClose: 2000 });
    } catch {
      toast.error("Không thể xóa tài khoản!", { autoClose: 2000 });
    }
  }
};

const toggleLock = async (user) => {
  try {
    const updatedStatus = user.status === "Inactive" ? "Active" : "Inactive";
    await axios.patch(`${API_URL}/${user.id}`, { status: updatedStatus });
    user.status = updatedStatus;
    toast.info(
      updatedStatus === "Inactive"
        ? "Tài khoản đã bị khóa!"
        : "Tài khoản đã được mở khóa!",
      { autoClose: 2000 }
    );
  } catch {
    toast.error("Không thể thay đổi trạng thái tài khoản!", { autoClose: 2000 });
  }
};

const resetForm = () => {
  currentUser.value = {
    id: "",
    username: "",
    email: "",
    password: "",
    role: "user",
    status: "Active",
  };
};

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesRole = filterRole.value ? user.role === filterRole.value : true;
    const matchesStatus = filterStatus.value ? user.status === filterStatus.value : true;

    return matchesSearch && matchesRole && matchesStatus;
  });
});

function removeToast(index) {
  toasts.value.splice(index, 1);
}
</script>

<style scoped>
.toast-container {
  position: fixed !important;
  top: 1rem !important;
  right: 1rem !important;
  z-index: 2000;
  max-width: 320px;
}

.toast {
  min-width: 250px;
  opacity: 1;
  transition: opacity 0.3s ease;
}
</style>
