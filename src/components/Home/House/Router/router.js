import { createRouter, createWebHistory } from "vue-router";

import House from "../House.vue";
import NewBook from "../MainContent/NewBook.vue";
import ProductList from "../../ProductList/ProductList.vue"; // đây là đường dẫn đúng

const routes = [
  {
    path: "/",
    name: "Home",
    component: House,
  },
  {
    path: "/new-book",
    name: "NewBook",
    component: NewBook,
  },
  {
    path: "/san-pham",
    name: "ProductList",
    component: ProductList, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
