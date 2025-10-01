<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px; border-radius: 12px">
      <h3 class="text-center mb-4">Đăng ký</h3>

      <form @submit="handleRegister">
        <div class="mb-3">
          <label for="username" class="form-label">Username:</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            id="username"
            placeholder="Nhập username"
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input
            v-model="email"
            type="text"
            class="form-control"
            id="email"
            placeholder="Nhập email"
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
          />
        </div>
        <button type="submit" class="btn btn-success w-100">Đăng ký</button>
      </form>

      <div class="text-center mt-3">
        <router-link to="/login" class="text-decoration-none">
          Đã có tài khoản? Đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const router = useRouter();

const handleRegister = (e) => {
  e.preventDefault();

  if (!username.value.trim() || !email.value.trim || !password.value.trim()) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some((u) => u.username === username.value)) {
    alert("Username đã tồn tại!");
    return;
  }

  users.push({ username: username.value, email: email.value, password: password.value });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công! Mời bạn đăng nhập.");
  router.push("/login");
};
</script>
