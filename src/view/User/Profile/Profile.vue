<template>
  <div class="container my-5" style="max-width: 600px">
    <h2 class="mb-4 text-center">Thông tin cá nhân</h2>

    <form @submit.prevent="submitProfile" ref="profileForm" novalidate>
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
          :class="{ 'is-invalid': errors.email }"
          v-model="form.email"
          required
        />
        <div v-if="errors.email" class="invalid-feedback">
          {{ errors.email }}
        </div>
      </div>

      <hr />

      <h5>Đổi mật khẩu</h5>

      <div class="mb-3">
        <label for="currentPassword" class="form-label">Mật khẩu hiện tại</label>
        <input
          id="currentPassword"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.currentPassword }"
          v-model="form.currentPassword"
          placeholder="Nhập mật khẩu hiện tại"
          autocomplete="current-password"
        />
        <div v-if="errors.currentPassword" class="invalid-feedback">
          {{ errors.currentPassword }}
        </div>
      </div>

      <div class="mb-3">
        <label for="newPassword" class="form-label">Mật khẩu mới</label>
        <input
          id="newPassword"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.newPassword }"
          v-model="form.newPassword"
          placeholder="Nhập mật khẩu mới"
          autocomplete="new-password"
        />
        <div v-if="errors.newPassword" class="invalid-feedback">
          {{ errors.newPassword }}
        </div>
      </div>

      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Xác nhận mật khẩu mới</label>
        <input
          id="confirmPassword"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.confirmPassword }"
          v-model="form.confirmPassword"
          placeholder="Xác nhận mật khẩu mới"
          autocomplete="new-password"
        />
        <div v-if="errors.confirmPassword" class="invalid-feedback">
          {{ errors.confirmPassword }}
        </div>
      </div>

      <div v-if="successMsg" class="alert alert-success py-2" role="alert">
        {{ successMsg }}
      </div>
      <div v-if="serverError" class="alert alert-danger py-2" role="alert">
        {{ serverError }}
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="loading">
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
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
const successMsg = ref("");
const serverError = ref("");

const form = reactive({
  username: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const errors = reactive({
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const profileForm = ref(null);

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

function clearErrors() {
  errors.email = "";
  errors.currentPassword = "";
  errors.newPassword = "";
  errors.confirmPassword = "";
  serverError.value = "";
  successMsg.value = "";
}

const submitProfile = async () => {
  clearErrors();

  // Validate email
  if (!form.email.trim()) {
    errors.email = "Email không được để trống.";
  } else if (!validateEmail(form.email.trim())) {
    errors.email = "Email không hợp lệ.";
  }

  // Check password fields
  const wantsChangePassword =
    form.newPassword.trim() || form.confirmPassword.trim() || form.currentPassword.trim();

  if (wantsChangePassword) {
    if (!form.currentPassword.trim()) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới.";
    }
    if (!form.newPassword.trim()) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới.";
    }
    if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = "Mật khẩu mới và xác nhận không khớp.";
    }
  }

  // Nếu có lỗi thì dừng
  if (
    errors.email ||
    errors.currentPassword ||
    errors.newPassword ||
    errors.confirmPassword
  ) {
    return;
  }

  loading.value = true;

  try {
    // Lấy dữ liệu tài khoản hiện tại
    const res = await fetch(`http://localhost:3000/accounts/${auth.user.id}`);
    if (!res.ok) {
      serverError.value = "Không thể tải dữ liệu tài khoản.";
      loading.value = false;
      return;
    }
    const currentUser = await res.json();

    // Kiểm tra mật khẩu hiện tại đúng không nếu muốn đổi pass
    if (form.newPassword.trim()) {
      if (form.currentPassword !== currentUser.password) {
        errors.currentPassword = "Mật khẩu hiện tại không đúng.";
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
      serverError.value = "Cập nhật thông tin thất bại.";
      loading.value = false;
      return;
    }

    successMsg.value = "Cập nhật thông tin thành công.";

    // Cập nhật lại auth store
    auth.user.email = form.email.trim();
    if (form.newPassword.trim()) {
      auth.user.password = form.newPassword;
    }

    // Xóa mật khẩu trong form
    form.currentPassword = "";
    form.newPassword = "";
    form.confirmPassword = "";

    // Reset form validation
    profileForm.value?.reset();
  } catch (error) {
    console.error(error);
    serverError.value = "Lỗi kết nối server.";
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

.form-label {
  font-weight: 500;
}

.is-invalid {
  border-color: #dc3545 !important;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23dc3545' viewBox='0 0 12 12'%3e%3cpath d='M11.536 10.732a1.5 1.5 0 01-2.121 0L6 7.317l-3.415 3.415a1.5 1.5 0 11-2.121-2.121l3.415-3.415-3.415-3.415a1.5 1.5 0 112.121-2.121L6 5.183l3.415-3.415a1.5 1.5 0 112.121 2.121l-3.415 3.415 3.415 3.415a1.5 1.5 0 010 2.121z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.invalid-feedback {
  font-size: 0.875rem;
  color: #dc3545;
}

.alert {
  font-size: 0.9rem;
  margin-top: 10px;
}
</style>
