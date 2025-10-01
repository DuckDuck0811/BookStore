import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // user đang đăng nhập
  }),
  actions: {
    loadUser() {
      // Ưu tiên lấy currentUser từ localStorage, nếu không có thì từ sessionStorage
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
});
