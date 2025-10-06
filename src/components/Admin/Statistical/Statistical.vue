<template>
  <div style="width: 100%; height: 600px; margin: 50px auto">
    <BarChart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: "Statistical",
  components: {
    BarChart: Bar,
  },
  data() {
    return {
      chartData: {
        labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
        datasets: [
          {
            label: "Doanh thu",
            data: [10000, 7500, 5500, 3500],
            backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "aqua"],
            // bootstrap:Bar 
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    };
  },
};
</script>
