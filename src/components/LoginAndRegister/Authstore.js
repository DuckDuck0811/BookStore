import { defineStore } from "pinia";
import router from "@/components/Home/House/Router/Router.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // người dùng hiện tại
  }),

  actions: {
    loadUser() {
      // Tạo sẵn tài khoản mẫu nếu chưa có
      if (!localStorage.getItem("users")) {
        const sampleUsers = [
          {
            username: "admin",
            password: "123",
            role: "admin",
            fullname: "Quản trị viên",
          },
          {
            username: "user",
            password: "123",
            role: "user",
            fullname: "Người dùng thường",
          },
        ];
        localStorage.setItem("users", JSON.stringify(sampleUsers));
      }

      // Kiểm tra user đang đăng nhập từ localStorage
      const raw =
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser");
      this.user = raw ? JSON.parse(raw) : null;
    },

    login(user, remember) {
      this.user = user;

      if (remember) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        sessionStorage.removeItem("currentUser");
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.removeItem("currentUser");
      }
    },

    //Đăng xuất
    logout() {
      this.user = null;
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");
      router.push({ name: "Home" });
    },

    // Chặn router khi chưa đăng nhập
    requireLogin(redirectPath = "/") {
      if (!this.user) {
        router.push({ name: "Login", query: { redirect: redirectPath } });
        return false;
      }
      return true;
    },
  },

  getters: {
    // Check đăng nhập chưa
    isLoggedIn: (state) => !!state.user,

    // Lấy role, mặc định là “guest”
    role: (state) => state.user?.role || "guest",
    // Các hàm phân quyền nhanh
    isAdmin: (state) => state.user?.role === "admin",
    isUser: (state) => state.user?.role === "user",
  },
});
