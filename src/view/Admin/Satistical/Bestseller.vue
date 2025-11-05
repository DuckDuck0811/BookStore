<template>
  <div class="card p-4 shadow-sm">
    <h4 class="mb-3">Biểu đồ doanh thu theo tháng</h4>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart } from "chart.js/auto";
import axios from "axios";

const chartCanvas = ref(null);
let chartInstance = null;

// Hàm tính tổng doanh thu theo tháng
const calculateMonthlyRevenue = (orders) => {
  const revenueByMonth = Array(12).fill(0);

  orders.forEach((order) => {
    if (order.date && order.total) {
      const month = new Date(order.date).getMonth(); // tháng (0–11)
      revenueByMonth[month] += order.total;
    }
  });

  return revenueByMonth;
};

const fetchRevenueData = async () => {
    const response = await axios.get("http://localhost:3000/orders");
    const orders = response.data;
    const revenues = calculateMonthlyRevenue(orders);
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    renderChart(months, revenues);
};

const renderChart = (months, revenues) => {
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chartCanvas.value, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: revenues,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Doanh thu theo tháng trong năm",
          font: { size: 16 },
        },
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "VND" },
        },
        x: {
          title: { display: true, text: "Tháng" },
        },
      },
    },
  });
};

onMounted(fetchRevenueData);
</script>

<style scoped>
.card {
  border-radius: 16px;
}
</style>
