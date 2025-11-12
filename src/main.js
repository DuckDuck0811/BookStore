import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/router.js";

import "bootstrap/dist/css/bootstrap.min.css";
// Import bootstrap dưới dạng module để có thể sử dụng biến bootstrap
import * as bootstrap from "bootstrap/dist/js/bootstrap.esm.js";

import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Vue3Toastify, { autoClose: 67000, position: "top-right" });

// Gán bootstrap vào globalProperties để có thể dùng trong component dễ dàng
app.config.globalProperties.$bootstrap = bootstrap;

app.mount("#app");
