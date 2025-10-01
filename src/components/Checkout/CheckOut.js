import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
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
