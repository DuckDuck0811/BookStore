<template>
  <div class="card p-4 shadow-sm">
    <h4 class="mb-3">Biểu đồ doanh thu </h4>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart } from "chart.js/auto";

const chartCanvas = ref(null);

onMounted(() => {
  const months = [
    "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
    "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"
  ];
  const fakeRevenue = [1200000, 950000, 1800000, 2200000, 1750000, 2600000, 3100000, 2900000, 3400000, 3600000, 4000000, 4500000];

  new Chart(chartCanvas.value, {
    type: "bar", 
    data: {
      labels: months,
      datasets: [
        {
          label: "Doanh thu (nghìn VND)",
          data: fakeRevenue,
          backgroundColor: [
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 99, 132, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 99, 132, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Doanh thu theo tháng (Fake Data)",
          font: { size: 16 },
        },
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Nghìn VND" },
        },
        x: {
          title: { display: true, text: "Tháng" },
        },
      },
    },
  });
});
</script>

<style scoped>
.card {
  border-radius: 16px;
}
</style>
