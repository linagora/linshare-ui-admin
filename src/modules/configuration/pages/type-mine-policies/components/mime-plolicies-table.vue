<template>
  <a-table
    :columns="columns"
    :data-source="filteredListByPage"
    :pagination="false"
    :loading="status === STATUS.LOADING"
    row-key="uuid"
  >
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'name'">
        <span class="elipsis-name" :title="text">{{ text }}</span>
      </template>
      <template v-if="column.key === 'domain'">
        <span>{{ record.domainId }}</span>
      </template>
      <template v-else-if="column.key === 'date'">
        <span>{{ $d(text, 'mediumDate') }}</span>
      </template>
      <template v-else-if="column.key === 'assigned'">
        <a-tag v-if="isAssigned(record.uuid, currentDomain.mimePolicy?.uuid)" color="success">
          {{ $t('GENERAL.ASSIGNED') }}
        </a-tag>
        <a-tag v-else color="red"> {{ $t('GENERAL.UNASSIGNED') }}</a-tag>
      </template>
      <template v-else-if="column.key === 'readOnly'">
        <a-tag v-if="isEditable(record.domainId, currentDomain.uuid)" color="red">
          {{ $t('GENERAL.READ_ONLY') }}
        </a-tag>
        <a-tag v-else color="success">
          {{ $t('GENERAL.EDITABLE') }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-dropdown>
          <EllipsisOutlined />
          <template #overlay>
            <a-menu>
              <a-menu-item
                v-if="currentDomain.type !== DOMAIN_TYPE.ROOT"
                :disabled="record.assignedToCurrentDomain === true"
              >
                <AssignIcon></AssignIcon> {{ $t('GENERAL.ASSIGN') }}
              </a-menu-item>
              <a-menu-item v-if="!isEditable(record.domainId, currentDomain.uuid)">
                <EditIcon></EditIcon> {{ $t('GENERAL.EDIT') }}
              </a-menu-item>
              <a-menu-item v-if="isEditable(record.domainId, currentDomain.uuid)" class="view-icon">
                <ViewIcon></ViewIcon> {{ $t('GENERAL.VIEW') }}
              </a-menu-item>
              <a-menu-item v-if="!isEditable(record.domainId, currentDomain.uuid)">
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
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { useDomainStore } from '@/modules/domain/store';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import { STATUS } from '@/core/types/Status';
import Mimes from '../types/MimeType';
import useMimesPolicies from '../hooks/useMimePolicies';
import AssignIcon from '@/core/components/icons/assign-icon.vue';
import EditIcon from '@/core/components/icons/edit-icon.vue';
import DeleteIcon from '@/core/components/icons/delete-mime-icon.vue';
import ViewIcon from '@/core/components/icons/view-mimes-icon.vue';

const { status, filteredListByPage, getMinePoliciesList, isAssigned, isEditable } = useMimesPolicies();
const { t } = useI18n();
const { currentRoute } = useRouter();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);

const columns = computed(() => [
  {
    title: t('GENERAL.NAME'),
    dataIndex: ['name'],
    sorter: (a: Mimes, b: Mimes) => a.name.localeCompare(b.name),
    key: 'name',
  },
  {
    title: t('GENERAL.READ_ONLY'),
    dataIndex: ['readOnly'],
    key: 'readOnly',
  },
  {
    title: t('GENERAL.DOMAIN'),
    align: 'center',
    dataIndex: ['domain', 'name'],
    key: 'domain',
  },

  {
    title: t('GENERAL.CREATION_DATE'),
    dataIndex: ['creationDate'],
    key: 'date',
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    dataIndex: ['modificationDate'],
    sorter: (a: Mimes, b: Mimes) => (a.modificationDate || 0) - (b.modificationDate || 0),
    defaultSortOrder: 'descend',
    key: 'date',
  },
  {
    title: t('GENERAL.ASSIGNED'),
    dataIndex: ['assignedToCurrentDomain'],
    key: 'assigned',
  },
  {
    title: t('GENERAL.ACTIONS'),
    key: 'action',
  },
]);

await getMinePoliciesList(currentDomain.value.uuid);

watch(currentRoute, (newRoute) => {
  if (newRoute) {
    getMinePoliciesList(currentDomain.value.uuid);
  }
});
</script>

<style lang="less" scoped>
.elipsis-name {
  min-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
}
</style>
