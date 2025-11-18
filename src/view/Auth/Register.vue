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

        <button type="submit" class="btn btn-primary w-100">Đăng ký</button>
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
import { toast } from "vue3-toastify";
const username = ref("");
const email = ref("");
const password = ref("");
const router = useRouter();

const API_URL = "http://localhost:3000/accounts";

const handleRegister = async (e) => {
  e.preventDefault();

  if (!username.value.trim() || !email.value.trim() || !password.value.trim()) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  try {
    // Lấy tất cả user để kiểm tra username và tạo id mới
    const resAll = await fetch(API_URL);
    const allUsers = await resAll.json();

    // Kiểm tra username đã tồn tại chưa
    const existingUser = allUsers.find((u) => u.username === username.value.trim());
    if (existingUser) {
      alert("Username đã tồn tại!");
      return;
    }

    // Tạo id mới theo dạng AC00x
    // Lấy max số từ id hiện có
    let maxIdNum = 0;
    allUsers.forEach((u) => {
      const match = u.id.match(/^AC00(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxIdNum) maxIdNum = num;
      }
    });
    const newId = `AC00${maxIdNum + 1}`;

    // Tạo user mới với id tự sinh
    const newUser = {
      id: newId,
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: "user",
      status: "Active",
    };

    // POST user mới
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    toast.success("Đăng ký thành công! Vui lòng đăng nhập.", { autoClose: 2000 });
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    console.error(error);
    alert("Không thể kết nối tới server!");
  }
};
</script>
