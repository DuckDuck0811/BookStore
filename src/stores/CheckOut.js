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
      useToast().success(`${product.title} đã được thêm vào giỏ!`);
    },

    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
      useToast().info(`Sản phẩm đã được xóa khỏi giỏ`);
    },

    clearCart() {
      this.items = [];
      useToast().info("Giỏ hàng đã được làm trống");
    },

    async postOrder(customerInfo, accountId = "0") {
      if (!this.items.length) {
        useToast().error("Giỏ hàng trống, không thể đặt hàng!");
        return { success: false, error: "Giỏ hàng trống" };
      }

      try {
        // Tạo ID đơn hàng đơn giản (có thể thay bằng UUID)
        const orderId = Date.now().toString(36);

        const newOrder = {
          id: orderId,
          accountId,
          customer: {
            name: customerInfo.name,
            phone: customerInfo.phone,
            address: customerInfo.address,
          },
          items: this.items.map((i) => ({
            productId: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
          })),
          total: this.totalPrice,
          date: new Date().toISOString(),
          status: "Đang xử lý",
        };

        const res = await fetch("http://localhost:3000/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrder),
        });
        const savedOrder = await res.json();
        this.clearCart();
        useToast().success("Đặt hàng thành công!");
        return { success: true, order: savedOrder };
      } catch (err) {
        useToast().error("Đặt hàng thất bại!");
        return { success: false, error: err.message };
      }
    },
  },
});
