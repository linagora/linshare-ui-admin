<script lang="ts" setup>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, SubTitle } from 'chart.js';
import { useMimeType } from '../hooks/useMimeType';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { HUMAN_MIME_TYPE_COLOR } from '../constants/human-mime-type-color';
import { getReadableSize } from '@/core/utils/unitStorage';
import HumanMimeTypeIcon from './human-mime-type-icon.vue';
import type { TChartData, TChartOptions } from 'vue-chartjs/dist/types';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, SubTitle);

const { t } = useI18n();
const { statisticByMimeType, totalUploadedSize } = useMimeType();
const data = computed(() => {
  const statistic: Record<string, { totalCount: number; totalSize: number }> = {};

  Object.values(statisticByMimeType.value).forEach((stat) => {
    if (!statistic[stat.humanMimeType]) {
      statistic[stat.humanMimeType] = {
        totalCount: statistic[stat.humanMimeType]?.totalCount
          ? statistic[stat.humanMimeType]?.totalCount || 0 + stat.totalCount || 0
          : stat.totalCount || 0,
        totalSize: stat.totalSize || 0,
      };
    } else {
      statistic[stat.humanMimeType].totalCount += stat.totalCount || 0;
      statistic[stat.humanMimeType].totalSize += stat.totalSize || 0;
    }
  });

  return Object.keys(statistic).map((humanMimeType) => ({
    humanMimeType,
    totalSize: statistic[humanMimeType].totalSize,
    percentage: (statistic[humanMimeType].totalSize / totalUploadedSize.value) * 100,
  }));
});

const chartData = computed<TChartData<'doughnut'>>(() => ({
  labels: data.value.map((entry) => t(`REPORTING.HUMAN_MIME_TYPE.${entry.humanMimeType.toUpperCase()}`)),
  datasets: [
    {
      backgroundColor: data.value.map((entry) => HUMAN_MIME_TYPE_COLOR[entry.humanMimeType]),
      data: data.value.map((entry) => entry.percentage),
      borderRadius: 12,
    },
  ],
}));
const chartOptions = computed<TChartOptions<'doughnut'>>(() => ({
  maintainAspectRatio: true,
  cutout: '90%',
  rotation: -90,
  circumference: 180,
  radius: 140,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: t('REPORTING.TOTAL_STORAGE.CHART_SUBTITLE'),
      position: 'bottom',
      fullSize: true,
      color: '#6D7885',
      font: {
        size: 17,
        weight: 'normal',
      },
    },
    subtitle: {
      display: true,
      fullSize: true,
      text: getReadableSize(totalUploadedSize.value).getText(),
      position: 'bottom',
      color: '#434657',
      font: {
        size: 30,
        weight: 'bold',
      },
      padding: {
        top: -120,
      },
    },
  },
}));
</script>

<template>
  <div class="total-storage">
    <div class="chart">
      <doughnut :chart-data="chartData" :chart-options="chartOptions" :width="277" />
    </div>

    <div class="details">
      <div v-for="stat in data" :key="stat.humanMimeType" class="human-mime-type-stat">
        <div class="icon">
          <human-mime-type-icon :type="stat.humanMimeType"></human-mime-type-icon>
        </div>

        <div class="statistic">
          <span class="total-size">{{ getReadableSize(stat.totalSize).getText() }}</span>
          <span class="type">{{ $t(`REPORTING.HUMAN_MIME_TYPE.${stat.humanMimeType.toUpperCase()}`) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.total-storage {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.chart {
  width: 277px;
  height: 277px;
}

.details {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
  flex-wrap: wrap;
  padding: 20px;
}
.human-mime-type-stat {
  flex: 50%;
  display: flex;
  margin-bottom: 20px;

  .statistic {
    display: flex;
    flex-direction: column;
    margin-left: 12px;

    .total-size {
      font-size: medium;
      font-weight: 700;
    }

    .type {
      color: @text-color-secondary;
    }
  }
}

@media (min-width: @screen-md-min) and (max-width: @screen-xl-min) {
  .total-storage {
    flex-direction: row;
    justify-content: space-between;
  }

  .details {
    margin-top: 0;
    margin-left: 30px;
  }
}
</style>
