import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [
      { id: 1, title: "Harry Potter và Hòn Đá Phù Thủy", price: 90000, quantity: 1 },
      { id: 2, title: "Harry Potter và Phòng Chứa Bí Mật", price: 95000, quantity: 2 },
    ],
  }),
  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
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
          });
        }, 1000);
      });
    },
  },
});
