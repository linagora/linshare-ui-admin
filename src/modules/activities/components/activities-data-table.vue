<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, onMounted, ref, watchEffect, watch } from 'vue';
import { useActivities } from '@/modules/activities/hooks/use-activities';
import { ActivityLogData } from '@/modules/activities/types';
import ThePagination from '@/core/components/the-pagination.vue';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import { InfoCircleFilled } from '@ant-design/icons-vue';
import DetailIcon from '@/core/components/icons/detail-icon.vue';
import FolderIcon from '@/core/components/icons/folder-icon.vue';
import FileIcon from '@/core/components/icons/file-icon.vue';
import ActorIcon from '@/core/components/icons/actor-icon.vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { useActivitiesStore, ActivitiesType, ACTIVITIES_TYPE } from '@/modules/activities/store';
import { getReadableSize } from '@/core/utils/unitStorage';
// composable
const { t } = useI18n();
const { loggedUser } = storeToRefs(useAuthStore());
const { fetchActivities, loading, pagination, filteredListByPage } = useActivities();
const activitiesStore = useActivitiesStore();
const { types } = storeToRefs(activitiesStore);

// data
const activeRecord = ref<ActivityLogData | null>(null);
// computed
const detailPopupContent = computed(() => {
  const isActionByMe =
    loggedUser.value?.uuid === activeRecord.value?.actor?.uuid ||
    loggedUser.value?.uuid === activeRecord.value?.authUser?.uuid;
  const translateParams = {
    resourceName: activeRecord?.value?.resourceName,
    authorName: activeRecord?.value?.actorName ?? activeRecord?.value?.authorName,
    userVarious: activeRecord?.value?.resourceName,
    dateVarious: relativeDate(activeRecord?.value?.dateTime ?? 0),
    resourceNameVarious: activeRecord?.value?.resourceName,
    resourceSize: activeRecord?.value?.resourceSize,
    resourceRecipientName: activeRecord?.value?.resourceRecipientName,
  };
  return t(
    `ACTIVITIES.DETAILS_POPUP.SENTENCES.${activeRecord.value?.type}.${activeRecord.value?.action}.${
      isActionByMe ? 'AUTHOR' : 'VIEWER'
    }.SENTENCE`,
    translateParams
  );
});

const detailPopupTitle = computed(() => {
  const isUserActivities = activeRecord.value?.type && ['AUTHENTICATION'].includes(activeRecord.value?.type);
  return isUserActivities
    ? `${activeRecord.value?.actorName}`
    : `${activeRecord.value?.resourceTypeName ?? ''} > ${activeRecord.value?.resourceName ?? ''}`;
});

const detailPopupIcon = computed(() => {
  const isUserActivities = activeRecord.value?.type && ['AUTHENTICATION'].includes(activeRecord.value?.type);
  const isWorkspaceActivities =
    activeRecord.value?.type && ['WORK_SPACE', 'WORKGROUP_FOLDER', 'WORKGROUP'].includes(activeRecord.value?.type);

  return isUserActivities ? ActorIcon : isWorkspaceActivities ? FolderIcon : FileIcon;
});
const columns = computed(() => {
  let defaultColumns = [
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
      sorter: (a: ActivityLogData, b: ActivityLogData) => a.actorName?.localeCompare(b.actorName),
    },
    {
      title: t('ACTIVITIES.ACTION'),
      key: 'action',
      sorter: (a: ActivityLogData, b: ActivityLogData) => a.actionName?.localeCompare(b.actionName),
    },
    {
      title: t('ACTIVITIES.RESOURCE_TYPE'),
      key: 'resourceType',
      sorter: (a: ActivityLogData, b: ActivityLogData) => a.resourceTypeName?.localeCompare(b.resourceTypeName),
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
      defaultSortOrder: 'descend',
    },
    {
      title: t('ACTIVITIES.DETAIL'),
      key: 'detail',
      align: 'center',
    },
  ];

  if (isFilterTypes(types.value)) {
    columnsShareType.value.map((columnsShareType) => {
      defaultColumns.splice(6, 0, columnsShareType);
    });
  }

  return defaultColumns;
});

const filtersTypes = computed(() => {
  return types.value;
});

const columnsShareType = computed(() => [
  {
    title: t('ACTIVITIES.FILE_SIZE'),
    key: 'fileSize',
    width: '150px',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.resourceSize - b.resourceSize,
    defaultSortOrder: 'descend',
  },
  {
    title: t('ACTIVITIES.RECEIVER'),
    key: 'receiver',
    width: '150px',
    sorter: (a: ActivityLogData, b: ActivityLogData) => a.resourceRecipientName?.localeCompare(b.resourceRecipientName),
  },
]);

// methods
function relativeDate(date: number) {
  const relativeTime = useRelativeTime(date);
  return relativeTime?.value;
}

function onViewDetail(record: ActivityLogData) {
  activeRecord.value = record;
}

function isFilterTypes(types: ActivitiesType) {
  return types.length > 0 && types.filter((type) => type.includes(ACTIVITIES_TYPE.SHARE_ENTRY));
}

// hooks
onMounted(() => {
  fetchActivities();
});

// watch
watch(
  () => types.value,
  (newValue: string, oldValue: string) => {
    if (newValue !== oldValue && oldValue.length > 0) {
      loading.value = true;

      columnsShareType.value.map((columnShareType) => {
        const index = columns.value.map((column) => column.key).indexOf(columnShareType.key);
        if (index !== -1) {
          columns.value.splice(index, 1);
        }
      });
      loading.value = false;
    }
  }
);
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
          {{ record.actorName }}
          <a-tooltip
            v-if="(record?.actorId && record?.actorId !== record?.authorId) || record?.authorId !== loggedUser?.uuid"
          >
            <template #title>
              {{
                $t('ACTIVITIES.THIS_ACTION_IS_PERFORMED_BY_TOOLTIP', { by: record.authorName, of: record.actorName })
              }}
            </template>
            <InfoCircleFilled class="info-icon" />
          </a-tooltip>
        </div>
      </template>
      <template v-if="column.key === 'action'">
        {{ record.actionName }}
      </template>
      <template v-if="column.key === 'resourceType'">
        {{ record.resourceTypeName }}
      </template>
      <template v-if="column.key === 'resourceName'">
        {{ record.resourceName }}
      </template>
      <template v-if="column.key === 'fileSize' && isFilterTypes(types)">
        {{ getReadableSize(record?.resourceSize).getText() }}
      </template>
      <template v-if="column.key === 'receiver' && isFilterTypes(types)">
        <div class="activities-data-table__receiver">
          {{ record?.resourceRecipientName }}
        </div>
      </template>
      <template v-if="column.key === 'dateTime'">
        <a-tooltip>
          <template #title>
            {{ $d(record.dateTime, 'mediumDateTime') }}
          </template>
          {{ relativeDate(record.dateTime) }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'detail'">
        <a-popover trigger="click" placement="bottomRight" overlay-class-name="activities-data-table__detail-modal">
          <template #title>
            <component :is="detailPopupIcon" class="icon" />
            {{ detailPopupTitle }}
          </template>
          <template #content>
            <div class="detail">
              <strong>{{ activeRecord?.actionName }}</strong
              >: {{ detailPopupContent }}
            </div>
            <div class="time">
              <span>{{ relativeDate(activeRecord?.dateTime ?? 0) }}</span>
              <span>{{ $t('ACTIVITIES.DETAILS_POPUP.BY', { user: activeRecord?.actorName }) }}</span>
            </div>
          </template>
          <a-button class="ls-detail ls-button ls-primary" @click="onViewDetail(record)">
            <detail-icon width="16px" height="16px"></detail-icon>
          </a-button>
        </a-popover>
      </template>
    </template>
  </a-table>
  <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredListByPage.length" />
</template>

<style lang="less">
.activities-data-table {
  .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow-x: auto;
  }

  &__actor,
  &__receiver {
    color: #007aff;
  }

  .ls-detail {
    width: 30px;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0 auto;
  }

  &__detail-modal {
    .ant-popover-inner {
      padding: 12px;
      gap: 16px;
      position: relative;
      width: 400px;
      height: fit-content;
      background: #ffffff;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 12px;
    }

    .ant-popover-title {
      font-weight: 600;
      font-size: 15px;
      line-height: 20px;
      display: flex;
      align-items: center;
      color: #007aff;
    }

    .detail {
      font-weight: 500;
      font-size: 15px;
      color: #434657;
      margin-bottom: 16px;
    }

    .time {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      display: flex;
      align-items: center;
      letter-spacing: -0.01em;
      color: #6d7885;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 12px;
    }

    .time span:first-child {
      border-right: 1px solid #d5d7e0;
      padding-right: 12px;
    }

    .icon {
      margin-right: 8px;
    }

    .ant-popover-title {
      padding-bottom: 16px;
    }
  }
}
</style>
