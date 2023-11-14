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
      :data-source="sortedPermissions"
      :columns="columns"
      :pagination="false"
      class="technical-account-table__table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'selectAll'">
          <span></span>
        </template>
        <template v-if="column.key === 'permission'">
          <a-checkbox :checked="isChecked(record)" @change="handleCheckboxChange(record)">
            {{ $t(`TECHNICAL_ACCOUNTS.DETAIL_PAGE.TECHNICAL_ACCOUNT_PERMISSION_TYPE.${record}`) }}
          </a-checkbox>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { SearchOutlined } from '@ant-design/icons-vue';
import { PermissionType } from '../../types/TechnicalAccount';
import useTechnicalAccount from '../../hooks/useTechnicalAccount';

const areAllPermissionsSelected = () => {
  return selectedPermissions.value.length === filteredPermissions.value.length;
};

const handleSelectAllPermissions = () => {
  if (areAllPermissionsSelected()) {
    selectedPermissions.value = [];
  } else {
    selectedPermissions.value = [...filteredPermissions.value];
  }
  technicalAccountDetails.permissions = selectedPermissions.value;
};

const columns = computed(() => [
  {
    title: () => {
      return h(
        'div',
        {
          style: { display: 'flex', alignItems: 'center' },
        },
        [
          h('input', {
            type: 'checkbox',
            checked: areAllPermissionsSelected(),
            onChange: handleSelectAllPermissions,
          }),
          h('span', { style: { marginLeft: '8px' } }, t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.PERMISSION_TITLE')),
        ]
      );
    },
    key: 'permission',
  },
]);

const { filteredPermissionsText, filteredPermissions, technicalAccountDetails } = useTechnicalAccount();

const { t } = useI18n();

const selectedPermissions = ref([] as PermissionType[]);

const isChecked = (permission: PermissionType) => {
  return selectedPermissions.value.includes(permission);
};

const handleCheckboxChange = (permission: PermissionType) => {
  if (isChecked(permission)) {
    selectedPermissions.value = selectedPermissions.value.filter((p) => p !== permission);
    technicalAccountDetails.permissions = selectedPermissions.value;
  } else {
    selectedPermissions.value.push(permission);
    technicalAccountDetails.permissions = selectedPermissions.value;
  }
};

const sortedPermissions = computed(() => {
  return filteredPermissions.value.slice().sort((permissionA, permissionB) => {
    const isSelectedA = selectedPermissions.value.includes(permissionA);
    const isSelectedB = selectedPermissions.value.includes(permissionB);
    if (isSelectedA && !isSelectedB) {
      return -1;
    } else if (!isSelectedA && isSelectedB) {
      return 1;
    }
    return 0;
  });
});

watch(
  () => technicalAccountDetails.permissions,
  (newPermissions) => {
    selectedPermissions.value = newPermissions.filter((permission) => filteredPermissions.value.includes(permission));
  }
);
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
