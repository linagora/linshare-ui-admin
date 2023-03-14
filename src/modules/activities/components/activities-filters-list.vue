<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import LsTag from '@/core/components/ls/ls-tag.vue';
import { TimePeriod } from '@/core/types/TimePeriod';
import { getPeriodFromDate } from '@/core/utils/date';
import { useActivities } from '@/modules/activities/hooks/use-activities';
import { ActivitiesAction, ActivitiesType, useActivitiesStore } from '@/modules/activities/store';

// composable
const { t, d } = useI18n();
const { actions, types, beginDate, endDate, actors, domains, resourceNames } = storeToRefs(useActivitiesStore());
const { fetchActivities } = useActivities();

// computed
const dateRange = computed(() => {
  const period: TimePeriod = getPeriodFromDate(beginDate.value, endDate.value);

  if (period === 'CUSTOM' && beginDate.value && endDate.value) {
    return `${d(beginDate.value.toDate(), 'shortDate')} - ${d(endDate.value.toDate(), 'shortDate')}`;
  }

  return t(`GENERAL.DATE_${period}`);
});

// methods
function removeActionFromFilter(removeItem: ActivitiesAction) {
  actions.value = actions.value.filter((item) => {
    return item !== removeItem;
  });
  fetchActivities();
}
function removeTypeFromFilter(removeItem: ActivitiesType) {
  types.value = types.value.filter((item) => {
    return item !== removeItem;
  });
  fetchActivities();
}

function removeActorFromFilter(removeItem: string) {
  actors.value = actors.value.filter((item) => {
    return item !== removeItem;
  });
  fetchActivities();
}

function removeDomainFromFilter(removeItem: string) {
  domains.value = domains.value.filter((item) => {
    return item !== removeItem;
  });
  fetchActivities();
}

function removeResourceNameFromFilter(removeItem: string) {
  resourceNames.value = resourceNames.value.filter((item) => {
    return item !== removeItem;
  });
  fetchActivities();
}
</script>

<template>
  <div class="filter-list">
    <div v-if="actions.length > 0" class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.ACTION_FILTER') }}</span>
      <ls-tag
        v-for="item in actions"
        :key="item"
        :value="$t(`ACTIVITIES.FILTERS_SELECT.ACTION.${item}`)"
        :closable="true"
        @close="removeActionFromFilter(item)"
      ></ls-tag>
    </div>
    <div v-else class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.ACTION_FILTER') }}</span>
      <ls-tag :value="$t('ACTIVITIES.FILTERS_BAR.ALL_ACTION')"></ls-tag>
    </div>

    <div v-if="types.length > 0" class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.TYPE_FILTER') }}</span>
      <ls-tag
        v-for="item in types"
        :key="item"
        :value="$t(`ACTIVITIES.FILTERS_SELECT.TYPE.${item}`)"
        :closable="true"
        @close="removeTypeFromFilter(item)"
      ></ls-tag>
    </div>
    <div v-else class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.TYPE_FILTER') }}</span>
      <ls-tag :value="$t('ACTIVITIES.FILTERS_BAR.ALL_TYPE')"></ls-tag>
    </div>

    <div v-if="domains.length > 0" class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.DOMAIN_FILTER') }}</span>
      <ls-tag
        v-for="item in domains"
        :key="item"
        :value="item"
        :closable="true"
        @close="removeDomainFromFilter(item)"
      ></ls-tag>
    </div>
    <div v-else class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.DOMAIN_FILTER') }}</span>
      <ls-tag :value="$t('ACTIVITIES.FILTERS_BAR.ALL_DOMAIN')"></ls-tag>
    </div>

    <div v-if="actors.length > 0" class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.ACTOR_FILTER') }}</span>
      <ls-tag
        v-for="item in actors"
        :key="item"
        :value="item"
        :closable="true"
        @close="removeActorFromFilter(item)"
      ></ls-tag>
    </div>
    <div v-else class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.ACTOR_FILTER') }}</span>
      <ls-tag :value="$t('ACTIVITIES.FILTERS_BAR.ALL_ACTOR')"></ls-tag>
    </div>

    <div v-if="resourceNames.length > 0" class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.RESOURCE_NAME_FILTER') }}</span>
      <ls-tag
        v-for="item in resourceNames"
        :key="item"
        :value="item"
        :closable="true"
        @close="removeResourceNameFromFilter(item)"
      ></ls-tag>
    </div>
    <div v-else class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.RESOURCE_NAME_FILTER') }}</span>
      <ls-tag :value="$t('ACTIVITIES.FILTERS_BAR.ALL_RESOURCE_NAME')"></ls-tag>
    </div>

    <div class="filter">
      <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.TIME_RANGE_FILTER') }}</span>
      <ls-tag :value="dateRange"></ls-tag>
    </div>
  </div>
</template>

<style lang="less" scoped>
.filter-list {
  display: flex;
  flex-wrap: wrap;

  .filter {
    display: flex;
    align-items: center;
    margin-top: 5px;

    &__type {
      color: #6d7885;
      margin-right: 5px;
    }
  }
}
</style>