<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import DefaultLayout from "./components/Home/DefaultLayout.vue";
import AuthLayout from "./components/Home/House/AuthLayout.vue";
import { useAuthStore } from "@/components/LoginAndRegister/Authstore";

// chọn layout
const route = useRoute();
const layout = computed(() =>
  route.meta.layout === "auth" ? AuthLayout : DefaultLayout
);

// load user 1 lần khi app khởi động
const auth = useAuthStore();
onMounted(() => {
  auth.loadUser();
});
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
