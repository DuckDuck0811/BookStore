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
import Product from "@/components/Admin/Product/Product.vue";
import Order from "@/components/Admin/Order/Order.vue";
import Statistical from "@/components/Admin/Statistical/Statistical.vue";

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
    meta: { layout: "default", requiresAuth: true },
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
  {
    path: "/admin/product",
    name: "AdminProduct",
    component: Product,
  },
  {
    path: "/admin/order",
    name: "AdminOrder",
    component: Order,
  },
  {
    path: "/admin/chart",
    name: "Statistical",
    component: Statistical,
  }
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
