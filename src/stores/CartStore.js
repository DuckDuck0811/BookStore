import { defineStore } from "pinia";
import { toast } from "vue3-toastify";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cartItems") || "[]"),
  }),

  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
  },

  actions: {
    addToCart(product) {
      const found = this.items.find((item) => item.id === product.id);
      if (found) {
        found.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      toast.success("Đã thêm sản phẩm vào giỏ hàng!", {
        autoClose: 2000,
        position: "top-right",
        pauseOnHover: false,
      });
    },

    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
      toast.info("Sản phẩm đã được xóa khỏi giỏ", {
        autoClose: 2000,
        position: "top-right",
        pauseOnHover: false,
      });
    },

    clearCart() {
      this.items = [];
      toast.info("Giỏ hàng đã được làm trống", {
        autoClose: 2000,
        position: "top-right",
        pauseOnHover: false,
      });
    },

    async postOrder(customerInfo) {
      if (!this.items.length) {
        toast.error("Giỏ hàng trống, không thể đặt hàng!", {
          position: "top-right",
          pauseOnHover: false,
        });
        return { success: false, error: "Giỏ hàng trống" };
      }

      try {
        // Lấy toàn bộ đơn hàng hiện có
        const resAll = await fetch("http://localhost:3000/orders");
        const existingOrders = await resAll.json();

        // Lấy số trong id dạng DH001 (lấy phần số, bỏ "DH")
        const numericIds = existingOrders
          .map((o) => {
            const match = o.id.match(/\d+/); // tìm phần số trong id
            return match ? parseInt(match[0], 10) : NaN;
          })
          .filter((id) => !isNaN(id));

        // Tính ID mới (bắt đầu từ 1 nếu trống)
        const maxNum = numericIds.length > 0 ? Math.max(...numericIds) : 0;
        const newId = `DH${String(maxNum + 1).padStart(3, "0")}`;

        // Tạo đơn hàng mới
        const newOrder = {
          id: newId, // ID tự tăng từ 1
          customer: customerInfo,
          items: this.items.map((i) => ({
            productId: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
          })),
          total: this.totalPrice,
          date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
          status: "Đang xử lý",
        };

        // Gửi đơn hàng lên server
        const res = await fetch("http://localhost:3000/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrder),
        });

        if (!res.ok) throw new Error("Lỗi khi gửi đơn hàng");

        const savedOrder = await res.json();
        this.clearCart();
        toast.success("Đặt hàng thành công!", {
          position: "top-right",
          pauseOnHover: false,
        });
        return { success: true, order: savedOrder };
      } catch (err) {
        console.error("Lỗi gửi đơn hàng:", err);
        toast.error("Đặt hàng thất bại!", {
          position: "top-right",
          pauseOnHover: false,
        });
        return { success: false, error: err.message };
      }
    },
  },
});
