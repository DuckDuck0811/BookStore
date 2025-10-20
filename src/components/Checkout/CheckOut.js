import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  // Giỏ hàng với các sản phẩm đã chọn
  state: () => ({
    items: [],
  }),
  // Tính tổng tiền của các sản phẩm trong giỏ hàng
  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
  // Xóa giỏ hàng và gửi đơn hàng
  actions: {
    clearCart() {
      this.items = [];
    },
    async postOrder(customerInfo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            orderId: Date.now(),
            customer: customerInfo,
            items: this.items,
            total: this.totalPrice,
            status:"Đang xử lý"
          });
        }, 1000);
      });
    },
  },
});
