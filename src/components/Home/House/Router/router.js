import { createRouter, createWebHistory } from "vue-router";
import House from "../House.vue";
import NewBook from "../MainContent/NewBook.vue";
import ProductList from "../../ProductList/ProductList.vue";
import Cart from "@/components/Cart/Cart.vue";
import Login from "@/components/LoginAndRegister/Login.vue";
import Register from "@/components/LoginAndRegister/Register.vue";
import CheckOut from "@/components/Checkout/CheckOut.vue";
import ThankYou from "@/components/Checkout/ThankYou.vue";
import { useAuthStore } from "@/components/LoginAndRegister/Authstore";

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "Home",
    component: House,
    meta: { layout: "default" },
  },
  {
    path: "/new-book",
    name: "NewBook",
    component: NewBook,
    meta: { layout: "default" },
  },
  {
    path: "/san-pham",
    name: "ProductList",
    component: ProductList,
    meta: { layout: "default" },
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: { layout: "default", requiresAuth: true },
  },
  {
    path: "/checkout",
    name: "CheckOut",
    component: CheckOut,
    meta: { layout: "default", requiresAuth: true }, // bắt buộc login mới checkout
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { layout: "auth" },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { layout: "auth" },
  },
  {
    path: "/thank-you",
    name: "ThankYou",
    component: ThankYou,
    meta: { layout: "auth" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  auth.loadUser();

  if (to.meta.requiresAuth && !auth.user) {
    return { name: "Login" };
  }

  if ((to.name === "Login" || to.name === "Register") && auth.user) {
    return { name: "Home" };
  }
});

export default router;
