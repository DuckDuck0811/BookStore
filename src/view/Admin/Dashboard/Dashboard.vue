<template>
  <div class="dashboard-wrapper">
    <!-- Loading Spinner -->
    <div
      v-if="loading"
      class="position-fixed top-50 start-50 translate-middle"
      style="z-index: 9999"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="container-fluid p-4">
      <!-- Header -->
      <div class="dashboard-header mb-4">
        <div>
          <h2 class="mb-2">Dashboard Overview</h2>
          <p class="text-muted mb-0">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <button class="btn btn-primary" @click="fetchData">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Refresh Data
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4 g-3">
        <div class="col-lg-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="icon-box bg-primary">
                  <i class="bi bi-box-seam"></i>
                </div>
                <span class="badge bg-primary-subtle text-primary">+12%</span>
              </div>
              <h3 class="mb-1">{{ products.length }}</h3>
              <p class="text-muted mb-0">Total Products</p>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="icon-box bg-success">
                  <i class="bi bi-tags"></i>
                </div>
                <span class="badge bg-success-subtle text-success">{{
                  categories.length
                }}</span>
              </div>
              <h3 class="mb-1">{{ categories.length }}</h3>
              <p class="text-muted mb-0">Categories</p>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="icon-box bg-warning">
                  <i class="bi bi-cart-check"></i>
                </div>
                <span class="badge bg-warning-subtle text-warning">Live</span>
              </div>
              <h3 class="mb-1">{{ orders.length }}</h3>
              <p class="text-muted mb-0">Total Orders</p>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="icon-box bg-danger">
                  <i class="bi bi-currency-dollar"></i>
                </div>
                <span class="badge bg-danger-subtle text-danger">+24%</span>
              </div>
              <h3 class="mb-1">{{ formatRevenue(totalRevenue) }}</h3>
              <p class="text-muted mb-0">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row mb-4 g-3">
        <!-- Category Chart -->
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header bg-white">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="mb-0">Products by Category</h5>
                  <small class="text-muted">Distribution across all categories</small>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div style="height: 300px">
                <canvas ref="barChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Book Distribution -->
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="mb-0">Book Distribution</h5>
              <small class="text-muted">By book type</small>
            </div>
            <div class="card-body">
              <div style="height: 300px">
                <canvas ref="doughnutChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders & Top Products -->
      <div class="row g-3 mb-4">
        <!-- Recent Orders -->
        <div class="col-lg-7">
          <div class="card">
            <div class="card-header bg-white">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="mb-0">Recent Orders</h5>
                  <small class="text-muted">Latest customer orders</small>
                </div>
                <a
                  href="#"
                  @click.prevent="goToPage('orders')"
                  class="btn btn-sm btn-outline-primary"
                >
                  View All
                </a>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in orders.slice(0, 6)" :key="order.id">
                      <td>
                        <strong class="text-primary">{{ order.id }}</strong>
                      </td>
                      <td>{{ order.customer?.name || "Guest" }}</td>
                      <td>{{ order.items?.length || 0 }} items</td>
                      <td>{{ calculateOrderTotal(order).toLocaleString() }}đ</td>
                      <td>
                        <span :class="['badge', getStatusClass(order.status)]">
                          {{ order.status || "Pending" }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="orders.length === 0">
                      <td colspan="5" class="text-center py-4 text-muted">
                        No orders found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="col-lg-5">
          <div class="card">
            <div class="card-header bg-white">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="mb-0">Top Selling Products</h5>
                  <small class="text-muted">Best performers this month</small>
                </div>
                <a
                  href="#"
                  @click.prevent="goToPage('products')"
                  class="btn btn-sm btn-outline-primary"
                >
                  View All
                </a>
              </div>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div
                  v-for="(item, index) in topProducts"
                  :key="index"
                  class="list-group-item px-0"
                >
                  <div class="d-flex align-items-center">
                    <div class="me-3">
                      <span
                        class="badge bg-primary rounded-circle"
                        style="
                          width: 32px;
                          height: 32px;
                          display: inline-flex;
                          align-items: center;
                          justify-content: center;
                        "
                      >
                        {{ index + 1 }}
                      </span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0">{{ item.title || item.name }}</h6>
                      <small class="text-muted">{{ item.category }}</small>
                    </div>
                    <div class="text-end">
                      <div class="fw-bold text-success">
                        {{ (item.revenue || 0).toLocaleString() }}đ
                      </div>
                      <small class="text-muted">{{ item.sales || 0 }} sold</small>
                    </div>
                  </div>
                </div>
                <div v-if="topProducts.length === 0" class="text-center py-4 text-muted">
                  No products found
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="row g-3">
        <!-- Quick Stats -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="mb-0">Quick Stats</h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div
                  class="list-group-item px-0 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <i class="bi bi-people text-primary me-2"></i>
                    Total Accounts
                  </div>
                  <span class="badge bg-primary rounded-pill">{{ accounts.length }}</span>
                </div>
                <div
                  class="list-group-item px-0 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <i class="bi bi-search text-danger me-2"></i>
                    Detective Novels
                  </div>
                  <span class="badge bg-danger rounded-pill">{{
                    detectiveNovels.length
                  }}</span>
                </div>
                <div
                  class="list-group-item px-0 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <i class="bi bi-star text-success me-2"></i>
                    New Books
                  </div>
                  <span class="badge bg-success rounded-pill">{{ newBooks.length }}</span>
                </div>
                <div
                  class="list-group-item px-0 d-flex justify-content-between align-items-center border-0 pb-0"
                >
                  <div>
                    <i class="bi bi-trophy text-warning me-2"></i>
                    Top Books
                  </div>
                  <span class="badge bg-warning rounded-pill">{{ topBooks.length }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="mb-0">Category Breakdown</h5>
            </div>
            <div class="card-body">
              <div v-for="cat in categoryBreakdown" :key="cat.name" class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span>{{ cat.name }}</span>
                  <span class="text-muted">{{ cat.percentage }}% ({{ cat.count }})</span>
                </div>
                <div class="progress" style="height: 8px">
                  <div
                    class="progress-bar"
                    :style="{ width: cat.percentage + '%', backgroundColor: cat.color }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="mb-0">Recent Activity</h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div class="list-group-item px-0 border-0">
                  <div class="d-flex">
                    <div class="me-3">
                      <span
                        class="badge bg-success rounded-circle"
                        style="width: 10px; height: 10px; display: inline-block"
                      ></span>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between mb-1">
                        <strong>New order received</strong>
                        <small class="text-muted">{{ getRecentTime() }}</small>
                      </div>
                      <small class="text-muted"
                        >Order #{{ orders[0]?.id || "001" }} from customer</small
                      >
                    </div>
                  </div>
                </div>
                <div class="list-group-item px-0 border-0">
                  <div class="d-flex">
                    <div class="me-3">
                      <span
                        class="badge bg-primary rounded-circle"
                        style="width: 10px; height: 10px; display: inline-block"
                      ></span>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between mb-1">
                        <strong>Product added</strong>
                        <small class="text-muted">2 hours ago</small>
                      </div>
                      <small class="text-muted">New item added to inventory</small>
                    </div>
                  </div>
                </div>
                <div class="list-group-item px-0 border-0">
                  <div class="d-flex">
                    <div class="me-3">
                      <span
                        class="badge bg-warning rounded-circle"
                        style="width: 10px; height: 10px; display: inline-block"
                      ></span>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between mb-1">
                        <strong>Low stock alert</strong>
                        <small class="text-muted">5 hours ago</small>
                      </div>
                      <small class="text-muted">3 products need restocking</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Chart from "chart.js/auto";

const API_BASE = "http://localhost:3000";

const emit = defineEmits(["changePage"]);

// State
const loading = ref(true);
const products = ref([]);
const categories = ref([]);
const accounts = ref([]);
const orders = ref([]);
const detectiveNovels = ref([]);
const newBooks = ref([]);
const topBooks = ref([]);

// Chart refs
const barChart = ref(null);
const doughnutChart = ref(null);
let barChartInstance = null;
let doughnutChartInstance = null;

// Fetch data
const fetchData = async () => {
  loading.value = true;
  try {
    const [
      productsRes,
      categoriesRes,
      accountsRes,
      ordersRes,
      detectiveRes,
      newBooksRes,
      topBooksRes,
    ] = await Promise.all([
      fetch(`${API_BASE}/products`).then((r) => r.json()),
      fetch(`${API_BASE}/categories`).then((r) => r.json()),
      fetch(`${API_BASE}/accounts`).then((r) => r.json()),
      fetch(`${API_BASE}/orders`).then((r) => r.json()),
      fetch(`${API_BASE}/detectiveNovels`).then((r) => r.json()),
      fetch(`${API_BASE}/newBooks`).then((r) => r.json()),
      fetch(`${API_BASE}/topbook`).then((r) => r.json()),
    ]);

    products.value = productsRes;
    categories.value = categoriesRes;
    accounts.value = accountsRes;
    orders.value = ordersRes;
    detectiveNovels.value = detectiveRes;
    newBooks.value = newBooksRes;
    topBooks.value = topBooksRes;

    setTimeout(initCharts, 100);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

// Computed
const totalRevenue = computed(() => {
  return orders.value.reduce((sum, order) => {
    return sum + calculateOrderTotal(order);
  }, 0);
});

const topProducts = computed(() => {
  const productSales = {};

  orders.value.forEach((order) => {
    if (order.items) {
      order.items.forEach((item) => {
        const productId = item.productId;
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            sales: 0,
            revenue: 0,
          };
        }
        productSales[productId].sales += item.quantity || 1;
        productSales[productId].revenue += (item.price || 0) * (item.quantity || 1);
      });
    }
  });

  return Object.values(productSales)
    .map((sale) => {
      const product = products.value.find((p) => p.id == sale.productId);
      return {
        ...product,
        sales: sale.sales,
        revenue: sale.revenue,
      };
    })
    .filter((p) => p.id)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
});

const categoryBreakdown = computed(() => {
  const colors = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6c757d"];
  const categoryCount = {};

  products.value.forEach((p) => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });

  const total = products.value.length;
  return Object.entries(categoryCount).map(([name, count], idx) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100),
    color: colors[idx % colors.length],
  }));
});

// Utils
const calculateOrderTotal = (order) => {
  if (!order.items) return 0;
  return order.items.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 1);
  }, 0);
};

const getStatusClass = (status) => {
  const classes = {
    completed: "bg-success",
    pending: "bg-warning",
    cancelled: "bg-danger",
    processing: "bg-info",
  };
  return classes[status?.toLowerCase()] || "bg-secondary";
};

const formatRevenue = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + "M";
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + "K";
  }
  return amount.toString();
};

const getRecentTime = () => {
  const minutes = Math.floor(Math.random() * 60);
  return minutes < 1 ? "Just now" : `${minutes}m ago`;
};

const goToPage = (pageName) => {
  emit("changePage", pageName);
};

// Charts
const initCharts = () => {
  if (!barChart.value || !doughnutChart.value) return;

  // Bar Chart
  if (barChartInstance) barChartInstance.destroy();

  const categoryData = {};
  products.value.forEach((p) => {
    categoryData[p.category] = (categoryData[p.category] || 0) + 1;
  });

  barChartInstance = new Chart(barChart.value, {
    type: "bar",
    data: {
      labels: Object.keys(categoryData),
      datasets: [
        {
          label: "Products",
          data: Object.values(categoryData),
          backgroundColor: "#0d6efd",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
    },
  });

  // Doughnut Chart
  if (doughnutChartInstance) doughnutChartInstance.destroy();

  doughnutChartInstance = new Chart(doughnutChart.value, {
    type: "doughnut",
    data: {
      labels: ["Detective Novels", "New Books", "Top Books"],
      datasets: [
        {
          data: [
            detectiveNovels.value.length,
            newBooks.value.length,
            topBooks.value.length,
          ],
          backgroundColor: ["#0d6efd", "#198754", "#ffc107"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
};

onMounted(fetchData);
</script>

<style scoped>
.dashboard-wrapper {
  background: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 1.25rem;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.table th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.list-group-item {
  border-left: 0;
  border-right: 0;
}

.list-group-item:first-child {
  border-top: 0;
}

.list-group-item:last-child {
  border-bottom: 0;
}
</style>
