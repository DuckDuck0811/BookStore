<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import DefaultLayout from "./layout/UserLayout/DefaultLayout.vue";
import AuthLayout from "./layout/UserLayout/AuthLayout.vue";
import AdminLayout from "./layout/AdminLayout/AdminLayout.vue";
import { useAuthStore } from "@/stores/Authstore";

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
