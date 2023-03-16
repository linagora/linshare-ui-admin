<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import dayjs, { Dayjs } from 'dayjs';
import { TimePeriod } from '@/core/types/TimePeriod';
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { getDomains } from '@/modules/domain/services/domain-api';
import { getDatesFromPeriod, getPeriodFromDate } from '@/core/utils/date';
import { useActivities } from '@/modules/activities//hooks/use-activities';

import {
  useActivitiesStore,
  ACTIVITIES_ACTION,
  ACTIVITIES_TYPE,
  ActivitiesAction,
  ActivitiesType,
} from '@/modules/activities/store';
import { useI18n } from 'vue-i18n';
import Domain from '@/modules/domain/types/Domain';

// props & emits
const emits = defineEmits(['close']);
withDefaults(defineProps<{ visible: boolean }>(), { visible: false });

// composables
const { t } = useI18n();
const { beginDate, endDate, actions, types, domains, actors, resourceNames } = storeToRefs(useActivitiesStore());
const { fetchActivities, activitiesLogsFormated } = useActivities();

// computed
const actionOptions = computed(() => {
  const actionsArr = [];
  for (let key in ACTIVITIES_ACTION) {
    actionsArr.push({
      label: t(`ACTIVITIES.FILTERS_SELECT.ACTION.${key}`),
      value: ACTIVITIES_ACTION[key as ActivitiesAction],
    });
  }
  return actionsArr;
});

const typeOptions = computed(() => {
  const typeArr = [];
  for (let key in ACTIVITIES_TYPE) {
    typeArr.push({ label: t(`ACTIVITIES.FILTERS_SELECT.TYPE.${key}`), value: ACTIVITIES_TYPE[key as ActivitiesType] });
  }
  return typeArr;
});

const domainOptions = computed(() => {
  const formatedDomains = domainList.value
    ?.map((item) => {
      return { name: item?.name, value: item?.name };
    })
    ?.filter((value, index, self) => index === self.findIndex((t) => t.name === value.name && t.value === value.value));
  return formatedDomains ? [...formatedDomains] : [];
});

const actorOptions = computed(() => {
  const actorArr = activitiesLogsFormated.value
    ?.filter((item) => {
      return !!item?.actor;
    })
    ?.map((item) => {
      return { name: item?.actor, value: item?.actor };
    });

  return actorArr.filter(
    (value, index, self) => index === self.findIndex((t) => t.name === value.name && t.value === value.value)
  );
});

const resourceNameOptions = computed(() => {
  const resourceNameArr = activitiesLogsFormated.value
    ?.filter((item) => {
      return !!item?.resourceName;
    })
    ?.map((item) => {
      return { name: item?.resourceName, value: item?.resourceName };
    });

  return resourceNameArr.filter(
    (value, index, self) => index === self.findIndex((t) => t.name === value.name && t.value === value.value)
  );
});

// data
const period = ref<TimePeriod>(getPeriodFromDate(beginDate.value, endDate.value));
const filterForm = reactive<{
  dateRange: [Dayjs, Dayjs];
  actions: ActivitiesAction[];
  types: ActivitiesType[];
  period?: TimePeriod;
  domains: string[];
  actors: string[];
  resourceNames: string[];
}>({
  actions: actions.value,
  types: types.value,
  dateRange: [dayjs(beginDate.value), dayjs(endDate.value)],
  domains: domains.value,
  actors: actors.value,
  resourceNames: resourceNames.value,
});
const disabledDate = (current: Dayjs) => {
  return current && current > dayjs().endOf('day');
};
const domainList = ref<Domain[]>();

// methods
function apply() {
  types.value = filterForm.types;
  actors.value = filterForm.actors;
  actions.value = filterForm.actions;
  domains.value = filterForm.domains;
  resourceNames.value = filterForm.resourceNames;
  beginDate.value = period.value === 'ALL_TIME' ? null : filterForm.dateRange[0];
  endDate.value = period.value === 'ALL_TIME' ? null : filterForm.dateRange[1];
  fetchActivities();
  emits('close');
}

function reset() {
  filterForm.dateRange = [dayjs(beginDate.value), dayjs(endDate.value)];
  filterForm.actions = actions.value;
  filterForm.types = types.value;
  filterForm.actors = actors.value;
  filterForm.domains = domains.value;
  filterForm.resourceNames = resourceNames.value;
}

function onDateOptionChange(option: TimePeriod) {
  const range = getDatesFromPeriod(option);

  if (range) {
    filterForm.dateRange = range;
  }
}

async function fetchDomains() {
  const response = await getDomains({ params: { tree: false } });
  domainList.value = response as Domain[];
}

// hooks
watchEffect(() => {
  if (filterForm.dateRange[0] && filterForm.dateRange[1]) {
    period.value = getPeriodFromDate(filterForm.dateRange[0], filterForm.dateRange[1]);
  }
});
watchEffect(() => {
  filterForm.actions = actions.value;
  filterForm.types = types.value;
  filterForm.resourceNames = resourceNames.value;
  filterForm.domains = domains.value;
  filterForm.actors = actors.value;
});

onMounted(async () => {
  await fetchDomains();
});
</script>
<template>
  <a-modal
    class="filter-modal"
    :destroy-on-close="true"
    :visible="visible"
    :title="$t('ACTIVITIES.FILTERS_MODAL.TITLE')"
    @cancel="
      reset();
      $emit('close');
    "
  >
    <template #footer>
      <div class="footer">
        <a-button class="reset ls-button" @click="reset">
          {{ $t('GENERAL.RESET') }}
        </a-button>
        <a-button class="ok ls-button" type="primary" @click="apply">
          {{ $t('GENERAL.APPLY') }}
        </a-button>
      </div>
    </template>

    <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
      <a-form-item class="ls-form-title" :label="$t('ACTIVITIES.FILTERS_MODAL.ACTION')">
        <a-select
          v-model:value="filterForm.actions"
          class="ls-selector"
          mode="multiple"
          :options="actionOptions"
          :placeholder="$t('ACTIVITIES.FILTERS_MODAL.ACTION_SELECT_PLACEHOLDER')"
        ></a-select>
      </a-form-item>

      <a-form-item class="ls-form-title" :label="$t('ACTIVITIES.FILTERS_MODAL.TYPE')">
        <a-select
          v-model:value="filterForm.types"
          class="ls-selector"
          mode="multiple"
          :options="typeOptions"
          :placeholder="$t('ACTIVITIES.FILTERS_MODAL.TYPE_SELECT_PLACEHOLDER')"
        ></a-select>
      </a-form-item>

      <a-form-item class="ls-form-title" :label="$t('ACTIVITIES.FILTERS_MODAL.DOMAIN')">
        <a-select
          v-model:value="filterForm.domains"
          class="ls-selector"
          mode="tags"
          :options="domainOptions"
          :placeholder="$t('ACTIVITIES.FILTERS_MODAL.DOMAIN_SELECT_PLACEHOLDER')"
        ></a-select>
      </a-form-item>

      <a-form-item class="ls-form-title" :label="$t('ACTIVITIES.FILTERS_MODAL.ACTOR')">
        <a-select
          v-model:value="filterForm.actors"
          class="ls-selector"
          mode="tags"
          :options="actorOptions"
          :placeholder="$t('ACTIVITIES.FILTERS_MODAL.ACTOR_SELECT_PLACEHOLDER')"
        ></a-select>
      </a-form-item>

      <a-form-item class="ls-form-title" :label="$t('ACTIVITIES.FILTERS_MODAL.RESOURCE_NAME')">
        <a-select
          v-model:value="filterForm.resourceNames"
          class="ls-selector"
          mode="tags"
          :options="resourceNameOptions"
          :placeholder="$t('ACTIVITIES.FILTERS_MODAL.RESOURCE_NAME_SELECT_PLACEHOLDER')"
        ></a-select>
      </a-form-item>

      <a-form-item class="ls-form-title" :label="$t('ACTIVITIES.FILTERS_MODAL.TIME_RANGE')">
        <div class="time-picker ls-timepicker">
          <a-select v-model:value="period" class="options" @change="onDateOptionChange">
            <a-select-option value="ALL_TIME">
              {{ $t('GENERAL.DATE_ALL_TIME') }}
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

<style lang="less">
.filter-modal {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 !important;
  top: 0 !important;
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
