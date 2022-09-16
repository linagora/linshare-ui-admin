<script lang="ts" setup>
import { computed } from 'vue';
import { useMimeType } from '../hooks/useMimeType';
import MimeTypeStatistic from './mime-type-statistic.vue';

const { loading, statisticByMimeType, totalUploadedSize } = useMimeType();
const mostUploadedMimeType = computed<string[]>(() =>
  Object.keys(statisticByMimeType.value)
    .sort((a, b) => {
      return statisticByMimeType.value[b].totalSize - statisticByMimeType.value[a].totalSize;
    })
    .slice(0, 5)
);
</script>

<template>
  <div>
    <mime-type-statistic
      v-for="mimeType in mostUploadedMimeType"
      :key="mimeType"
      :mime-type="mimeType"
      :statistic="statisticByMimeType[mimeType]"
      :percent="(statisticByMimeType[mimeType].totalSize / totalUploadedSize) * 100"
    />
  </div>
</template>
