import { createRouter, createWebHistory } from "vue-router";
// User
import House from "../House.vue";
import NewBook from "../MainContent/NewBook.vue";
import ProductList from "../../ProductList/ProductList.vue";
import Cart from "@/components/Cart/Cart.vue";
import Login from "@/components/LoginAndRegister/Login.vue";
import Register from "@/components/LoginAndRegister/Register.vue";
import CheckOut from "@/components/Checkout/CheckOut.vue";
import ThankYou from "@/components/Checkout/ThankYou.vue";
import { useAuthStore } from "@/components/LoginAndRegister/Authstore";

// Admin
import Product from "@/components/Admin/Product/Product.vue";
import Order from "@/components/Admin/Order/Order.vue";
import Bestseller from "@/components/Admin/Statistical/Bestseller.vue";
import Revenue from "@/components/Admin/Statistical/Revenue.vue";
import Dashboard from "@/components/Admin/Dashboard/Dashboard.vue";

const routes = [
  // User
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
    meta: { layout: "default", requiresAuth: true, userOnly: true },
  },
  {
    path: "/checkout",
    name: "CheckOut",
    component: CheckOut,
    meta: { layout: "default", requiresAuth: true, userOnly: true },
  },
  {
    path: "/thank-you",
    name: "ThankYou",
    component: ThankYou,
    meta: { layout: "auth", requiresAuth: true, userOnly: true },
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
    path: "/admin/home",
    name: "Dashboard",
    component: Bestseller,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/product",
    name: "AdminProduct",
    component: Product,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/order",
    name: "AdminOrder",
    component: Order,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/chart",
    name: "Bestseller",
    component: Bestseller,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/revenue",
    name: "Revenue",
    component: Revenue,
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  auth.loadUser();
  const user = auth.user;

  if (to.meta.requiresAuth && !user) {
    next({ name: "Login" });
    return;
  }

  if ((to.name === "Login" || to.name === "Register") && user) {
    next({ name: "Home" });
    return;
  }

  if (to.meta.requiresAdmin && user?.role !== "admin") {
    next({ name: "Home" });
    return;
  }

  if (to.meta.userOnly && user?.role === "admin") {
    next({ name: "Dashboard" });
    return;
  }

  if (to.meta.userOnly && user?.role === "admin") {
    next({ name: "Dashboard" });
    return;
  }
  next();
});

export default router;
