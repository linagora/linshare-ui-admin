<script lang="ts" setup>
import { getReadableSize } from '@/core/utils/unitStorage';
import { HUMAN_MIME_TYPE_COLOR } from '../constants/human-mime-type-color';
import { HumanMimeType } from '../types/MimeTypeStatistic';
import HumanMimeTypeIcon from './human-mime-type-icon.vue';

defineProps<{
  mimeType: string;
  statistic: { humanMimeType: HumanMimeType; totalSize: number; totalCount: number };
  percent: number;
}>();
</script>

<template>
  <div class="file-type-statistic">
    <div class="details">
      <div class="icon">
        <human-mime-type-icon :type="statistic.humanMimeType"></human-mime-type-icon>
      </div>
      <div class="types">
        <span class="mime" :title="mimeType">{{ mimeType }}</span>
        <span class="human">{{ $t(`REPORTING.HUMAN_MIME_TYPE.${statistic.humanMimeType.toUpperCase()}`) }}</span>
      </div>
    </div>

    <div class="value">
      <div class="text">
        <span>{{ getReadableSize(statistic.totalSize).getText() }}</span>
        <span class="percentage">{{ percent.toFixed() }}%</span>
      </div>
      <div class="visual">
        <a-progress
          :percent="percent"
          :stroke-color="HUMAN_MIME_TYPE_COLOR[statistic.humanMimeType]"
          :show-info="false"
        ></a-progress>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.file-type-statistic {
  display: flex;
  margin-bottom: 24px;

  .details {
    display: flex;
    flex: 0 30%;
    flex-direction: row;
    margin-right: 10px;

    .icon {
      margin-right: 5px;
    }

    .types {
      display: flex;
      flex-direction: column;

      .mime {
        width: 175px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .human {
        color: @text-color-secondary;
      }
    }
  }

  .value {
    flex: 1;
    display: flex;
    flex-direction: column;

    .text {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
