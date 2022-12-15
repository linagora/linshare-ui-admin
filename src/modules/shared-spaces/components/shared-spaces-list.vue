<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import { useDomainStore } from '@/modules/domain/store';
import useSharedSpacesList from '@/modules/shared-spaces/hooks/useSharedSpacesList';
import { SHARED_SPACE_TYPE } from '../types/SharedSpace';
import WorkgroupIcon from './workgroup-icon.vue';
import WorkspaceIcon from './workspace-icon.vue';

const { t } = useI18n();
const { loading, list, handleTableChange } = useSharedSpacesList();
const domainStore = useDomainStore();
const { getDomainsList: domainsList } = storeToRefs(domainStore);

function getDomainFromUuid(uuid: string) {
  return domainsList.value.find((domain) => domain.uuid === uuid);
}

const columns = computed(() => [
  {
    dataIndex: 'name',
    key: 'name',
    title: t('SHARED_SPACES.MANAGE_SHARED_SPACES.COLUMNS.SHARED_SPACE'),
  },
  {
    align: 'center',
    dataIndex: 'domainUuid',
    key: 'domain',
    title: t('GENERAL.DOMAIN'),
  },
  {
    align: 'center',
    dataIndex: 'nodeType',
    key: 'nodeType',
    title: t('SHARED_SPACES.MANAGE_SHARED_SPACES.COLUMNS.TYPE'),
    width: 200,
  },
  {
    dataIndex: 'modificationDate',
    key: 'modificationDate',
    title: t('GENERAL.UPDATE_TIME_RELATIVE'),
    width: 200,
  },
  {
    dataIndex: 'creationDate',
    key: 'creationDate',
    title: t('GENERAL.CREATE_AT'),
    width: 200,
  },
]);

onMounted(handleTableChange);
</script>

<template>
  <a-table :columns="columns" :data-source="list" :loading="loading" :pagination="false" row-key="uuid">
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'name'">
        <router-link :to="{ name: 'SharedSpaceDetails', params: { id: record.uuid } }">
          <div class="shared-space">
            <div class="icon">
              <WorkgroupIcon v-if="record.nodeType === SHARED_SPACE_TYPE.WORKGROUP" />
              <WorkspaceIcon v-else />
            </div>
            <div class="info">
              <span class="name">{{ record.name }}</span>
              <span v-if="record.parentName" class="parent">@{{ record.parentName }}</span>
            </div>
          </div>
        </router-link>
      </template>

      <template v-else-if="column.key === 'nodeType'">
        <a-tag class="node-type">
          {{ $t(`SHARED_SPACES.NODE_TYPE.${text}`) }}
        </a-tag>
      </template>

      <template v-if="column.key === 'domain'">
        <router-link :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: text } }">
          <span class="item__domain">{{ getDomainFromUuid(text)?.name }}</span>
        </router-link>
      </template>

      <template v-if="column.key === 'modificationDate'">
        <span :title="$d(text, 'mediumDate')">{{ useRelativeTime(text)?.value }}</span>
      </template>

      <template v-if="column.key === 'creationDate'">
        <span>{{ $d(text, 'mediumDate') }}</span>
      </template>
    </template>
  </a-table>
</template>

<style lang="less" scoped>
a:hover .shared-space .info .name {
  text-decoration: underline;
}

.shared-space {
  display: flex;
  flex-direction: row;

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 600px;
    margin-left: 5px;
    font-size: 16px;
    font-weight: 600;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: @text-color;
    }
    .parent {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: @primary-color;
    }
  }
}

:deep(.ant-tag).node-type {
  border: 0px;
  background: @primary-1;
  color: @primary-color;
  text-transform: uppercase;
}
</style>
