<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import DefaultLayout from "./components/Home/DefaultLayout.vue";
import AuthLayout from "./components/Home/House/AuthLayout.vue";
const route = useRoute();

const layout = computed(() =>
  route.meta.layout === "auth" ? AuthLayout : DefaultLayout
);
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
