import { defineStore } from "pinia";

//localStorage : Chỗ để nhớ user lâu dài
//auth store: Bộ nhớ để biết đang đăng nhập
//role: Dùng để phân biệt giữa admin và user

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, 
  }),
  actions: {
    loadUser() {
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
