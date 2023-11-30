<template>
  <a-table
    :columns="columns"
    :data-source="filteredListByPage"
    :pagination="false"
    :loading="status === STATUS.LOADING"
    :row-selection="rowSelection"
    row-key="uuid"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <span class="elipsis-name" :title="record.name">{{ record.name }}</span>
      </template>
      <template v-if="column.key === 'domain'">
        <span v-if="domainRedirectionAuthorized(record)">{{ record.domainName }}</span>
        <router-link v-else :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: record.domainId } }">
          <span>{{ record.domainName }}</span>
        </router-link>
      </template>
      <template v-else-if="column.key === 'creationDate'">
        <span>{{ $d(record.creationDate, 'mediumDate') }}</span>
      </template>
      <template v-else-if="column.key === 'modificationDate'">
        <span>{{ $d(record.modificationDate, 'mediumDate') }}</span>
      </template>
      <template v-else-if="column.key === 'assigned'">
        <a-tag v-if="isAssigned(record.uuid, currentDomain.mimePolicy?.uuid)" color="success">
          {{ $t('GENERAL.ASSIGNED') }}
        </a-tag>
        <a-tag v-else color="red"> {{ $t('GENERAL.UNASSIGNED') }}</a-tag>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-dropdown>
          <EllipsisOutlined />
          <template #overlay>
            <a-menu>
              <a-menu-item
                :disabled="isAssigned(record.uuid, currentDomain.mimePolicy?.uuid)"
                @click="onAssignMimePolicy(record)"
              >
                <AssignIcon></AssignIcon> {{ $t('GENERAL.ASSIGN') }}
              </a-menu-item>
              <a-menu-item
                v-if="!isEditable(record.domainId, currentDomain.uuid) || loggedUser?.role === ACCOUNT_ROLE.SUPERADMIN"
                @click="onEditMimePolicy(record)"
              >
                <EditIcon></EditIcon> {{ $t('GENERAL.EDIT') }}
              </a-menu-item>
              <a-menu-item
                v-if="isEditable(record.domainId, currentDomain.uuid) || loggedUser?.role !== ACCOUNT_ROLE.SUPERADMIN"
                @click="onEditMimePolicy(record)"
              >
                <EyeOutlined :style="{ color: '#007AFF' }"></EyeOutlined> {{ $t('GENERAL.VIEW') }}
              </a-menu-item>
              <a-menu-item
                v-if="!isEditable(record.domainId, currentDomain.uuid) || loggedUser?.role === ACCOUNT_ROLE.SUPERADMIN"
                @click="onDeleteMimePolicy(record)"
              >
                <DeleteIcon></DeleteIcon> {{ $t('GENERAL.DELETE') }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { STATUS } from '@/core/types/Status';
import { MimePolicy } from '../types/MimeType';
import useMimesPolicies from '../hooks/useMimePolicies';
import AssignIcon from '@/core/components/icons/assign-icon.vue';
import EditIcon from '@/core/components/icons/edit-icon.vue';
import DeleteIcon from '@/core/components/icons/delete-mime-icon.vue';
import { useAuthStore } from '@/modules/auth/store';
import { useDomainStore } from '@/modules/domain/store';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { EyeOutlined } from '@ant-design/icons-vue';

const authStore = useAuthStore();
const { loggedUser } = storeToRefs(authStore);
const { t } = useI18n();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);
const {
  status,
  filteredListByPage,
  selectedMimePolicies,
  isAssigned,
  isEditable,
  onEditMimePolicy,
  onAssignMimePolicy,
  onDeleteMimePolicy,
} = useMimesPolicies();

// data
const rowSelection = computed(() => ({
  checkStrictly: false,
  selectedRowKeys: selectedMimePolicies.value?.map((item) => item.uuid) ?? [],
  onSelect: (record: MimePolicy, selected: boolean, selectedRows: MimePolicy[]) => {
    selectedMimePolicies.value = selectedRows;
  },
  onSelectAll: (selected: boolean, selectedRows: MimePolicy[], changeRows: MimePolicy[]) => {
    selectedMimePolicies.value = selectedRows;
  },
  onChange: (selected: boolean, selectedRows: MimePolicy[], changeRows: MimePolicy[]) => {
    selectedMimePolicies.value = selectedRows;
  },
}));

const columns = computed(() => [
  {
    width: '350px',
    title: t('GENERAL.NAME'),
    sorter: (a: MimePolicy, b: MimePolicy) => a.name.localeCompare(b.name),
    key: 'name',
  },
  {
    title: t('GENERAL.DOMAIN'),
    align: 'center',
    sorter: (a: MimePolicy, b: MimePolicy) => a.domainName.localeCompare(b.domainName),
    dataIndex: ['domain', 'name'],
    key: 'domain',
  },

  {
    title: t('GENERAL.CREATION_DATE'),
    dataIndex: ['creationDate'],
    sorter: (a: MimePolicy, b: MimePolicy) => (a.creationDate || 0) - (b.creationDate || 0),
    key: 'creationDate',
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    dataIndex: ['modificationDate'],
    sorter: (a: MimePolicy, b: MimePolicy) => (a.modificationDate || 0) - (b.modificationDate || 0),
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

function domainRedirectionAuthorized(record: MimePolicy) {
  return record.domainId === 'LinShareRootDomain' && loggedUser?.value?.role === ACCOUNT_ROLE.ADMIN;
}
</script>

<style lang="less" scoped>
.elipsis-name {
  max-width: 350px;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
}
</style>
