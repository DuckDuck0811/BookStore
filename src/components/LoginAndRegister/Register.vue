<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow p-4" style="width: 400px; border-radius: 12px;">
            <h3 class="text-center mb-4">Đăng Ký</h3>

            <!-- Sửa handleSubmit -> handleRegister -->
            <form @submit="handleRegister">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input v-model="username" type="text" class="form-control" id="username"
                        placeholder="Nhập username" />
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input v-model="email" type="email" class="form-control" id="email" placeholder="Nhập email" />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Mật khẩu</label>
                    <input v-model="password" type="password" class="form-control" id="password"
                        placeholder="Nhập mật khẩu" />
                </div>
                <button type="submit" class="btn btn-primary w-100">Đăng ký</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const email = ref("");
const password = ref("");
const router = useRouter();

const handleRegister = (e) => {
    e.preventDefault();

    if (!username.value.trim() || !email.value.trim() || !password.value.trim()) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const newUser = {
        username: username.value,
        email: email.value,
        password: password.value,
    };

    localStorage.setItem("registeredUser", JSON.stringify(newUser));

    alert("Đăng ký thành công, vui lòng đăng nhập!");
    router.push("/login"); // chuyển sang trang login
};
</script>
