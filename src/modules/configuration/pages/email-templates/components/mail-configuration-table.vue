<template>
  <a-table
    :columns="columns"
    :pagination="false"
    row-key="uuid"
    :data-source="filteredListByPage"
    :loading="status === STATUS.LOADING"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <span class="elipsis-name" :title="record.name">{{ record.name }}</span>
      </template>
      <template v-else-if="column.key === 'readOnly'">
        <a-tag v-if="record.readOnly" color="success">
          {{ $t('EMAIL_TEMPLATES.EDITABLE') }}
        </a-tag>
        <a-tag v-else color="red"> {{ $t('EMAIL_TEMPLATES.READ_ONLY') }}</a-tag>
      </template>
      <template v-if="column.key === 'domain'">
        <router-link :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: record.domain } }">
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
        <a-tag v-if="isAssigned(record.uuid, currentDomain.mailConfiguration?.uuid)" color="success">
          {{ $t('GENERAL.ASSIGNED') }}
        </a-tag>
        <a-tag v-else color="red"> {{ $t('GENERAL.UNASSIGNED') }}</a-tag>
      </template>
      <template v-else-if="column.key === 'visible'">
        <a-tag v-if="record.visible" color="success">
          {{ $t('EMAIL_TEMPLATES.PUBLIC') }}
        </a-tag>
        <a-tag v-else color="red"> {{ $t('EMAIL_TEMPLATES.PRIVATE') }}</a-tag>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-dropdown>
          <EllipsisOutlined />
          <template #overlay>
            <a-menu>
              <a-menu-item
                :disabled="isAssigned(record.uuid, currentDomain.mailConfiguration?.uuid)"
                @click="onAssignMimePolicy(record)"
              >
                <AssignIcon></AssignIcon> {{ $t('GENERAL.ASSIGN') }}
              </a-menu-item>
              <a-menu-item> <EditIcon></EditIcon> {{ $t('GENERAL.EDIT') }} </a-menu-item>
              <a-menu-item> <DeleteIcon></DeleteIcon> {{ $t('GENERAL.DELETE') }} </a-menu-item>
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
import AssignIcon from '@/core/components/icons/assign-icon.vue';
import EditIcon from '@/core/components/icons/edit-icon.vue';
import DeleteIcon from '@/core/components/icons/delete-mime-icon.vue';
import { useDomainStore } from '@/modules/domain/store';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import useEmailTemplatesConfiguration from '../hooks/useEmailTemplatesConfiguration';
import { MailConfiguration } from '../types/MailConfiguration';

const { status, filteredListByPage, isAssigned, onAssignMimePolicy } = useEmailTemplatesConfiguration();
const { t } = useI18n();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);

const columns = computed(() => [
  {
    width: '300px',
    title: t('GENERAL.NAME'),
    sorter: (a: MailConfiguration, b: MailConfiguration) => a.name.localeCompare(b.name),
    key: 'name',
  },
  {
    title: t('EMAIL_TEMPLATES.READ_ONLY'),
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
    sorter: (a: MailConfiguration, b: MailConfiguration) => (a.creationDate || 0) - (b.creationDate || 0),
    key: 'creationDate',
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    dataIndex: ['modificationDate'],
    sorter: (a: MailConfiguration, b: MailConfiguration) => (a.modificationDate || 0) - (b.modificationDate || 0),
    defaultSortOrder: 'descend',
    key: 'modificationDate',
  },
  {
    title: t('GENERAL.ASSIGNED'),
    key: 'assigned',
  },
  {
    title: t('EMAIL_TEMPLATES.VISIBILITY'),
    key: 'visible',
  },
  {
    title: t('GENERAL.ACTIONS'),
    key: 'action',
  },
]);
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
