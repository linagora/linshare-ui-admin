<script lang="ts" setup>
import { onMounted, reactive, ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { listUsers } from '@/modules/user/services/user-api';
import { listDomainsR2 } from '@/modules/domain/services/domain-api';
import { useDomainStore } from '@/modules/domain/store';
import { listSharedSpaces } from '@/modules/shared-spaces/services/shared-space-api';
import { useReportingStore } from '../store';
import { getGenericStatistics } from '../services/statistic-api';
import UserIcon from '@/core/components/icons/user-icon.vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
import BuildingIcon from '@/core/components/icons/building-icon.vue';
import UserAddIcon from '@/core/components/icons/user-add-icon.vue';

interface SummaryStatistic {
  domainCount: number;
  sharedSpaceCount: number;
  userCount: number;
  newUserCount: number;
}

const { currentDomain } = storeToRefs(useDomainStore());
const { domains, beginDate, endDate } = storeToRefs(useReportingStore());
const loading = ref(true);
const statistic = reactive<SummaryStatistic>({
  domainCount: 0,
  userCount: 0,
  newUserCount: 0,
  sharedSpaceCount: 0,
});

async function getStaticStatistics() {
  loading.value = true;

  const { total: domainCount } = await listDomainsR2({ params: { size: 0 } });
  const { total: sharedSpaceCount } = await listSharedSpaces({ size: 0 });
  const { total: userCount } = await listUsers({ size: 0 });

  statistic.domainCount = domainCount;
  statistic.userCount = userCount;
  statistic.sharedSpaceCount = sharedSpaceCount;
  loading.value = false;
}

async function getDynamicStatistic() {
  statistic.newUserCount = 0;
  loading.value = true;

  if (!domains.value.length) {
    await getNewUserCount();
  } else {
    for (let index = 0; index < domains.value.length; index++) {
      await getNewUserCount(domains.value[index].uuid);
    }
  }

  loading.value = false;
}

async function getNewUserCount(domainUuid?: string) {
  const res = await getGenericStatistics(domainUuid || currentDomain.value.uuid, {
    includeNestedDomains: domains.value.length === 0,
    beginDate: beginDate.value?.format('YYYY-MM-DD'),
    endDate: endDate.value?.format('YYYY-MM-DD'),
    resourceType: ['USER', 'GUEST'],
    action: 'CREATE',
    sum: true,
    sumBy: ['action', 'resourceType'],
  });

  res.data.forEach((stat) => (statistic.newUserCount += stat.value));
}

onMounted(getStaticStatistics);
watchEffect(getDynamicStatistic);
</script>

<template>
  <div v-if="loading" class="spinner-ctn">
    <a-spin></a-spin>
  </div>
  <div v-else class="summary-statistics">
    <div class="box">
      <div class="icon">
        <globe-icon width="16" height="16"></globe-icon>
      </div>
      <div class="statistic">
        <span class="value">{{ statistic.domainCount }}</span>
        <span class="title">{{ $t('REPORTING.SUMMARY.DOMAIN_COUNT') }}</span>
      </div>
    </div>
    <div class="box">
      <div class="icon">
        <building-icon></building-icon>
      </div>
      <div class="statistic">
        <span class="value">{{ statistic.sharedSpaceCount }}</span>
        <span class="title">{{ $t('REPORTING.SUMMARY.SHARED_SPACE_COUNT') }}</span>
      </div>
    </div>
    <div class="box">
      <div class="icon">
        <user-icon></user-icon>
      </div>
      <div class="statistic">
        <span class="value">{{ statistic.userCount }}</span>
        <span class="title">{{ $t('REPORTING.SUMMARY.USER_COUNT') }}</span>
      </div>
    </div>
    <div class="box">
      <div class="icon">
        <user-add-icon></user-add-icon>
      </div>
      <div class="statistic">
        <span class="value">{{ statistic.newUserCount }}</span>
        <span class="title">{{ $t('REPORTING.SUMMARY.NEW_USER_COUNT') }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.spinner-ctn {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.summary-statistics {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.box {
  background-color: #f7f7fa;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  padding: 16px;

  .icon {
    background: linear-gradient(269.41deg, @primary-3 -9.38%, @primary-color 100.64%);
    width: 36px;
    height: 36px;
    border-radius: 100%;
    color: @white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }

  .statistic {
    display: flex;
    flex-direction: column;

    .value {
      font-weight: 700;
      font-size: 20px;
    }

    .title {
      color: @text-color-secondary;
    }
  }
}

.box:first-child {
  margin-right: 6px;
}

.box:last-child {
  margin-left: 6px;
}

.box:not(:first-child):not(:last-child) {
  margin: 0 6px;
}
</style>
