<script lang="ts" setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { useI18n } from 'vue-i18n';
import { useStorageConsumption } from '../hooks/useStorageConsumption';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from 'chart.js';
import { getSizeInUnit } from '@/core/utils/unitStorage';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement
);

const { t } = useI18n();
const { dataByTime, dataType } = useStorageConsumption();
const label = computed(() =>
  dataType.value.endsWith('WEEKLY_STAT')
    ? Object.keys(dataByTime.value).map((week) => t('REPORTING.CHART_TIME_AXIS.WEEK', { number: week }))
    : Object.keys(dataByTime.value)
);
const datasets = computed(() => Object.values(dataByTime.value));
const chartData = computed(() => ({
  datasets: [
    {
      type: 'line',
      label: t('REPORTING.CHART_FIELD.BALANCE'),
      backgroundColor: '#FFE040',
      borderColor: '#FFE040',
      data: datasets.value.map((data) => getSizeInUnit(data.diffOperationSum, 'MB')),
    },
    {
      type: 'bar',
      label: t('REPORTING.CHART_FIELD.DELETE'),
      barThickness: 10,
      borderRadius: {
        bottomLeft: 5,
        bottomRight: 5,
      },
      backgroundColor: '#00C6FB',
      data: datasets.value.map((data) => getSizeInUnit(data.sumOfDeletedFiles, 'MB')),
    },
    {
      type: 'bar',
      label: t('REPORTING.CHART_FIELD.UPLOAD'),
      barThickness: 10,
      borderRadius: {
        topLeft: 5,
        topRight: 5,
      },
      backgroundColor: '#007AFF',
      data: datasets.value.map((data) => getSizeInUnit(data.sumOfAddedFiles, 'MB')),
    },
  ],
  labels: label.value,
}));
</script>

<template>
  <bar
    :chart-data="chartData"
    :chart-options="{
      scales: {
        y: {
          offset: true,
          ticks: {
            callback(value) {
              return `${value} MB`;
            },
          },
        },
        x: { stacked: true },
      },
    }"
  />
</template>
