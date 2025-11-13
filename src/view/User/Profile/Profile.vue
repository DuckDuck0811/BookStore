<template>
  <div class="container my-5" style="max-width: 600px">
    <h2 class="mb-4 text-center">Thông tin cá nhân</h2>

    <form @submit.prevent="submitProfile">
      <div class="mb-3">
        <label for="username" class="form-label">Tên đăng nhập</label>
        <input
          id="username"
          type="text"
          class="form-control"
          v-model="form.username"
          disabled
        />
        <small class="form-text text-muted">Tên đăng nhập không thể thay đổi.</small>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          class="form-control"
          v-model="form.email"
          required
        />
      </div>

      <hr />

      <h5>Đổi mật khẩu</h5>
      <div class="mb-3">
        <label for="currentPassword" class="form-label">Mật khẩu hiện tại</label>
        <input
          id="currentPassword"
          type="password"
          class="form-control"
          v-model="form.currentPassword"
          placeholder="Nhập mật khẩu hiện tại"
          autocomplete="current-password"
        />
      </div>

      <div class="mb-3">
        <label for="newPassword" class="form-label">Mật khẩu mới</label>
        <input
          id="newPassword"
          type="password"
          class="form-control"
          v-model="form.newPassword"
          placeholder="Nhập mật khẩu mới"
          autocomplete="new-password"
        />
      </div>

      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Xác nhận mật khẩu mới</label>
        <input
          id="confirmPassword"
          type="password"
          class="form-control"
          v-model="form.confirmPassword"
          placeholder="Xác nhận mật khẩu mới"
          autocomplete="new-password"
        />
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Cập nhật thông tin
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useAuthStore } from "@/stores/Authstore";

const auth = useAuthStore();

const loading = ref(false);

const form = reactive({
  username: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

onMounted(() => {
  if (auth.user) {
    form.username = auth.user.username;
    form.email = auth.user.email;
  }
});

watch(
  () => auth.user,
  (newUser) => {
    if (newUser) {
      form.username = newUser.username;
      form.email = newUser.email;
    }
  }
);

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const submitProfile = async () => {
  if (!form.email.trim()) {
    alert("Email không được để trống.");
    return;
  }
  if (!validateEmail(form.email.trim())) {
    alert("Email không hợp lệ.");
    return;
  }

  // Nếu người dùng nhập mật khẩu mới thì phải nhập mật khẩu hiện tại
  if (
    form.newPassword.trim() ||
    form.confirmPassword.trim() ||
    form.currentPassword.trim()
  ) {
    if (!form.currentPassword.trim()) {
      alert("Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      alert("Mật khẩu mới và xác nhận không khớp.");
      return;
    }
  }

  loading.value = true;

  try {
    // Lấy dữ liệu tài khoản hiện tại
    const res = await fetch(`http://localhost:3000/accounts/${auth.user.id}`);
    if (!res.ok) {
      alert("Không thể tải dữ liệu tài khoản.");
      loading.value = false;
      return;
    }
    const currentUser = await res.json();

    // Kiểm tra mật khẩu hiện tại đúng không nếu muốn đổi pass
    if (form.newPassword.trim()) {
      if (form.currentPassword !== currentUser.password) {
        alert("Mật khẩu hiện tại không đúng.");
        loading.value = false;
        return;
      }
    }

    // Tạo object update
    const updateData = {
      email: form.email.trim(),
    };
    if (form.newPassword.trim()) {
      updateData.password = form.newPassword;
    }

    // Gửi PATCH cập nhật thông tin
    const resUpdate = await fetch(`http://localhost:3000/accounts/${auth.user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!resUpdate.ok) {
      alert("Cập nhật thông tin thất bại.");
      loading.value = false;
      return;
    }

    alert("Cập nhật thông tin thành công.");

    // Cập nhật lại auth store
    auth.user.email = form.email.trim();
    if (form.newPassword.trim()) {
      auth.user.password = form.newPassword;
    }

    // Xóa mật khẩu trong form
    form.currentPassword = "";
    form.newPassword = "";
    form.confirmPassword = "";
  } catch (error) {
    console.error(error);
    alert("Lỗi kết nối server.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
h2 {
  font-weight: 600;
  color: #2c3e50;
}
</style>
