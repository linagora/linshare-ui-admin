<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import LsTag from '@/core/components/ls/ls-tag.vue';
import { TimePeriod } from '@/core/types/TimePeriod';
import { getPeriodFromDate } from '@/core/utils/date';
import { useActivities } from '@/modules/activities/hooks/use-activities';
import { ActivitiesAction, ActivitiesType, useActivitiesStore } from '@/modules/activities/store';
import CloseCircleIcon from '@/core/components/icons/close-circle-icon.vue';

// composable
const { t, d } = useI18n();
const activitiesStore = useActivitiesStore();
const { action, type, beginDate, endDate, actor, domain, resourceName, isDefaultFilter } = storeToRefs(activitiesStore);
const { handleTableChange } = useActivities();

// computed
const dateRange = computed(() => {
  const period: TimePeriod = getPeriodFromDate(beginDate.value, endDate.value);

  if (period === 'CUSTOM' && beginDate.value && endDate.value) {
    return `${d(beginDate.value.toDate(), 'shortDate')} - ${d(endDate.value.toDate(), 'shortDate')}`;
  }

  return t(`GENERAL.DATE_${period}`);
});

const isShowFilter = computed(() => {
  return !isDefaultFilter.value;
});
// methods
function removeActionFromFilter(removeItem: ActivitiesAction) {
  action.value = action.value.filter((item) => {
    return item !== removeItem;
  });
  handleTableChange();
}
function removeTypeFromFilter(removeItem: ActivitiesType) {
  type.value = type.value.filter((item) => {
    return item !== removeItem;
  });
  handleTableChange();
}

function removeActorFromFilter(removeItem: string) {
  actor.value = actor.value.filter((item) => {
    return item !== removeItem;
  });
  handleTableChange();
}

function removeDomainFromFilter(removeItem: string) {
  domain.value = domain.value.filter((item) => {
    return item !== removeItem;
  });
  handleTableChange();
}

function removeResourceNameFromFilter(removeItem: string) {
  resourceName.value = resourceName.value.filter((item) => {
    return item !== removeItem;
  });
  handleTableChange();
}

function onClearFilter() {
  activitiesStore.$reset();
  handleTableChange();
}
</script>

<template>
  <div class="filter-list">
    <div class="list">
      <div v-if="action.length > 0" class="filter">
        <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.ACTION_FILTER') }}</span>
        <ls-tag
          v-for="item in action"
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

      <div v-if="type.length > 0" class="filter">
        <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.TYPE_FILTER') }}</span>
        <ls-tag
          v-for="item in type"
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

      <div v-if="domain.length > 0" class="filter">
        <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.DOMAIN_FILTER') }}</span>
        <ls-tag
          v-for="item in domain"
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

      <div v-if="actor.length > 0" class="filter">
        <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.ACTOR_FILTER') }}</span>
        <ls-tag
          v-for="item in actor"
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

      <div v-if="resourceName.length > 0" class="filter">
        <span class="filter__type">{{ $t('ACTIVITIES.FILTERS_BAR.RESOURCE_NAME_FILTER') }}</span>
        <ls-tag
          v-for="item in resourceName"
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
    <a-button v-if="isShowFilter" size="small" class="clear ls-button" @click="onClearFilter">
      {{ $t('GENERAL.CLEAR_FILTER') }}
      <CloseCircleIcon width="14px" height="14px" class="icon" />
    </a-button>
  </div>
</template>

<style lang="less" scoped>
.filter-list {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .filter {
    display: flex;
    align-items: center;
    margin-top: 5px;
    flex-wrap: wrap;
    gap: 5px;

    &__type {
      color: #6d7885;
    }
    .ls-tag {
      margin-right: 0;
    }
  }

  .clear {
    align-self: flex-end;
    height: 38px;
    font-size: 14px;
    opacity: 0.8;
  }
  .clear .icon {
    margin-left: 4px;
  }
}
</style>
