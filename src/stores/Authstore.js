import { defineStore } from "pinia";
import router from "@/router/router.js";
import { toast } from "vue3-toastify";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),

  actions: {
    // Load user đang đăng nhập
    loadUser() {
      const raw =
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser");
      this.user = raw ? JSON.parse(raw) : null;
    },

    // Đăng nhập từ db.json
    async login({ username, password, remember }) {
      try {
        const res = await fetch("http://localhost:3000/accounts");

        if (!res.ok) {
          alert("Không thể tải danh sách tài khoản!");
          return false;
        }

        const accounts = await res.json();
        const user = accounts.find(
          (u) => u.username === username && u.password === password
        );

        if (!user) {
          alert("Sai tài khoản hoặc mật khẩu!");
          return false;
        }

        const status = (user.status || "").toLowerCase().trim();
        if (status !== "active") {
          alert("Tài khoản của bạn đã bị khóa!");
          return false;
        }

        // Đăng nhập hợp lệ
        this.user = user;

        if (remember) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          sessionStorage.removeItem("currentUser");
        } else {
          sessionStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.removeItem("currentUser");
        }

        toast.success("Đăng nhập thành công!", { autoClose: 2000 });
        return true;
      } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        alert("Không thể kết nối tới máy chủ!");
        return false;
      }
    },

    // Đăng xuất
    logout() {
      this.user = null;
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");

      toast.success("Đăng xuất thành công!", { autoClose: 1000 });

      setTimeout(() => {
        router.push({ name: "Home" });
      }, 1200);
    },

    // Chặn truy cập nếu chưa đăng nhập
    requireLogin(redirectPath = "/") {
      if (!this.user) {
        router.push({ name: "Login", query: { redirect: redirectPath } });
        return false;
      }
      return true;
    },

    // Khóa / Mở khóa tài khoản (admin)
    async toggleAccountStatus(userId) {
      try {
        const res = await fetch(`http://localhost:3000/accounts/${userId}`);
        if (!res.ok) throw new Error("Không tìm thấy tài khoản");
        const user = await res.json();
        const newStatus = user.status === "active" ? "locked" : "active";

        await fetch(`http://localhost:3000/accounts/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        alert(
          `Tài khoản ${user.username} đã được ${
            newStatus === "locked" ? "khóa" : "mở khóa"
          }!`
        );
      } catch (error) {
        alert("Lỗi khi cập nhật trạng thái tài khoản!");
      }
    },

    // Hàm tạo ID tài khoản mới dạng TK0, TK1, TK2,...
    generateNextUserId(accounts) {
      if (!Array.isArray(accounts) || accounts.length === 0) return "TK0";

      let maxNum = -1;
      for (const acc of accounts) {
        if (!acc.id) continue;
        const match = acc.id.match(/^TK(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
      return `TK${maxNum + 1}`;
    },

    // Thêm tài khoản mới
    async addAccount(newUserData) {
      try {
        // Lấy danh sách tài khoản hiện có
        const res = await fetch("http://localhost:3000/accounts");
        if (!res.ok) throw new Error("Không thể tải danh sách tài khoản");
        const accounts = await res.json();

        // Tạo ID mới dùng hàm generateNextUserId
        const newId = this.generateNextUserId(accounts);

        const newUser = {
          id: newId,
          ...newUserData,
          status: "active", // mặc định tài khoản mới active
        };

        // Gửi dữ liệu lên server
        const resAdd = await fetch("http://localhost:3000/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (!resAdd.ok) throw new Error("Lỗi khi thêm tài khoản");

        return await resAdd.json();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
    role: (state) => state.user?.role || "guest",
    isAdmin: (state) => state.user?.role === "admin",
    isUser: (state) => state.user?.role === "user",
  },
});
