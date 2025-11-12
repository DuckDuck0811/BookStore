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

        <!-- Link Quên mật khẩu -->
        <div class="text-center mt-3">
          <a href="#" @click.prevent="openForgotPasswordModal">Quên mật khẩu?</a>
        </div>
      </form>

      <div class="text-center mt-3">
        <router-link to="/register" class="text-decoration-none">
          Chưa có tài khoản? Đăng ký
        </router-link>
      </div>
    </div>

    <!-- Modal Quên mật khẩu -->
    <div
      v-if="showForgotModal"
      class="modal-backdrop fade show"
      @click="closeForgotPasswordModal"
    ></div>
    <div
      v-if="showForgotModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgotPasswordModalLabel"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title" id="forgotPasswordModalLabel">Quên mật khẩu</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeForgotPasswordModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Nhập email đăng ký của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>
            <input
              type="email"
              v-model="forgotEmail"
              class="form-control"
              placeholder="Nhập email"
              required
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeForgotPasswordModal">
              Hủy
            </button>
            <button class="btn btn-primary" @click="submitForgotPassword">
              Gửi
            </button>
          </div>
        </div>
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

const showForgotModal = ref(false);
const forgotEmail = ref("");

onMounted(() => auth.loadUser());

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

    if (!user) {
      alert("Sai tên đăng nhập hoặc mật khẩu!");
      return;
    }

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

// Quên mật khẩu
const openForgotPasswordModal = () => {
  forgotEmail.value = "";
  showForgotModal.value = true;
};

const closeForgotPasswordModal = () => {
  showForgotModal.value = false;
};

const submitForgotPassword = async () => {
  if (!forgotEmail.value.trim()) {
    alert("Vui lòng nhập email!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/accounts");
    const accounts = await res.json();
    const user = accounts.find(
      (u) => u.email.trim().toLowerCase() === forgotEmail.value.trim().toLowerCase()
    );

    if (!user) {
      alert("Email không tồn tại trong hệ thống!");
      return;
    }

    // Giả lập gửi mail reset
    alert(`Link đặt lại mật khẩu đã được gửi tới ${forgotEmail.value} (giả lập).`);

    closeForgotPasswordModal();
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu đặt lại mật khẩu:", error);
    alert("Lỗi khi gửi yêu cầu đặt lại mật khẩu!");
  }
};
</script>
