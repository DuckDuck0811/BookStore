<template>
  <div class="card p-4 shadow-sm" style="width: 100%">
    <h4 class="chart-title">Biểu đồ số lượng sản phẩm bán chạy</h4>
    <canvas ref="chartCanvas" style="width: 100%"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const chartCanvas = ref(null);
let chartInstance = null;

function getProductSalesData() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const salesMap = {};

  orders.forEach((order) => {
    if (!order.items || !Array.isArray(order.items)) return;

    order.items.forEach((item) => {
      if (!item || !item.title) return;
      if (!salesMap[item.title]) salesMap[item.title] = 0;
      salesMap[item.title] += item.quantity || 0;
    });
  });

  const sorted = Object.entries(salesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return {
    labels: sorted.map(([title]) => title),
    data: sorted.map(([, qty]) => qty),
  };
}

function renderChart() {
  const { labels, data } = getProductSalesData();
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(chartCanvas.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Số lượng bán",
          data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Top sản phẩm bán chạy nhất",
          font: { size: 10 },
        },
        tooltip: { enabled: true },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Số lượng bán" },
        },
        x: {
          title: { display: true, text: "Tên sản phẩm" },
          ticks: {
            maxRotation: 0,
            font: { size: 5.75 },
          },
        },
      },
    },
  });
}

onMounted(() => {
  renderChart();
});

function reloadData() {
  renderChart();
}
</script>

<style scoped>
.card {
  max-width: 1500px;
  margin: 0 auto;
  border-radius: 16px;
}

canvas {
  max-height: 900px;
  max-width: 1500px;
}

.chart-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
