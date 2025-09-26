import { createRouter, createWebHistory } from "vue-router";

import House from "../House.vue";
import NewBook from "../MainContent/NewBook.vue";
import ProductList from "../../ProductList/ProductList.vue";
import Cart from "@/components/Cart/Cart.vue";
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
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
