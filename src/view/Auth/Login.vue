<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px; border-radius: 12px">
      <h3 class="text-center mb-4">Đăng nhập</h3>

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
          <label class="form-check-label" for="remember">
            Ghi nhớ đăng nhập
          </label>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/Authstore";

const username = ref("");
const password = ref("");
const remember = ref(false);
const router = useRouter();
const auth = useAuthStore();

onMounted(() => auth.loadUser());

//  Kiểm tra toàn bộ điều kiện trước khi đăng nhập
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3000/accounts");
    if (!res.ok) {
      alert("Không thể tải danh sách tài khoản");
      return;
    }
    const accounts = await res.json();
    const user = accounts.find(
      (u) =>
        u.username.trim() === username.value.trim() &&
        u.password === password.value
    );

    // Không tìm thấy tài khoản
    if (!user) {
      alert("Sai tên đăng nhập hoặc mật khẩu!");
      return;
    }

    // Tài khoản bị khóa
    const status = (user.status || "").toLowerCase().trim();
    if (status !== "active") {
      alert("Tài khoản này đã bị khóa hoặc chưa kích hoạt!");
      return;
    }

    auth.user = user;

    if (remember.value) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      sessionStorage.removeItem("currentUser");
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.removeItem("currentUser");
    }

    alert("Đăng nhập thành công!");

    // Phân quyền
    if (user.role === "admin") {
      router.push("/admin/home");
    } else {
      router.push("/home");
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    alert("Không thể kết nối tới máy chủ!");
  }
};
</script>
