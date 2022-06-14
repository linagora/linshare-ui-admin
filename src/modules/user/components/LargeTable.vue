<template>
  <a-table :columns="columns" :data-source="list" row-key="uuid" :pagination="false" :loading="loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'user'">
        <router-link :to="{ name: 'UserDetail', params: { id: record.uuid } }">
          <div class="user-infos">
            <div>
              <a-avatar shape="circle" :size="46" class="profile-avatar">
                <span> {{ record.firstName.charAt(0) }}</span>
              </a-avatar>
            </div>

            <div>
              <span class="name">{{ record.firstName }} {{ record.lastName }}</span>
              <br />
              <span class="mail">{{ record.mail }}</span>
            </div>
          </div>
        </router-link>
      </template>

      <template v-if="column.key === 'type'">
        <a-tag color="blue">
          {{ $t(`USERS.DETAIL_USER.TYPE_${record.accountType}`) }}
        </a-tag>
      </template>

      <template v-if="column.key === 'role'">
        <a-tag color="purple">
          {{ $t(`USERS.DETAIL_USER.ROLE_${record.role}`) }}
        </a-tag>
      </template>

      <template v-if="column.key === 'domain'">
        <router-link :to="{ name: 'DomainDetails', params: { domainUuid: record.domain.uuid } }">
          <span class="item__domain">{{ record.domain.name }}</span>
        </router-link>
      </template>

      <template v-if="column.key === 'modification_date'">
        <span :title="$d(record.modificationDate, 'mediumDate')">{{ relativeDate(record.modificationDate) }}</span>
      </template>

      <template v-if="column.key === 'creation_date'">
        <span>{{ $d(record.creationDate, 'mediumDate') }}</span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useUsersList from '@/modules/user/hooks/useUsersList';
import useRelativeTime from '@/core/hooks/useRelativeTime';

const { loading, list, handleTableChange } = useUsersList();
const { t } = useI18n();

function relativeDate(date: number) {
  const relativeTime = useRelativeTime(date);
  return relativeTime?.value;
}

const columns = computed(() => [
  {
    title: t('NAVIGATOR.USERS'),
    dataIndex: ['user'],
    key: 'user',
  },
  {
    title: t('GENERAL.DOMAIN'),
    align: 'center',
    dataIndex: 'domain',
    width: '200',
    key: 'domain',
  },
  {
    title: t('USERS.DETAIL_USER.ACCOUNT_TYPE'),
    dataIndex: 'type',
    align: 'center',
    width: '200',
    key: 'type',
  },
  {
    title: t('USERS.DETAIL_USER.ROLE'),
    dataIndex: 'role',
    align: 'center',
    width: '200',
    key: 'role',
  },
  {
    title: t('GENERAL.UPDATE_TIME_RELATIVE'),
    dataIndex: 'modification_date',
    width: '200',
    key: 'modification_date',
  },
  {
    title: t('GENERAL.CREATE_AT'),
    dataIndex: 'creation_date',
    width: '200',
    key: 'creation_date',
  },
]);
await handleTableChange();
</script>

<style lang="less" scoped>
.name {
  font-size: 16px;
  font-weight: 600;
  color: @text-color;
}
.mail {
  color: @text-color;
}

.user-infos {
  display: flex;
}

.profile-avatar {
  background-color: @primary-color;
  color: @component-background;
  margin-right: 10px;
}
</style>
