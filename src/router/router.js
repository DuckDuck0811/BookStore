import { createRouter, createWebHistory } from "vue-router";

// ===== USER COMPONENTS =====
import House from "@/view/User/Home/House.vue";
import ProductList from "@/view/User/Product/ProductList.vue";
import DetectiveDetail from "@/view/User/MainContent/DetectiveNovels/DetectiveDetail.vue";
import Cart from "@/view/User/Cart/Cart.vue";
import Login from "@/view/Auth/Login.vue";
import Register from "@/view/Auth/Register.vue";
import CheckOut from "@/view/User/CheckOut/CheckOut.vue";
import ThankYou from "@/view/User/ThankYou/ThankYou.vue";
import NewBookDetail from "@/view/User/MainContent/NewBook/NewBookDetail.vue";
import Newbook from "@/view/User/MainContent/Newbook/Newbook.vue";
import Topbook from "@/view/User/MainContent/TopBook/Topbook.vue";
import TopbookDetail from "@/view/User/MainContent/TopBook/TopbookDetail.vue";
import { useAuthStore } from "@/stores/Authstore";

// ===== ADMIN COMPONENTS =====
import Product from "@/view/Admin/Product/Product.vue";
import Order from "@/view/Admin/Order/Order.vue";
import Bestseller from "@/view/Admin/Satistical/Bestseller.vue";
import Revenue from "@/view/Admin/Satistical/Revenue.vue";
import AdminHome from "@/view/Admin/AdminHome.vue";
import Category from "@/view/Admin/Category/Category.vue";
import AccountUsers from "@/view/Admin/AccountUsers/AccountUsers.vue";
// ===== ROUTES CONFIG =====
const routes = [
  // Default redirect
  { path: "/", redirect: "/home" },

  // Home page
  {
    path: "/home",
    name: "Home",
    component: House,
    meta: { layout: "default" },
  },

  // Product list
  {
    path: "/san-pham",
    name: "ProductList",
    component: ProductList,
    meta: { layout: "default" },
  },

  // Product detail
  {
    path: "/san-pham/:id",
    name: "DetectiveDetail",
    component: DetectiveDetail,
    meta: { layout: "default" },
  },

  // Alias cho /book/:id
  {
    path: "/book/:id",
    name: "BookDetailAlias",
    component: DetectiveDetail,
    meta: { layout: "default" },
  },

  {
    path: "/newbook",
    name: "Newbook",
    component: Newbook,
    meta: { layout: "default" },
  },
  {
    path: "/newbook/:id",
    name: "NewBookDetail",
    component: NewBookDetail,
    meta: { layout: "default" },
  },

  {
    path: "/topbook",
    name: "Topbook",
    component: Newbook,
    meta: { layout: "default" },
  },
  {
    path: "/topbook/:id",
    name: "TopBookDetail",
    component: TopbookDetail,
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

  // ===== ADMIN =====
  {
    path: "/admin/home",
    name: "AdminHome",
    component: AdminHome,
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
    path: "/admin/revenue",
    name: "Revenue",
    component: Revenue,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/bestseller",
    name: "Bestseller",
    component: Bestseller,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/category",
    name: "Category",
    component: Category,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/account-users",
    name: "AccountUsers",
    component: AccountUsers,
    meta: { requiresAdmin: true },
  },
];

// ===== CREATE ROUTER =====
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===== NAVIGATION GUARD =====
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  auth.loadUser();
  const user = auth.user;

  // Nếu trang yêu cầu đăng nhập mà chưa đăng nhập
  if (to.meta.requiresAuth && !user) {
    next({ name: "Login" });
    return;
  }

  // Nếu đã đăng nhập mà vào login/register
  if ((to.name === "Login" || to.name === "Register") && user) {
    next({ name: "Home" });
    return;
  }

  // Nếu không phải admin mà vào trang admin
  if (to.meta.requiresAdmin && user?.role !== "admin") {
    next({ name: "Home" });
    return;
  }

  // Nếu là admin mà vào trang user-only
  if (to.meta.userOnly && user?.role === "admin") {
    next({ name: "Bestseller" });
    return;
  }

  next();
});

export default router;
