<template>
  <div class="technical-account-table">
    <span class="technical-account-table__title">
      {{ $t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.PERMISSION_TITLE') }}
    </span>
    <div>
      <a-input
        v-model:value="filteredPermissionsText"
        :placeholder="$t('GENERAL.SEARCH_BY_NAME')"
        class="permission-search-input"
        allow-clear
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </div>
    <a-table
      :data-source="filteredPermissions"
      :columns="columns"
      :pagination="false"
      class="technical-account-table__table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'permission'"> {{ record }} </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SearchOutlined } from '@ant-design/icons-vue';
import { PermissionType } from '../../types/TechnicalAccount';
import useTechnicalAccount from '../../hooks/useTechnicalAccount';

const { filteredPermissions, filteredPermissionsText } = useTechnicalAccount();

const { t } = useI18n();

const columns = computed(() => [
  {
    title: t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.PERMISSION_TITLE'),
    sorter: (a: PermissionType, b: PermissionType) => a.localeCompare(b),
    key: 'permission',
  },
]);
</script>

<style lang="less" scoped>
.technical-account-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__title {
    color: var(--neutral-colors-color-text-title, #1b1d29);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-bottom: 15px;
  }

  &__table {
    max-height: 450px;
    overflow-y: auto;
  }
}

.permission-search-input {
  height: 44px;
  background: #fff;
  border: 1px solid #e4e5f0;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>
