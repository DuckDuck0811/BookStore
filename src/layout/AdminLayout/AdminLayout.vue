<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar bg-light" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-content p-3">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 v-if="!isCollapsed" class="mb-0">Admin</h5>
          <button class="btn btn-sm btn-outline-secondary" @click="toggleSidebar">
            ☰
          </button>
        </div>

        <!-- MENU -->
        <ul class="nav flex-column">
          <!-- Dashboard -->
          <li class="nav-item">
            <router-link to="/admin/dashboard" class="nav-link">
              📊 <span v-if="!isCollapsed">Dashboard</span>
            </router-link>
          </li>

          <!-- Product -->
          <li class="nav-item">
            <router-link to="/admin/product" class="nav-link">
              📦 <span v-if="!isCollapsed">Product</span>
            </router-link>
          </li>

          <!-- Order -->
          <li class="nav-item">
            <router-link to="/admin/order" class="nav-link">
              🧾 <span v-if="!isCollapsed">Order</span>
            </router-link>
          </li>

          <!-- Chart -->
          <li class="nav-item">
            <div class="nav-link chart-toggle" @click="toggleChart">
              📈 <span v-if="!isCollapsed">Chart</span>
              <span v-if="!isCollapsed" class="ms-auto">
                {{ isChartOpen ? "▲" : "▼" }}
              </span>
            </div>

            <ul v-if="isChartOpen && !isCollapsed" class="submenu">
              <li>
                <router-link to="/admin/revenue" class="nav-link sub-link">
                  Total revenue
                </router-link>
              </li>
              <li>
                <router-link to="/admin/bestseller" class="nav-link sub-link">
                  Best seller
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Category -->
          <li class="nav-item">
            <router-link to="/admin/category" class="nav-link">
              🗂️ <span v-if="!isCollapsed">Category</span>
            </router-link>
          </li>

          <!-- Account -->
          <li class="nav-item">
            <router-link to="/admin/account-users" class="nav-link">
              👤 <span v-if="!isCollapsed">Account users</span>
            </router-link>
          </li>
        </ul>

        <!-- Logout Button at Bottom -->
        <div class="logout-section" v-if="!isCollapsed">
          <button class="btn btn-outline-danger w-100" @click="handleLogout">
            🚪 Đăng xuất
          </button>
        </div>
        <div class="logout-section text-center" v-else>
          <button class="btn btn-outline-danger btn-sm" @click="handleLogout">🚪</button>
        </div>
      </div>
    </aside>

    <!-- CONTENT -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/Authstore";

const router = useRouter();
const auth = useAuthStore();

const isChartOpen = ref(false);
const isCollapsed = ref(false);

const toggleChart = () => {
  isChartOpen.value = !isChartOpen.value;
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleLogout = () => {
  if (confirm("Bạn có chắc muốn đăng xuất không?")) {
    auth.logout();
    router.push("/login");
  }
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  min-height: 100vh;
  height: 100%;
  transition: width 0.3s ease;
  border-right: 1px solid #ddd;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sidebar-content .nav {
  flex: 1;
}

.logout-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  padding: 20px;
  overflow-y: auto;
  height: 100vh;
  transition: margin-left 0.3s ease;
}

.sidebar.collapsed ~ .main-content {
  margin-left: 70px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  border-radius: 6px;
  margin-bottom: 4px;
  padding: 10px 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link.router-link-active {
  background-color: #0d6efd;
  color: #fff;
}

.nav-link:hover {
  background-color: #e9ecef;
}

.nav-link.router-link-active:hover {
  background-color: #0b5ed7;
}

.chart-toggle {
  cursor: pointer;
  user-select: none;
}

.submenu {
  list-style: none;
  padding-left: 20px;
  margin: 0;
}

.sub-link {
  font-size: 14px;
  padding: 8px 12px;
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
