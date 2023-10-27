<template>
  <div class="technical-account-table">
    <div class="action">
      <a-input v-model:value="filterText" :placeholder="$t('GENERAL.SEARCH_BY_NAME')" class="action-input" allow-clear>
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <a-button type="primary" @click="onCreateTechnicalAccount">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        {{ $t('GENERAL.CREATE') }}
      </a-button>
    </div>
    <a-table :columns="columns" :pagination="false" :data-source="filteredListByPage" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'account'">
          <router-link
            :to="{ name: MY_TECHNICAL_ACCOUNTS_ROUTE_NAMES.TECHNICAL_ACCOUNT_DETAIL, params: { id: record?.uuid } }"
          >
            <div class="user-infos">
              <div>
                <a-avatar shape="circle" :size="46" class="profile-avatar">
                  <span> {{ record.name.charAt(0) }}</span>
                </a-avatar>
              </div>
              <div class="account-name">
                <strong :title="record.name">{{ record.name }}</strong>
              </div>
            </div>
          </router-link>
        </template>
        <template v-else-if="column.key === 'mail'">
          <span>{{ record.mail }}</span>
        </template>
        <template v-else-if="column.key === 'role'">
          <span>{{ record.role }}</span>
        </template>
        <template v-else-if="column.key === 'creationDate'">
          <span>{{ $d(record.creationDate, 'mediumDate') }}</span>
        </template>
        <template v-else-if="column.key === 'modificationDate'">
          <span>{{ $d(record.modificationDate, 'mediumDate') }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag v-if="record.enable" color="success">
            {{ $t('TECHNICAL_ACCOUNTS.ENABLE') }}
          </a-tag>
          <a-tag v-else color="default"> {{ $t('TECHNICAL_ACCOUNTS.DISABLE') }}</a-tag>
        </template>
        <template v-else-if="column.key === 'locked'">
          <a-tag v-if="record.locked" color="red">
            {{ $t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.LOCKED') }}
          </a-tag>
          <a-tag v-else color="success"> {{ $t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.UNLOCK') }}</a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';
import useTechnicalAccount from '../hooks/useTechnicalAccount';
import { TechnicalAccount } from '../types/TechnicalAccount';
import { MY_TECHNICAL_ACCOUNTS_ROUTE_NAMES } from '../router';

const { t } = useI18n();
const { filteredListByPage, loading, filterText, onCreateTechnicalAccount } = useTechnicalAccount();

const columns = computed(() => [
  {
    title: t('TECHNICAL_ACCOUNTS.ACCOUNT'),
    sorter: (a: TechnicalAccount, b: TechnicalAccount) => a.name.localeCompare(b.name),
    key: 'account',
  },
  {
    title: t('TECHNICAL_ACCOUNTS.MAIL'),
    sorter: (a: TechnicalAccount, b: TechnicalAccount) => a.mail.localeCompare(b.mail),
    key: 'mail',
  },
  {
    title: t('TECHNICAL_ACCOUNTS.ROLE'),
    sorter: (a: TechnicalAccount, b: TechnicalAccount) => a.role.localeCompare(b.role),
    key: 'role',
  },
  {
    title: t('TECHNICAL_ACCOUNTS.CREATION_DATE'),
    sorter: (a: TechnicalAccount, b: TechnicalAccount) => (a.creationDate || 0) - (b.creationDate || 0),
    key: 'creationDate',
  },
  {
    title: t('TECHNICAL_ACCOUNTS.MODIFICATION_DATE'),
    defaultSortOrder: 'descend',
    sorter: (a: TechnicalAccount, b: TechnicalAccount) => (a.creationDate || 0) - (b.creationDate || 0),
    key: 'modificationDate',
  },
  {
    title: t('TECHNICAL_ACCOUNTS.STATUS'),
    sorter: (a: TechnicalAccount, b: TechnicalAccount) => a.enable.toString().localeCompare(b.enable.toString()),
    key: 'status',
  },
  {
    title: t('TECHNICAL_ACCOUNTS.LOCKED'),
    sorter: (a: TechnicalAccount, b: TechnicalAccount) => a.locked.toString().localeCompare(b.locked.toString()),
    key: 'locked',
  },
]);
</script>

<style lang="less">
.technical-account-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;
  .user-infos {
    display: flex;
    flex-direction: row;
  }

  .profile-avatar {
    background-color: @primary-color;
    color: @component-background;
    margin-right: 10px;
  }
}

&__table .ant-table {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: auto;
}

.ant-tag.ant-tag-success {
  padding: 4px 8px;
  gap: 8px;
  min-width: 44px;
  height: 24px;
  background: #e8f4ff;
  border-radius: 5px;
  color: #007aff;
  border: none;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
}

.ant-tag.ant-tag-red {
  padding: 4px 8px;
  gap: 8px;
  min-width: 44px;
  height: 24px;
  background: #fff3f3;
  border-radius: 5px;
  color: #ea3c3c;
  border: none;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
}

.ant-tag.ant-tag-default {
  padding: 4px 8px;
  gap: 8px;
  min-width: 44px;
  height: 24px;
  background: #f3f3f7;
  border-radius: 5px;
  color: #989cb1;
  border: none;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
}

.delete svg {
  color: #ea3c3c;
}

.account-name {
  display: flex;
  justify-content: center;
  align-items: center;
}

.action {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.action-input {
  width: 375px;
}
</style>
