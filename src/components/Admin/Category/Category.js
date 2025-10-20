import { defineStore } from "pinia";

export const useCategoryStore = defineStore("categories", {
  state: () => ({
    categories: JSON.parse(localStorage.getItem("categories") || "[]"),
  }),

  actions: {
    loadDefaultCategories() {
      if (this.categories.length === 0) {
        this.categories = [
          {
            id: 1,
            name: "Science fiction",
            description: "Sách về khoa học và công nghệ tương lai.",
          },
          {
            id: 2,
            name: "Comic",
            description: "Truyện tranh và truyện minh họa.",
          },
          {
            id: 3,
            name: "Detective",
            description: "Truyện trinh thám, điều tra.",
          },
          { id: 4, name: "Romance", description: "Truyện tình cảm, lãng mạn." },
          {
            id: 5,
            name: "History",
            description: "Sách về lịch sử và nhân vật lịch sử.",
          },
        ];
        localStorage.setItem("categories", JSON.stringify(this.categories));
      }
    },

    addCategory(category) {
      this.categories.push(category);
      localStorage.setItem("categories", JSON.stringify(this.categories));
    },

    updateCategory(id, updated) {
      const index = this.categories.findIndex((c) => c.id === id);
      if (index !== -1) {
        this.categories[index] = { ...this.categories[index], ...updated };
        localStorage.setItem("categories", JSON.stringify(this.categories));
      }
    },

    deleteCategory(id) {
      this.categories = this.categories.filter((c) => c.id !== id);
      localStorage.setItem("categories", JSON.stringify(this.categories));
    },
  },
});
