<template>
  <a-table
    :columns="columns"
    :data-source="filteredListByPage"
    :pagination="false"
    :loading="status === StatusValue.LOADING"
    row-key="uuid"
  >
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'name'">
        <router-link :to="{ name: 'DomainWelcomeMessageDetails', params: { uuid: record.uuid } }">
          <span class="elipsis-name" :title="text">{{ text }}</span>
        </router-link>
      </template>
      <template v-else-if="column.key === 'date'">
        <span>{{ $d(text, 'mediumDate') }}</span>
      </template>
      <template v-else-if="column.key === 'assigned'">
        <a-tag v-if="text === true" color="success">
          {{ $t('GENERAL.ASSIGNED') }}
        </a-tag>
        <a-tag v-else color="red">
          {{ $t('GENERAL.UNASSIGNED') }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'readOnly'">
        <a-tag v-if="text === true" color="red">
          {{ $t('GENERAL.READ_ONLY') }}
        </a-tag>
        <a-tag v-if="text === false" color="success">
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
                @click="onAssign(record)"
              >
                {{ $t('GENERAL.ASSIGN') }}
              </a-menu-item>
              <a-menu-item @click="onDupplicate(record)">
                {{ $t('GENERAL.DUPLICATE') }}
              </a-menu-item>
              <a-menu-item @click="onView(record)">
                {{ $t(record.readOnly ? 'GENERAL.VIEW' : 'GENERAL.EDIT') }}
              </a-menu-item>
              <a-menu-item v-if="canDeleteMessage(record)" @click="onDelete(record)">
                <span class="delete_text"> {{ $t('GENERAL.DELETE') }} </span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { useDomainStore } from '@/modules/domain/store';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import StatusValue from '@/core/types/Status';
import WelcomeMessage from '../types/WelcomeMessages';
import useWelcomeMessages from '../hooks/useWelcomeMessages';
import useNotification from '@/core/hooks/useNotification';

const { confirmModal } = useNotification();
const { filteredListByPage, status, assign, remove, view, dupplicate, canDeleteMessage } = useWelcomeMessages();
const { t } = useI18n();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);

const columns = computed(() => [
  {
    title: t('GENERAL.NAME'),
    dataIndex: ['name'],
    sorter: (a: WelcomeMessage, b: WelcomeMessage) => a.name.localeCompare(b.name),
    key: 'name',
  },
  {
    title: t('GENERAL.READ_ONLY'),
    dataIndex: ['readOnly'],
    key: 'readOnly',
  },
  {
    title: t('GENERAL.DOMAIN'),
    dataIndex: ['domain', 'name'],
    sorter: (a: WelcomeMessage, b: WelcomeMessage) => a.domain?.name.localeCompare(b.domain?.name || ''),
    key: 'readOnly',
  },
  {
    title: t('GENERAL.CREATION_DATE'),
    dataIndex: ['creationDate'],
    sorter: (a: WelcomeMessage, b: WelcomeMessage) => (a.creationDate || 0) - (b.creationDate || 0),
    key: 'date',
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    dataIndex: ['modificationDate'],
    sorter: (a: WelcomeMessage, b: WelcomeMessage) => (a.modificationDate || 0) - (b.modificationDate || 0),
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

function onAssign(welcomeMessage: WelcomeMessage) {
  confirmModal({
    title: t('GENERAL.ASSIGN'),
    content: t('WELCOME_MESSAGES.ASSIGN_CONFIRM'),
    okText: t('GENERAL.YES'),
    onOk: () => assign(welcomeMessage),
  });
}

async function onDelete(welcomeMessage: WelcomeMessage) {
  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('WELCOME_MESSAGES.DELETE_CONFIRM'),
    okText: t('GENERAL.DELETE'),
    onOk: () => remove(welcomeMessage),
  });
}

function onDupplicate(welcomeMessage: WelcomeMessage) {
  dupplicate(welcomeMessage);
}

function onView(welcomeMessage: WelcomeMessage) {
  view(welcomeMessage);
}
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.delete_text {
  color: @error-color;
}

.elipsis-name {
  min-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
}
</style>
