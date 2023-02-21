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
  allocatedPersonalSpace?: number | string;
  allocatedSharedSpace?: number | string;
  unassignedSpace?: number;
  personalSpaceUsedSpace?: number | string;
  unallocatedSharedSpace?: number;
  remainingQuotaUsedSpace?: number;
  items: { name: string; value: number; color: string }[];
}

const props = defineProps<Props>();

const { t } = useI18n();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);

const quotas = computed(() => {
  return props.items;

  // if (props.allocatedPersonalSpace) {
  //   items.push({
  //     name: t('QUOTA.GUEST_DOMAIN_QUOTA.PERSONAL_ALLOCATED_SPACE'),
  //     value: props.allocatedPersonalSpace,
  //     color: generateColor(1),
  //   });
  // }

  // if (props.allocatedSharedSpace) {
  //   items.push({
  //     name: t('QUOTA.GUEST_DOMAIN_QUOTA.SHARED_SPACE_ALLOCATED'),
  //     value: props.allocatedSharedSpace,
  //     color: generateColor(2),
  //   });
  // }

  // if (props.unassignedSpace) {
  //   items.push({
  //     name: t('QUOTA.GUEST_DOMAIN_QUOTA.UNASSIGNED_SPACE'),
  //     value: props.unassignedSpace,
  //     color: generateColor(3),
  //   });
  // }

  // if (props.personalSpaceUsedSpace) {
  //   items.push({
  //     name: t('QUOTA.TOP_DOMAIN_QUOTA.USED'),
  //     value: props.personalSpaceUsedSpace,
  //     color: generateColor(1),
  //   });
  // }

  // if (props.remainingQuotaUsedSpace) {
  //   items.push({
  //     name: t('QUOTA.TOP_DOMAIN_QUOTA.REMAINING_QUOTA'),
  //     value: props.remainingQuotaUsedSpace,
  //     color: generateColor(2),
  //   });
  // }

  // if (props.unallocatedSharedSpace) {
  //   items.push({
  //     name: t('QUOTA.TOP_DOMAIN_QUOTA.QUOTA_PER_SUB_DOMAIN'),
  //     value: props.unallocatedSharedSpace,
  //     color: generateColor(3),
  //   });
  // }

  // return items;
});
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
