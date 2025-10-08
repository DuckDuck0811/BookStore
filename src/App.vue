<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import DefaultLayout from "./components/Home/DefaultLayout.vue";
import AuthLayout from "./components/Home/House/AuthLayout.vue";
import AdminLayout from "./components/Admin/AdminLayout/AdminLayout.vue";
import { useAuthStore } from "@/components/LoginAndRegister/Authstore";

const route = useRoute();
const auth = useAuthStore();

onMounted(() => {
  auth.loadUser();
});

const layout = computed(() => {
  if (route?.meta?.layout === "auth") return AuthLayout;
  if (route.path.startsWith("/admin") || auth.user?.role === "admin")
    return AdminLayout;
  return DefaultLayout;
});
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
