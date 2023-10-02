<template>
  <div class="domain-policy-table">
    <a-table
      key="identifier"
      class="domain-policy-table__table"
      :columns="columns"
      :pagination="false"
      :data-source="filteredListByPage"
      :row-selection="rowSelection"
      row-key="identifier"
      :loading="status === STATUS.LOADING"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'label'">
          <span class="elipsis-name" :title="record.label">{{ record.label }}</span>
        </template>
        <template v-else-if="column.key === 'readOnly'">
          <a-tag v-if="record.readOnly" color="success">
            {{ $t('EMAIL_TEMPLATES.EDITABLE') }}
          </a-tag>
          <a-tag v-else color="red"> {{ $t('EMAIL_TEMPLATES.READ_ONLY') }}</a-tag>
        </template>
        <template v-else-if="column.key === 'creationDate'">
          <span>{{ $d(record?.creationDate, 'mediumDate') }}</span>
        </template>
        <template v-else-if="column.key === 'modificationDate'">
          <span>{{ $d(record?.modificationDate, 'mediumDate') }}</span>
        </template>
        <template v-else-if="column.key === 'assigned'">
          <a-tag v-if="isAssigned(record.identifier, currentDomain.domainPolicy?.uuid)" color="success">
            {{ $t('GENERAL.ASSIGNED') }}
          </a-tag>
          <a-tag v-else color="red"> {{ $t('GENERAL.UNASSIGNED') }}</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-dropdown overlay-class-name="email-layout-table__dropdown" placement="bottomRight" :trigger="['click']">
            <a-button class="ls-detail ls-button ls-primary">
              <detail-icon width="16px" height="16px"></detail-icon>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item v-if="allowDuplicate(record)" @click="onDuplicateDomainPolicy(record)">
                  <CopyOutlined :style="{ color: '#007AFF' }" />
                  {{ $t('GENERAL.DUPLICATE') }}
                </a-menu-item>
                <a-menu-item
                  v-if="allowAssigned(record)"
                  :disabled="record.assigned"
                  @click="onAssignDomainPolicy(record)"
                >
                  <AssignIcon></AssignIcon> {{ $t('GENERAL.ASSIGN') }}
                </a-menu-item>
                <a-menu-item v-if="allowView(record)" @click="onEditDomainPolicy(record)">
                  <EyeOutlined :style="{ color: '#007AFF' }" />
                  {{ $t('GENERAL.VIEW') }}
                </a-menu-item>
                <a-menu-item v-if="allowEdit(record)" @click="onEditDomainPolicy(record)">
                  <EditIcon></EditIcon>
                  {{ $t('GENERAL.EDIT') }}
                </a-menu-item>
                <a-menu-item v-if="allowDelete(record)" @click="onDeleteDomainPolicy(record)">
                  <DeleteIcon></DeleteIcon> {{ $t('GENERAL.DELETE') }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { STATUS } from '@/core/types/Status';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import AssignIcon from '@/core/components/icons/assign-icon.vue';
import EditIcon from '@/core/components/icons/edit-icon.vue';
import DeleteIcon from '@/core/components/icons/delete-mime-icon.vue';
import { useDomainStore } from '@/modules/domain/store';
import DetailIcon from '@/core/components/icons/detail-icon.vue';
import useDomainPolicies from '../hooks/useDomainPolicies';
import { DomainPolicy } from '../types/DomainPolicy';
import { useAuthStore } from '@/modules/auth/store';
import { EyeOutlined, CopyOutlined } from '@ant-design/icons-vue';

const {
  status,
  filteredListByPage,
  selectedDomainPolicies,
  isAssigned,
  onEditDomainPolicy,
  onAssignDomainPolicy,
  onDeleteDomainPolicy,
  onDuplicateDomainPolicy,
} = useDomainPolicies();

const { t } = useI18n();
const authStore = useAuthStore();
const domainStore = useDomainStore();
const { loggedUser } = storeToRefs(authStore);
const { isRootDomain, currentDomain } = storeToRefs(domainStore);

// computed
const isSuperAdmin = computed(() => {
  return loggedUser.value?.role === ACCOUNT_ROLE.SUPERADMIN;
});

const rowSelection = computed(() => ({
  checkStrictly: false,
  selectedRowKeys: selectedDomainPolicies.value?.map((item) => item.identifier) ?? [],
  onSelect: (record: DomainPolicy, selected: boolean, selectedRows: DomainPolicy[]) => {
    selectedDomainPolicies.value = selectedRows;
  },
  onSelectAll: (selected: boolean, selectedRows: DomainPolicy[], changeRows: DomainPolicy[]) => {
    selectedDomainPolicies.value = selectedRows;
  },
  onChange: (selected: boolean, selectedRows: DomainPolicy[], changeRows: DomainPolicy[]) => {
    selectedDomainPolicies.value = selectedRows;
  },
}));

const columns = computed(() => [
  {
    width: '300px',
    title: t('GENERAL.NAME'),
    sorter: (a: DomainPolicy, b: DomainPolicy) => a.label.localeCompare(b.label),
    key: 'label',
  },
  {
    title: t('GENERAL.DESCRIPTION'),
    align: 'center',
    dataIndex: ['description'],
    sorter: (a: DomainPolicy, b: DomainPolicy) => a.description.localeCompare(b.description),
    key: 'description',
  },
  {
    title: t('GENERAL.CREATION_DATE'),
    dataIndex: ['creationDate'],
    sorter: (a: DomainPolicy, b: DomainPolicy) => (a.creationDate || 0) - (b.creationDate || 0),
    key: 'creationDate',
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    dataIndex: ['modificationDate'],
    sorter: (a: DomainPolicy, b: DomainPolicy) => (a.modificationDate || 0) - (b.modificationDate || 0),
    defaultSortOrder: 'descend',
    key: 'modificationDate',
  },
  {
    title: t('GENERAL.ASSIGNED'),
    key: 'assigned',
  },
  {
    title: t('GENERAL.ACTIONS'),
    key: 'action',
  },
]);

function domainRedirectionAuthorized(record: DomainPolicy) {
  return record.domain === 'LinShareRootDomain' && loggedUser?.value?.role === ACCOUNT_ROLE.ADMIN;
}

function hasRootDomain(record: DomainPolicy) {
  return record.domain === 'LinShareRootDomain';
}

function allowEdit(record: DomainPolicy) {
  return isSuperAdmin.value;
}

function allowDelete(record: DomainPolicy) {
  return isSuperAdmin.value;
}

function allowDuplicate(record: DomainPolicy) {
  return isSuperAdmin.value;
}

function allowView(record: DomainPolicy) {
  return !allowEdit(record);
}

function allowAssigned() {
  return !isRootDomain.value && isSuperAdmin.value;
}
</script>

<style lang="less">
.domain-policy-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

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

  &__dropdown {
    background-color: transparent !important;
    box-shadow: none !important;

    .ant-dropdown-menu {
      padding: 8px;
      gap: 8px;
      width: 301px;
      height: 164px;
      background: #ffffff;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
    }

    .ant-dropdown-menu-item {
      height: 48px;
      border-radius: 8px;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      letter-spacing: -0.02em;
    }

    .ant-dropdown-menu-title-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
    }

    svg {
      color: #007aff;
    }

    .delete svg {
      color: #ea3c3c;
    }

    .ant-dropdown-menu-item:hover {
      color: #007aff;
    }
  }
}
</style>
