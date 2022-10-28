<template>
  <div class="chart">
    <doughnut :chart-options="chartOptions" :chart-data="chartData" :width="200" />
  </div>
</template>

<script lang="ts" setup>
import { Doughnut } from 'vue-chartjs';
import { computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, SubTitle } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, SubTitle);

interface Props {
  usedSpace?: number;
  remainingQuota?: number;
  unallocatedSpace?: number;
  subQuota?: number;
}

const props = defineProps<Props>();
const quotaData: number[] = [];
for (const [key, value] of Object.entries(props)) {
  quotaData.push(value);
}

const colors = ['rgb(19, 99, 215)', 'rgb(247,222,10)', 'rgb(64,198,46)', 'rgb(255,0,120)'];

const cache = new Map();
let width: any = null;
let height: any = null;

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

const chartData = computed(() => ({
  datasets: [
    {
      data: quotaData,
      backgroundColor: function (context: any) {
        let c = colors[context.dataIndex];
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
</script>

<style lang="less" scoped>
.chart {
  width: 200px;
  height: 200px;
}
</style>
