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
  BarElement, //Các thanh biểu đồ
  CategoryScale, //Danh mục tung
  LinearScale, //Danh mục trục hoành
  Tooltip, //Hiển thi thông tin khi hover tới cột bất kỳ
  Legend,
  Title, //Hiển thị tên biểu đồ
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const chartCanvas = ref(null);
let chartInstance = null;

//Hàm lấy dữ liệu sách từu localStorage
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
// Hiển thị biểu đồ
function renderChart() {
  const { labels, data } = getProductSalesData();
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(chartCanvas.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Số lượng bán", //Số lượng bán sản phẩm
          data, //dữ liệu trong localStorage
          backgroundColor: "rgba(54, 162, 235, 0.6)", //màu sắc của cột
          borderColor: "rgba(54, 162, 235, 1)", //màu bo góc của cột
          borderWidth: 1, //chỉnh kiểu cột
        },
      ],
    },
    options: {
      responsive: true, //biểu đồ co giãn theo trang web
      plugins: {
        legend: { display: false },
        title: {
          display: true, //tiêu đề của biểu đồ
          text: "Top sản phẩm bán chạy nhất", //Nội dung
          font: { size: 10 }, //Cỡ chữ
        },
        tooltip: { enabled: true },
      },
      scales: {
        y: {
          beginAtZero: true, //trục tung bắt đầu từ 0
          title: { display: true, text: "Số lượng bán" }, //tiêu đề trục tung
        },
        x: {
          title: { display: true, text: "Tên sản phẩm" }, //tiêu đề trục hoành
          ticks: {
            maxRotation: 0, //độ xoay của tiêu đề
            font: { size: 5.75 }, //cỡ chữ
          },
        },
      },
    },
  });
}
// vẽ biểu đồ theo dữ liệu cũ
onMounted(() => {
  renderChart();
});

// vẽ biểu đồ theo dữ liệu mới
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
