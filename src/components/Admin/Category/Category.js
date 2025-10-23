import { defineStore } from "pinia";
import axios from "axios";

const API_URL = "https://68f86340deff18f212b5f740.mockapi.io/category"; // ⚠ đổi sang đúng endpoint

export const useCategoryStore = defineStore("categoryStore", {
  state: () => ({
    categories: [],
    loading: false,
  }),

  actions: {
    async fetchCategories() {
      const res = await axios.get(API_URL);
      this.categories = res.data;
    },

    async addCategory(data) {
      const res = await axios.post(API_URL, data);
      this.categories.push(res.data);
    },

    async updateCategory(id, updatedData) {
      try {
        const strId = String(id); 
        const res = await axios.put(`${API_URL}/${strId}`, updatedData);
        const i = this.categories.findIndex((c) => String(c.id) === strId);
        if (i !== -1) this.categories[i] = res.data;
        alert("Cập nhật danh mục thành công!");
      } catch (err) {
        console.error("Lỗi khi cập nhật danh mục:", err);
      }
    },

    async deleteCategory(id) {
      await axios.delete(`${API_URL}/${String(id)}`);
      this.categories = this.categories.filter(
        (c) => String(c.id) !== String(id)
      );
    },
  },
});
