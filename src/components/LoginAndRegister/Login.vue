<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px; border-radius: 12px;">
      <h3 class="text-center mb-4">Đăng nhập</h3>

      <form @submit="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Username:</label>
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

      <div class="text-center mt-3">
        <router-link to="/register" class="text-decoration-none">
          Chưa có tài khoản? Đăng ký
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/components/LoginAndRegister/Authstore";

const username = ref("");
const password = ref("");
const remember = ref(false);

const router = useRouter();
const auth = useAuthStore();

const handleLogin = (e) => {
  e.preventDefault();

  if (!username.value.trim() || !password.value.trim()) {
    alert("Vui lòng nhập đầy đủ username và mật khẩu!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const matchedUser = users.find(
    (u) => u.username === username.value && u.password === password.value
  );

  if (matchedUser) {
    auth.login(matchedUser, remember.value);
    alert("Đăng nhập thành công!");
    router.push("/home");
  } else {
    alert("Sai username hoặc mật khẩu!");
  }
};
</script>
