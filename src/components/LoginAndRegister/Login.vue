<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px; border-radius: 12px">
      <!-- Đăng nhập -->
      <h3 class="text-center mb-4">Đăng nhập</h3>

      <!-- Xử lý đăng nhập với form gồm tên đăng nhập với mật khẩu -->
      <form @submit="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Tên đăng nhập:</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            id="username"
            placeholder="Nhập username"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu:</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <div class="form-check mb-3">
          <input
            v-model="remember"
            type="checkbox"
            class="form-check-input"
            id="remember"
          />
          <label class="form-check-label" for="remember">Ghi nhớ đăng nhập</label>
        </div>

        <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
      </form>
      <!-- Chưa có tài khoản sẽ chuyển sang trang Đăng ký -->
      <div class="text-center mt-3">
        <router-link to="/register" class="text-decoration-none">
          Chưa có tài khoản? Đăng ký
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/components/LoginAndRegister/AuthStore";

const username = ref("");
// Lưu user
const password = ref("");
// Lưu pass
const remember = ref(false);
// Lưu trạng thái ghi nhớ đăng nhập
const router = useRouter();
// Sử dụng router để chuyển hướng
const auth = useAuthStore();
// sử dụng store để quản lý trạng thái đăng nhập

onMounted(() => {
  auth.loadUser();
});
// kiểm tra đã từng đăng nhập chưa
const handleLogin = (e) => {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Kiểm tra username và password
  const matchedUser = users.find(
    (u) => u.username === username.value && u.password === password.value
  );

  if (!matchedUser) {
    alert("Sai tên đăng nhập hoặc mật khẩu!");
    return;
  }

  //Kiểm tra trạng thái tài khoản
  if (matchedUser.status === "locked") {
    alert("Tài khoản này đã bị khóa!");
    return;
  }

  // Nếu hợp lệ, đăng nhập
  auth.login(matchedUser, remember.value);
  alert("Đăng nhập thành công!");

  // Phân quyền
  if (matchedUser.role === "admin") {
    router.push("/admin/home");
  } else {
    router.push("/home");
  }
};
</script>
