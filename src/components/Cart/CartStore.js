import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

export const useCartStore = defineStore("cart", {
  // khởi tạo các sản phẩm trong giỏ hàng
  state: () => ({
    items: JSON.parse(localStorage.getItem("cartItems")) || [],
  }),

  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    // totalPrice là tổng số tiền trong giỏ hàng
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    // totalItems là tổng số sản phẩm trong giỏ hàng
  },

  actions: {
    saveCart() {
      localStorage.setItem("cartItems", JSON.stringify(this.items));
    },
    // dùng để lưu sản phẩm vào localStorage mỗi khi thêm sửa xóa
    getNextOrderId() {
      let currentId = parseInt(localStorage.getItem("orderIdCounter")) || 0;
      currentId++;
      localStorage.setItem("orderIdCounter", currentId);
      return currentId;
    },
    //mỗi khi tạo thêm đơn hàng thì id đơn hàng sẽ tự động tăng lên 1 đơn vị
    addToCart(product) {
      const found = this.items.find((item) => item.id === product.id);
      if (found) {
        found.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveCart();
    },
    //thêm sản phẩm vào giỏ hàng
    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
      this.saveCart();
    },
    // xóa sản phẩm khỏi giỏ hàng theo id sản phẩm
    clearItems() {
      this.items = [];
      localStorage.removeItem("cartItems");
    },
    //xóa toàn bộ giỏ hàng
    async postOrder(customerInfo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const order = {
            //Tạo đơn hàng
            orderId: this.getNextOrderId(), //Id đơn hàng tăng dần
            customer: customerInfo, //thông tin khách hàng
            items: this.items, //sản phẩm trong giỏ hàng
            total: this.totalPrice, //tổng tiền
            date: new Date().toLocaleString(), //ngày đặt hàng hiện tại
          };

          const orders = JSON.parse(localStorage.getItem("orders")) || [];
          orders.push(order);
          localStorage.setItem("orders", JSON.stringify(orders)); //lưu vào dữ liệu localStorage

          this.clearItems(); //xóa hết sản phẩm trong localStorage
          resolve(order);
        }, 1000);
      });
    },
    resetOrderId() {
      localStorage.setItem("orderIdCounter", 0);
    },
    // Đơn hàng sẽ bắt đầu lại từ 0
  },
});
