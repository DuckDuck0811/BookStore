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

  // Home page
  {
    path: "/home",
    name: "Home",
    component: House,
    meta: { layout: "default" },
  },
  // New book page
  {
    path: "/new-book",
    name: "NewBook",
    component: NewBook,
    meta: { layout: "default" },
  },
  // Product list page
  {
    path: "/san-pham",
    name: "ProductList",
    component: ProductList,
    meta: { layout: "default" },
  },
  // Cart page
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: { layout: "default", requiresAuth: true, userOnly: true },
  },
  // Checkout page
  {
    path: "/checkout",
    name: "CheckOut",
    component: CheckOut,
    meta: { layout: "default", requiresAuth: true, userOnly: true },
  },
  // Thank you page
  {
    path: "/thank-you",
    name: "ThankYou",
    component: ThankYou,
    meta: { layout: "auth", requiresAuth: true, userOnly: true },
  },
  // Login page
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { layout: "auth" },
  },
  // Register page
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { layout: "auth" },
  },
  // Admin
  {
    path: "/admin/home",
    name: "Dashboard",
    component: Bestseller,
    meta: { requiresAdmin: true },
  },
  // Product admin page
  {
    path: "/admin/product",
    name: "AdminProduct",
    component: Product,
    meta: { requiresAdmin: true },
  },
  // Order admin page
  {
    path: "/admin/order",
    name: "AdminOrder",
    component: Order,
    meta: { requiresAdmin: true },
  },
  // Statistical admin page
  {
    path: "/admin/chart",
    name: "Bestseller",
    component: Bestseller,
    meta: { requiresAdmin: true },
  },
  // Revenue admin page
  {
    path: "/admin/revenue",
    name: "Revenue",
    component: Revenue,
    meta: { requiresAdmin: true },
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  auth.loadUser();
  const user = auth.user;

  //Nếu trang yêu cầu xác thực và không có người dùng, chuyển hướng đến trang đăng nhập
  if (to.meta.requiresAuth && !user) {
    next({ name: "Login" });
    return;
  }
  // Nếu người dùng đã đăng nhập và cố gắng truy cập trang đăng nhập hoặc đăng ký, chuyển hướng đến trang chủ
  if ((to.name === "Login" || to.name === "Register") && user) {
    next({ name: "Home" });
    return;
  }
  // Nếu trang yêu cầu quyền quản trị và người dùng không phải là quản trị viên, chuyển hướng đến trang chủ
  if (to.meta.requiresAdmin && user?.role !== "admin") {
    next({ name: "Home" });
    return;
  }
  // Nếu trang chỉ dành cho người dùng và người dùng là quản trị viên, chuyển hướng đến trang bảng điều khiển
  if (to.meta.userOnly && user?.role === "admin") {
    next({ name: "Dashboard" });
    return;
  }
  // Nếu trang chỉ dành cho người dùng và người dùng là quản trị viên, chuyển hướng đến trang bảng điều khiển
  if (to.meta.userOnly && user?.role === "admin") {
    next({ name: "Dashboard" });
    return;
  }
  next();
});

export default router;