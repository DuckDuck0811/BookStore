import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({ user: null }),
  actions: {
    loadUser() {
      const raw = sessionStorage.getItem("user");
      this.user = raw ? JSON.parse(raw) : null;
    },
    login(user) {
      this.user = user;
      sessionStorage.setItem("user", JSON.stringify(user)); // chỉ sessionStorage
    },
    logout() {
      this.user = null;
      sessionStorage.removeItem("user");
    },
  },
});
