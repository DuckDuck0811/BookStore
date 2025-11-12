import { defineStore } from "pinia";
import axios from "axios";

const API_URL = "http://localhost:3000/categories";

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

    async addCategory(newCategory) {
      let maxNum = 0;
      this.categories.forEach((c) => {
        const match = c.id?.match(/^CT(\d{3})$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      });

      const nextNum = maxNum + 1;
      const newId = `CT${String(nextNum).padStart(3, "0")}`;

      const res = await axios.post(API_URL, { ...newCategory, id: newId });
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
