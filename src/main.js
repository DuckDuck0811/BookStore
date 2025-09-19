// src/main.js

import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// thêm dòng này
import router from './components/Home/House/Router/Router.js';
const app = createApp(App);

app.use(router); 
app.mount("#app");
