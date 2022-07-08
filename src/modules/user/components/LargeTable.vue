<template>
  <a-table :columns="columns" :data-source="list" row-key="uuid" :pagination="false" :loading="loading">
    <template #bodyCell="{ column, record, text }">
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

      <template v-else-if="column.key === 'type'">
        <a-tag color="blue">
          {{ $t(`USERS.DETAIL_USER.TYPE_${text}`) }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'role'">
        <a-tag color="purple">
          {{ $t(`USERS.DETAIL_USER.ROLE_${text}`) }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'domain'">
        <router-link :to="{ name: 'DomainDetails', params: { domainUuid: record.domain.uuid } }">
          <span class="item__domain">{{ text }}</span>
        </router-link>
      </template>

      <template v-else-if="column.key === 'modificationDate'">
        <span :title="$d(text, 'mediumDate')">{{ relativeDate(record.modificationDate) }}</span>
      </template>

      <template v-else-if="column.key === 'creationDate'">
        <span>{{ $d(text, 'mediumDate') }}</span>
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
    key: 'user',
  },
  {
    title: t('GENERAL.DOMAIN'),
    align: 'center',
    dataIndex: ['domain', 'name'],
    width: 200,
    key: 'domain',
  },
  {
    title: t('USERS.DETAIL_USER.ACCOUNT_TYPE'),
    dataIndex: 'accountType',
    align: 'center',
    width: 200,
    key: 'type',
  },
  {
    title: t('USERS.DETAIL_USER.ROLE'),
    dataIndex: 'role',
    align: 'center',
    width: 200,
    key: 'role',
  },
  {
    title: t('GENERAL.UPDATE_TIME_RELATIVE'),
    dataIndex: 'modificationDate',
    width: 200,
    key: 'modificationDate',
  },
  {
    title: t('GENERAL.CREATE_AT'),
    dataIndex: 'creationDate',
    width: 200,
    key: 'creationDate',
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
