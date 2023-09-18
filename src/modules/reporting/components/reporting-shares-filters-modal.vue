<template>
  <a-modal
    class="filter-modal"
    :destroy-on-close="true"
    :visible="visible"
    :title="$t('REPORTING.FILTERS_MODAL.TITLE')"
    @cancel="
      reset();
      $emit('close');
    "
  >
    <template #footer>
      <div class="footer">
        <a-button class="reset" @click="reset">
          {{ $t('GENERAL.RESET') }}
        </a-button>
        <a-button class="ok" type="primary" @click="apply">
          {{ $t('GENERAL.APPLY') }}
        </a-button>
      </div>
    </template>

    <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
      <a-form-item :label="$t('GENERAL.DOMAIN')">
        <a-select
          v-model:value="filterForm.domainUuids"
          mode="multiple"
          :options="domainOptions"
          :placeholder="$t('REPORTING.FILTERS_MODAL.DOMAIN_SELECT_PLACEHOLDER')"
        ></a-select>
      </a-form-item>

      <a-form-item :label="$t('REPORTING.FILTERS_MODAL.TOP')">
        <a-select
          v-model:value="filterForm.top"
          :options="topOptions"
          :placeholder="$t('REPORTING.FILTERS_MODAL.TOP_SELECT')"
        ></a-select>
      </a-form-item>

      <a-form-item :label="$t('REPORTING.FILTERS_MODAL.TIME_RANGE')">
        <div class="time-picker">
          <a-select v-model:value="period" class="options" @change="onDateOptionChange">
            <a-select-option value="ALL_TIME">
              {{ $t('GENERAL.DATE_ALL_TIME') }}
            </a-select-option>
            <a-select-option value="LAST_DAY">
              {{ $t('GENERAL.DATE_LAST_DAY') }}
            </a-select-option>
            <a-select-option value="LAST_7_DAYS">
              {{ $t('GENERAL.DATE_LAST_7_DAYS') }}
            </a-select-option>
            <a-select-option value="LAST_30_DAYS">
              {{ $t('GENERAL.DATE_LAST_30_DAYS') }}
            </a-select-option>
            <a-select-option value="LAST_6_MONTHS">
              {{ $t('GENERAL.DATE_LAST_6_MONTHS') }}
            </a-select-option>
            <a-select-option value="LAST_YEAR">
              {{ $t('GENERAL.DATE_LAST_YEAR') }}
            </a-select-option>
            <a-select-option value="CUSTOM">
              {{ $t('GENERAL.DATE_CUSTOM') }}
            </a-select-option>
          </a-select>

          <a-range-picker
            v-model:value="filterForm.dateRange"
            :disabled="period === 'ALL_TIME' ? [true, true] : [false, false]"
            :disabled-date="disabledDate"
            class="range"
          />
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs, { Dayjs } from 'dayjs';
import { TimePeriod } from '@/core/types/TimePeriod';
import { useDomainStore } from '@/modules/domain/store';
import Domain from '@/modules/domain/types/Domain';
import { useReportingSharesStore } from '../store';
import { getDatesFromPeriod, getPeriodFromDate } from '@/core/utils/date';

withDefaults(defineProps<{ visible: boolean }>(), { visible: false });

const emits = defineEmits(['close']);
const { domains, top, beginDate, endDate } = storeToRefs(useReportingSharesStore());
const { getDomainsList: domainsList } = storeToRefs(useDomainStore());
const domainOptions = computed(() =>
  domainsList.value.map((domain) => ({
    label: domain.name,
    value: domain.uuid,
  }))
);
const topList = [10, 25, 50, 100];
const topOptions = computed(() =>
  topList.map((top) => ({
    label: top,
    value: top,
  }))
);
const period = ref<TimePeriod>(getPeriodFromDate(beginDate.value, endDate.value));
const filterForm = reactive<{
  dateRange: [Dayjs, Dayjs];
  top: number;
  domainUuids: string[];
  period?: TimePeriod;
}>({
  domainUuids: [],
  dateRange: [dayjs(beginDate.value), dayjs(endDate.value)],
  top: top.value,
});
const disabledDate = (current: Dayjs) => {
  return current && current > dayjs().endOf('day');
};

function apply() {
  const list: Domain[] = [];

  filterForm.domainUuids.forEach((uuid) => {
    const domain = domainsList.value.find((d) => d.uuid === uuid);

    if (domain) {
      list.push(domain);
    }
  });

  domains.value = list;
  top.value = filterForm.top;
  beginDate.value = period.value === 'ALL_TIME' ? null : filterForm.dateRange[0];
  endDate.value = period.value === 'ALL_TIME' ? null : filterForm.dateRange[1];
  emits('close');
}

function reset() {
  filterForm.domainUuids = domains.value.map((domain) => domain.uuid);
  filterForm.dateRange = [dayjs(beginDate.value), dayjs(endDate.value)];
  filterForm.top = top.value;
}

function onDateOptionChange(option: TimePeriod) {
  const range = getDatesFromPeriod(option);

  if (range) {
    filterForm.dateRange = range;
  }
}

watchEffect(() => {
  if (filterForm.dateRange[0] && filterForm.dateRange[1]) {
    period.value = getPeriodFromDate(filterForm.dateRange[0], filterForm.dateRange[1]);
  }
});

watchEffect(() => {
  filterForm.domainUuids = domains.value.map((domain) => domain.uuid);
});
</script>

<style lang="less">
.filter-modal {
  .ant-modal-header {
    border-radius: 16px;
    border-bottom: none;

    .ant-modal-title {
      text-align: center;
    }
  }

  .ant-modal-content {
    border-radius: 16px;
  }

  .ant-modal-footer {
    border-top: none;
    padding: 10px 24px 20px;
  }

  .time-picker {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5px;
    .options {
      flex: 1;
      flex-grow: 1;
    }

    .range {
      flex: 0 0 320px;
      flex-grow: 1;
    }
  }

  .footer {
    display: flex;

    .reset {
      flex: 1;
    }

    .ok {
      flex: 1;
    }
  }
}
</style>
