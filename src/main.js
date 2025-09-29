import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Toast from "vue-toastification";

import router from "./components/Home/House/Router/Router.js";
const app = createApp(App);
const pinia = createPinia();
app.use(Toast);

app.use(pinia);
app.use(router);
app.mount("#app");
