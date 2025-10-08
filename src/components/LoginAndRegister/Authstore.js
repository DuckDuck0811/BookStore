import { defineStore } from "pinia";
// localStorage: lưu đăng nhập lâu dài (nếu chọn “ghi nhớ”)
// sessionStorage: chỉ lưu trong 1 phiên làm việc
// role: dùng để phân quyền giữa admin và user
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),

  actions: {
    loadUser() {
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

      const raw =
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser");
      this.user = raw ? JSON.parse(raw) : null;
    },

    login(user, remember) {
      this.user = user;

      if (remember) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
      }
    },

    logout() {
      this.user = null;
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
    role: (state) => state.user?.role || "guest",
    isAdmin: (state) => state.user?.role === "admin",
    isUser: (state) => state.user?.role === "user",
  },
});
