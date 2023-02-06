<template>
  <div class="chart">
    <doughnut :chart-options="chartOptions" :chart-data="chartData" :width="200" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, SubTitle } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, SubTitle);

interface Props {
  items: { name: string; value: number; color: string }[];
}

// props & emits
const props = defineProps<Props>();

const cache = new Map();
let width: any = null;
let height: any = null;

// computed
const quotaData = computed(() => {
  return generateQuotaData();
});

const chartData = computed(() => ({
  datasets: [
    {
      data: quotaData.value,
      backgroundColor: function (context: any) {
        let c = props.items[context.dataIndex]?.color;
        if (!c) {
          return;
        }

        const mid = c;
        const start = c;
        const end = 'rgb(250, 250, 250)';
        return createRadialGradient3(context, start, mid, end);
      },
      hoverOffset: 4,
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let value = context.raw;
            let sum = 0;
            let dataArr = context.chart.data.datasets[0].data;
            dataArr.map((data: any) => {
              if (data !== undefined) {
                sum += Number(data);
              }
            });

            let percentage = ((value * 100) / sum).toFixed(2) + ' %';
            return ' ' + percentage;
          },
        },
      },
    },
  ],
}));

const chartOptions = computed(() => ({
  maintainAspectRatio: true,
  cutout: '60%',
  radius: 70,
  responsive: true,
}));

// methods

function createRadialGradient3(context: any, c1: string, c2: string, c3: string) {
  const chartArea = context.chart.chartArea;
  if (!chartArea) {
    return;
  }

  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (width !== chartWidth || height !== chartHeight) {
    cache.clear();
  }
  let gradient = cache.get(c1 + c2 + c3);
  if (!gradient) {
    width = chartWidth;
    height = chartHeight;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const r = Math.min((chartArea.right - chartArea.left) / 2, (chartArea.bottom - chartArea.top) / 2);
    const ctx = context.chart.ctx;
    gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
    gradient.addColorStop(0.5, c1);
    gradient.addColorStop(0.5, c2);
    gradient.addColorStop(1, c3);
    cache.set(c1 + c2 + c3, gradient);
  }

  return gradient;
}

function generateQuotaData() {
  return props.items.map((item) => {
    return item?.value;
  });
}
</script>

<style lang="less" scoped>
.chart {
  width: 200px;
  height: 200px;
}
</style>
