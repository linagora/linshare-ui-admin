<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import { useDomainStore } from '@/modules/domain/store';
import useInconsistentUsers from '@/modules/inconsistent-users/hooks/useInconsistentUsers';

const { t } = useI18n();
const { fetchInconsistentUsersList, status, list } = useInconsistentUsers();
const domainStore = useDomainStore();

const columns = computed(() => [
  {
    dataIndex: 'no',
    key: 'number',
    title: t('INCONSISTENT_USERS.COLUMNS.NUMBER_COL'),
    width: 200,
  },
  {
    dataIndex: 'firstName',
    key: 'firstName',
    title: t('INCONSISTENT_USERS.COLUMNS.FIRSTNAME'),
  },
  {
    dataIndex: 'lastName',
    key: 'lastName',
    title: t('INCONSISTENT_USERS.COLUMNS.LASTNAME'),
  },
  {
    dataIndex: 'email',
    key: 'email',
    title: t('INCONSISTENT_USERS.COLUMNS.EMAIL'),
    width: 200,
  },
  {
    dataIndex: 'domain',
    key: 'domain',
    title: t('GENERAL.DOMAIN'),
    width: 200,
  },
  {
    dataIndex: 'domainId',
    key: 'domainId',
    title: t('INCONSISTENT_USERS.COLUMNS.DOMAIN_ID'),
    width: 200,
  },
]);

onMounted(fetchInconsistentUsersList);
</script>

<template>
  <a-table :columns="columns" :data-source="list" :loading="status" :pagination="false" row-key="uuid">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'number'">
        <span class="name">{{ index + 1 }}</span>
      </template>

      <template v-if="column.key === 'firstName'">
        <div class="inconsistent-users">
          <span class="name">{{ record.firstName }}</span>
        </div>
      </template>

      <template v-if="column.key === 'lastName'">
        <div class="inconsistent-users">
          <span class="name">{{ record.lastName }}</span>
        </div>
      </template>

      <template v-if="column.key === 'email'">
        <span class="name">{{ record.mail }}</span>
      </template>

      <template v-if="column.key === 'domain'">
        <span class="name">{{ record.domainName }}</span>
      </template>

      <template v-if="column.key === 'domainId'">
        <span class="name">{{ record.domain }}</span>
      </template>
    </template>
  </a-table>
</template>

<style lang="less" scoped>
.inconsistent-users {
  display: flex;
  flex-direction: row;

  .name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: @text-color;
  }
}

:deep(.ant-tag).node-type {
  border: 0px;
  background: @primary-1;
  color: @primary-color;
  text-transform: uppercase;
}
</style>
