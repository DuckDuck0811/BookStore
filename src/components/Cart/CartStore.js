import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cartItems")) || [],
  }),

  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
  },

  actions: {
    saveCart() {
      localStorage.setItem("cartItems", JSON.stringify(this.items));
    },

    getNextOrderId() {
      let currentId = parseInt(localStorage.getItem("orderIdCounter")) || 0;
      currentId++;
      localStorage.setItem("orderIdCounter", currentId);
      return currentId;
    },

    addToCart(product) {
      const found = this.items.find((item) => item.id === product.id);
      if (found) {
        found.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveCart();
    },

    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
      this.saveCart();
    },

    clearItems() {
      this.items = [];
      localStorage.removeItem("cartItems");
    },

    async postOrder(customerInfo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const order = {
            orderId: this.getNextOrderId(), // dùng ID tự tăng
            customer: customerInfo,
            items: this.items,
            total: this.totalPrice,
            date: new Date().toLocaleString(),
          };

          const orders = JSON.parse(localStorage.getItem("orders")) || [];
          orders.push(order);
          localStorage.setItem("orders", JSON.stringify(orders));

          this.clearItems();
          resolve(order);
        }, 1000);
      });
    },

    resetOrderId() {
      localStorage.setItem("orderIdCounter", 0);
    },
  },
});
