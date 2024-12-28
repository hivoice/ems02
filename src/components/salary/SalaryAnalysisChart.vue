```vue
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-medium">{{ title }}</h3>
      <div class="flex items-center space-x-4">
        <!-- 期間選択 -->
        <select
          v-model="selectedPeriod"
          class="px-3 py-1 border rounded"
          @change="updateChart"
        >
          <option value="monthly">月次</option>
          <option value="quarterly">四半期</option>
          <option value="yearly">年次</option>
        </select>

        <!-- チャートタイプ選択 -->
        <select
          v-model="selectedChartType"
          class="px-3 py-1 border rounded"
          @change="updateChart"
        >
          <option value="line">折れ線グラフ</option>
          <option value="bar">棒グラフ</option>
          <option value="stacked">積み上げグラフ</option>
        </select>
      </div>
    </div>

    <!-- チャート表示エリア -->
    <div class="h-80">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <!-- 凡例 -->
    <div class="mt-4 flex flex-wrap gap-4">
      <div
        v-for="(item, index) in legendItems"
        :key="index"
        class="flex items-center"
      >
        <div
          class="w-4 h-4 rounded mr-2"
          :style="{ backgroundColor: item.color }"
        ></div>
        <span class="text-sm">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps<{
  title: string;
  data: any[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const selectedPeriod = ref('monthly');
const selectedChartType = ref('line');
let chart: Chart | null = null;

const legendItems = ref([
  { label: '基本給', color: '#4F46E5' },
  { label: '残業代', color: '#10B981' },
  { label: '手当', color: '#F59E0B' },
  { label: '控除', color: '#EF4444' }
]);

function createChart() {
  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  chart = new Chart(ctx, {
    type: selectedChartType.value as any,
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: '基本給',
          data: [300000, 300000, 300000, 320000, 320000, 320000],
          borderColor: '#4F46E5',
          backgroundColor: '#4F46E5'
        },
        {
          label: '残業代',
          data: [50000, 45000, 60000, 55000, 48000, 52000],
          borderColor: '#10B981',
          backgroundColor: '#10B981'
        },
        {
          label: '手当',
          data: [30000, 30000, 30000, 30000, 30000, 30000],
          borderColor: '#F59E0B',
          backgroundColor: '#F59E0B'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return '¥' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

function updateChart() {
  if (chart) {
    chart.destroy();
  }
  createChart();
}

watch(() => props.data, updateChart);

onMounted(() => {
  createChart();
});
</script>
```