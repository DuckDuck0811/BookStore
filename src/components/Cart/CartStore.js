import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
  }),

  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    addToCart(product) {
      const found = this.items.find((item) => item.id === product.id);
      if (found) {
        found.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1, selected: true });
      }
    },

    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
    },

    clearItems() {
      this.items = [];
    },

    async postOrder(customerInfo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const order = {
            success: true,
            orderId: Date.now(),
            customer: customerInfo,
            items: this.items,
            total: this.totalPrice,
          };

          this.clearItems();
          resolve(order);
        }, 1000);
      });
    },
  },
});
