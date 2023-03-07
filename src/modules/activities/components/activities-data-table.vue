<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, onMounted } from 'vue';
import { useActivities } from '@/modules/activities/hooks/use-activities';
import { ActivityLogData } from '@/modules/activities/types';
import ThePagination from '@/core/components/the-pagination.vue';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import { InfoCircleFilled } from '@ant-design/icons-vue';
// composable
const { t } = useI18n();
const { fetchActivities, loading, pagination, filteredListByPage } = useActivities();

// computed
const columns = computed(() => [
  {
    title: t('ACTIVITIES.NUMBER_COL'),
    width: '100px',
    key: 'number',
    align: 'center',
  },
  {
    title: t('ACTIVITIES.DOMAIN_NAME'),
    key: 'domainName',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.domainName?.localeCompare(b.domainName),
  },
  {
    title: t('ACTIVITIES.ACTOR'),
    key: 'actor',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.actor?.localeCompare(b.actor),
  },
  {
    title: t('ACTIVITIES.ACTION'),
    key: 'action',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.action?.localeCompare(b.action),
  },
  {
    title: t('ACTIVITIES.RESOURCE_TYPE'),
    key: 'resourceType',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.resourceType?.localeCompare(b.resourceType),
  },
  {
    title: t('ACTIVITIES.RESOURCE_NAME'),
    key: 'resourceName',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.resourceName?.localeCompare(b.resourceName),
  },
  {
    title: t('ACTIVITIES.DATE_TIME'),
    key: 'dateTime',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.dateTime - b.dateTime,
  },
  {
    title: t('ACTIVITIES.DETAIL'),
    key: 'detail',
    align: 'center',
  },
]);

// methods
function relativeDate(date: number) {
  const relativeTime = useRelativeTime(date);
  return relativeTime?.value;
}

// hooks
onMounted(() => {
  fetchActivities();
});
</script>

<template>
  <a-table
    class="activities-data-table"
    :data-source="filteredListByPage"
    :pagination="false"
    :loading="loading"
    :columns="columns"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'number'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'domainName'">
        {{ record.domainName }}
      </template>
      <template v-if="column.key === 'actor'">
        <div class="activities-data-table__actor">
          {{ record.actor }}
          <a-tooltip v-if="record.actorId !== record.authorId">
            <template #title>
              {{ $t('ACTIVITIES.THIS_ACTION_IS_PERFORMED_BY_TOOLTIP', {by: record.author, of: record.actor}) }}
            </template>
            <InfoCircleFilled class="info-icon"/>
          </a-tooltip>
        </div>
      </template>
      <template v-if="column.key === 'action'">
        {{ record.action }}
      </template>
      <template v-if="column.key === 'resourceType'">
        {{ record.resourceType }}
      </template>
      <template v-if="column.key === 'resourceName'">
        {{ record.resourceName }}
      </template>
      <template v-if="column.key === 'dateTime'">
        <a-tooltip>
          <template #title>
            {{ $d(record.dateTime, 'mediumDateTime') }}
          </template>
          {{ relativeDate(record.dateTime) }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'detail'"> </template>
    </template>
  </a-table>
  <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredListByPage.length" />
</template>

<style lang="less">
.activities-data-table {
  .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
  }
  &__actor {
    color: #007AFF;
  }
}
</style>
