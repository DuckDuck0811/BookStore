import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [], // Giỏ hàng chỉ lưu trong state
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

      const toast = useToast();
      toast.success(`${product.title} đã được thêm vào giỏ!`);
    },

    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);

      const toast = useToast();
      toast.info(`Sản phẩm đã được xóa khỏi giỏ`);
    },

    clearCart() {
      this.items = [];

      const toast = useToast();
      toast.info("Giỏ hàng đã được làm trống");
    },

    async postOrder(customerInfo) {
      const toast = useToast();

      if (!this.items.length) {
        toast.error("Giỏ hàng trống, không thể đặt hàng!");
        return { success: false, error: "Giỏ hàng trống" };
      }

      try {
        //  Lấy toàn bộ đơn hàng hiện có
        const resAll = await fetch("http://localhost:3000/orders");
        const existingOrders = await resAll.json();

        //  Lọc chỉ lấy các id là số để tránh mấy id kiểu "d390"
        const numericIds = existingOrders
          .map((o) => parseInt(o.id))
          .filter((id) => !isNaN(id));

        // Tính ID mới (bắt đầu từ 1 nếu trống)
        const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

        //  Tạo đơn hàng mới
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

        //  Gửi đơn hàng lên server
        const res = await fetch("http://localhost:3000/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrder),
        });

        if (!res.ok) throw new Error("Lỗi khi gửi đơn hàng");

        const savedOrder = await res.json();
        this.clearCart();
        toast.success("Đặt hàng thành công!");
        return { success: true, order: savedOrder };
      } catch (err) {
        console.error("Lỗi gửi đơn hàng:", err);
        toast.error("Đặt hàng thất bại!");
        return { success: false, error: err.message };
      }
    },
  },
});
