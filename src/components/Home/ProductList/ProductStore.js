import { defineStore } from "pinia";
import axios from "axios";

const API_URL = "http://localhost:3000/products";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get(API_URL);
        this.products = response.data;
      } catch (error) {
        this.error = "Không thể tải dữ liệu sản phẩm!";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async addProduct(product) {
      try {
        alert("Thêm sản phẩm thành công!");
        const response = await axios.post(API_URL, product);
        this.products.push(response.data);
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
      }
    },

    async updateProduct(id, updated) {
      try {
        alert("Cập nhật sản phẩm thành công!");
        const response = await axios.put(`${API_URL}/${id}`, updated);
        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) this.products[index] = response.data;
      } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
      }
    },

    async deleteProduct(id) {
      try {
        const strId = String(id);
        await axios.delete(`${API_URL}/${strId}`);
        this.products = this.products.filter((p) => String(p.id) !== strId);
        alert("Xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    },
  },
});
