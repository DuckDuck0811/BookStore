<template>
  <div class="card p-4 shadow-sm">
    <h4 class="mb-3">Biểu đồ doanh thu </h4>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart } from "chart.js/auto";
//gọi biểu đồ chart từ thư viện chart.js
const chartCanvas = ref(null);

onMounted(() => {
  const months = [
    "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
    "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"
  ];
  //Biến có tên dữ liệu ở trục hoành  
  const fakeRevenue = [1200000, 950000, 1800000, 2200000, 1750000, 2600000, 3100000, 2900000, 3400000, 3600000, 4000000, 4500000];
  //Biến có tên dữ liệu ở trục tung  
  new Chart(chartCanvas.value, {
    type: "bar", //kiểu dữ liệu xuất hiện trong biểu đồ 
    data: {
      labels: months,//trục hoành
      datasets: [
        {
          label: "Doanh thu (nghìn VND)",//tên dữ liệu
          data: fakeRevenue,//trục tung
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
          ],//màu của từng cột dữ liệu
          borderWidth: 1,//chỉnh kiểu cột
        },
      ],
    },
      options: {
        responsive: true,//biểu đồ co giãn theo trang web
        plugins: {
          title: {
            display: true,//tiêu đề của biểu đồ
            text: "Doanh thu theo tháng (Fake Data)",//Nội dung
            font: { size: 16 },//Cỡ chữ
          },
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,//trục tung bắt đầu từ 0
            title: { display: true, text: "Nghìn VND" },//Tiêu đề bắt đầu từ trục hoành
          },
          x: {
            title: { display: true, text: "Tháng" },//Tiêu đề trục tung
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
