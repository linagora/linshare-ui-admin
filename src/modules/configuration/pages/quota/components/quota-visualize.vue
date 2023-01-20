<template>
  <div class="quota-card">
    <h3 class="quota-card-title">{{ $t('QUOTA.QUOTA_VISUALIZE') }}</h3>
    <div class="card-informations">
      <quota-doughnut-chart
        :used-space="props.usedSpace"
        :remaining-quota="props.remainingQuota"
        :unallocated-space="props.unallocatedSpace"
      ></quota-doughnut-chart>
      <div class="quota-detail">
        <div class="quota-information-block">
          <div v-if="props.usedSpace">
            <div class="quota-information">
              <div class="quota-point" style="background: #007aff"></div>
              <span v-if="currentDomain.type === 'ROOTDOMAIN'" class="quota-title">
                {{ $t('QUOTA.ROOT_DOMAIN_QUOTA.CURRENT_DOMAIN_USED_SPACE') }}</span
              >
              <span v-else class="quota-title"> {{ $t('QUOTA.TOP_DOMAIN_QUOTA.CURRENT_DOMAIN_USED_SPACE') }}</span>
            </div>
            <p class="quota-number" style="color: #007aff">{{ niceBytes(props.usedSpace) }}</p>
          </div>
          <div v-else>
            <div class="quota-information">
              <div class="quota-point" style="background: #007aff"></div>
              <span class="quota-title"> {{ $t('QUOTA.TOP_DOMAIN_QUOTA.CURRENT_DOMAIN_USED_SPACE') }}</span>
            </div>
            <p class="quota-number" style="color: #007aff">{{ niceBytes(props.usedSpace) }}</p>
          </div>
          <div
            v-if="(props.remainingQuota && currentDomain.type !== 'GUESTDOMAIN') || currentDomain.type !== 'SUBDOMAIN'"
          >
            <div class="quota-information">
              <div class="quota-point" style="background: #ffa940"></div>
              <span class="quota-title"> {{ $t('QUOTA.ROOT_DOMAIN_QUOTA.SUB_DOMAIN_USED_SPACE') }}</span>
            </div>
            <p class="quota-number" style="color: #ffa940">{{ niceBytes(props.remainingQuota) }}</p>
          </div>
          <div v-else>
            <div class="quota-information">
              <div class="quota-point" style="background: #ffa940"></div>
              <span class="quota-title"> {{ $t('QUOTA.GUEST_DOMAIN_QUOTA.REMAINING_SPACE') }}</span>
            </div>
            <p class="quota-number" style="color: #ffa940">{{ niceBytes(props.remainingQuota) }}</p>
          </div>
          <div
            v-if="
              (props.unallocatedSpace && currentDomain.type !== 'GUESTDOMAIN') || currentDomain.type !== 'SUBDOMAIN'
            "
          >
            <div class="quota-information">
              <div class="quota-point" style="background: #40c62e"></div>
              <span class="quota-title"> {{ $t('QUOTA.ROOT_DOMAIN_QUOTA.REMAINING_SPACE') }}</span>
            </div>
            <p class="quota-number" style="color: #40c62e">{{ niceBytes(props.unallocatedSpace) }}</p>
          </div>
          <div v-else>
            <div class="quota-information">
              <div class="quota-point" style="background: #40c62e"></div>
              <span class="quota-title"> {{ $t('QUOTA.GUEST_DOMAIN_QUOTA.UNALLOCATED_SPACE') }}</span>
            </div>
            <p class="quota-number" style="color: #40c62e">{{ niceBytes(props.unallocatedSpace) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import QuotaDoughnutChart from './quota-doughnut-chart.vue';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import { useI18n } from 'vue-i18n';
import useQuota from '../hooks/useQuota';
const { niceBytes } = useQuota();

interface Props {
  usedSpace?: number;
  remainingQuota?: number;
  unallocatedSpace?: number;
}

const props = defineProps<Props>();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);
const { t } = useI18n();
</script>
<style lang="less">
.quota-card {
  margin-top: 10px;
  background: #f7f7fa;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.quota-card-title {
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
