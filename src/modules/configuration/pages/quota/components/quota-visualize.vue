<template>
  <div class="quota-visualize">
    <h3 class="quota-visualize-title">{{ $t('QUOTA.QUOTA_VISUALIZE') }}</h3>
    <div class="card-informations">
      <quota-doughnut-chart :items="quotas"></quota-doughnut-chart>
      <div class="quota-detail">
        <div class="quota-information-block">
          <div v-for="(quota, index) in quotas" :key="index + '_quota-visualize'">
            <div class="quota-information">
              <div class="quota-point" :style="{ backgroundColor: quota.color }"></div>
              <span class="quota-title"> {{ quota.name }}</span>
            </div>
            <p class="quota-number" :style="{ color: quota.color }">
              {{ displayUnit(byteTo, quota.value, undefined) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import QuotaDoughnutChart from './quota-doughnut-chart.vue';
import { byteTo, displayUnit } from '@/core/utils/unitStorage';

interface Props {
  usedSpace?: number;
  remainingQuota?: number;
  unallocatedSpace?: number;
  items?: { name: string; value: number; color: string }[];
}

const props = defineProps<Props>();

const { t } = useI18n();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);

const quotas = computed(() => {
  const items = [];
  if (props.usedSpace) {
    items.push({
      name:
        currentDomain.value.type === 'ROOTDOMAIN'
          ? t('QUOTA.ROOT_DOMAIN_QUOTA.CURRENT_DOMAIN_USED_SPACE')
          : t('QUOTA.TOP_DOMAIN_QUOTA.CURRENT_DOMAIN_USED_SPACE'),
      value: props.usedSpace,
      color: generateColor(1),
    });
  }
  if (props.remainingQuota) {
    items.push({
      name:
        (props.remainingQuota && currentDomain.value.type !== 'GUESTDOMAIN') || currentDomain.value.type !== 'SUBDOMAIN'
          ? t('QUOTA.ROOT_DOMAIN_QUOTA.SUB_DOMAIN_USED_SPACE')
          : t('QUOTA.GUEST_DOMAIN_QUOTA.REMAINING_SPACE'),
      value: props.remainingQuota,
      color: generateColor(2),
    });
  }
  if (props.unallocatedSpace) {
    items.push({
      name:
        (props.unallocatedSpace && currentDomain.value.type !== 'GUESTDOMAIN') ||
        currentDomain.value.type !== 'SUBDOMAIN'
          ? t('QUOTA.ROOT_DOMAIN_QUOTA.REMAINING_SPACE')
          : t('QUOTA.GUEST_DOMAIN_QUOTA.UNALLOCATED_SPACE'),
      value: props.unallocatedSpace,
      color: generateColor(3),
    });
  }
  return items;
});

// methods
function generateColor(index = 0) {
  const defaultColors = ['#007AFF', '#FFA940', '#EA3C3C', '#30CD60'];
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return index > defaultColors.length ? color : defaultColors[index - 1];
}
</script>
<style lang="less">
.quota-visualize {
  margin-top: 10px;
  background: #f7f7fa;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.quota-visualize-title {
  color: #434657;
}

.card-informations {
  display: flex;
  align-items: center;
}

.quota-information {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.quota-point {
  border-radius: 50%;
  max-width: 8px;
  max-height: 8px;
  min-width: 8px;
  min-height: 8px;
  width: 8px;
  height: 8px;
  margin-right: 5px;
}

.quota-title {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
}

.quota-number {
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  margin-left: 15px;
}

.quota-detail {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}
</style>
