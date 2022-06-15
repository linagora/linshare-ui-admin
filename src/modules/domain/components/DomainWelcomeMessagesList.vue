<template>
  <PageTitle :title="$t('NAVIGATOR.WELCOME_MESSAGES')" :breadcrumbs="breadcrumbs">
    <template #helperContent>
      <div>
        <span> {{ $t('WELCOME_MESSAGES.DESCRIPTION') }} </span>
        <ul>
          <li>{{ $t('WELCOME_MESSAGES.ROOT_DOMAIN_DESCRIPTION') }}</li>
          <li>{{ $t('WELCOME_MESSAGES.NESTED_DOMAIN_DESCRIPTION') }}</li>
        </ul>
      </div>
    </template>
  </PageTitle>
  <div>
    <div class="actions">
      <a-input
        v-model:value="state.filterText"
        :placeholder="$t('GENERAL.SEARCH_BY_NAME')"
        style="width: 200px; margin-right: 10px"
        allow-clear
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <router-link :to="{ name: 'DomainWelcomeMessageNew' }">
        <a-button type="primary">
          <template #icon>
            <PlusCircleOutlined />
          </template>
          {{ $t('GENERAL.CREATE') }}
        </a-button>
      </router-link>
    </div>
  </div>

  <a-table
    :columns="columns"
    :data-source="filteredList"
    :loading="state.status === StatusValue.LOADING"
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
        <div>
          <a-dropdown>
            <EllipsisOutlined />
            <template #overlay>
              <a-menu>
                <a-menu-item
                  v-if="currentDomain.type !== DOMAIN_TYPE.ROOT"
                  :disabled="record.assignedToCurrentDomain === true"
                  @click="confirmAssign(record)"
                >
                  {{ $t('GENERAL.ASSIGN') }}
                </a-menu-item>
                <router-link
                  :to="{
                    name: 'DomainWelcomeMessageNew',
                    query: { duplicate: record.uuid },
                  }"
                >
                  <a-menu-item>
                    {{ $t('GENERAL.DUPLICATE') }}
                  </a-menu-item>
                </router-link>
                <router-link :to="{ name: 'DomainWelcomeMessageDetails', params: { uuid: record.uuid } }">
                  <a-menu-item>
                    {{ $t(record.readOnly ? 'GENERAL.VIEW' : 'GENERAL.EDIT') }}
                  </a-menu-item>
                </router-link>
                <a-menu-item v-if="canDeleteMessage(record)" @click="confirmDelete(record)">
                  <span class="delete_text"> {{ $t('GENERAL.DELETE') }} </span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { PlusCircleOutlined, SearchOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import PageTitle from '@/core/components/PageTitle.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import { getWelcomeMessages, assignWelcomeMessage, deleteWelcomeMessage } from '../services/domain-api';
import WelcomeMessage from '../types/WelcomeMessages';
import { APIError } from '@/core/types/APIError';
import { message } from 'ant-design-vue';
import StatusValue from '@/core/types/Status';
import useNotification from '@/core/hooks/useNotification';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import config from '@/config';

interface WelcomeMessagesListState {
  status: StatusValue;
  filterText: string;
  list: WelcomeMessage[];
}

const { t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const state = reactive<WelcomeMessagesListState>({
  filterText: '',
  status: StatusValue.LOADING,
  list: [],
});

const store = useStore();
const rootWelcomeMessageUuid = config.rootWelcomeMessageUuid;
const { confirmModal } = useNotification();
const currentDomainUuid = computed(() => store.getters['Domain/getCurrentDomainUuid']);
const currentDomain = computed(() => store.getters['Domain/getCurrentDomain']);
const filteredList = computed(() =>
  state.list.filter((message) => message.name.toLowerCase().includes(state.filterText.toLowerCase()))
);
const currentDomainStatus = computed<StatusValue>(() => store.getters['Domain/getStatus']('currentDomain'));

const columns = computed(() => [
  {
    title: t('GENERAL.NAME'),
    dataIndex: ['name'],
    sorter: (a: WelcomeMessage, b: WelcomeMessage) => a.name.localeCompare(b.name),
    key: 'name',
    width: '300px',
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

async function fetchWelcomeMessages() {
  if (!currentDomainUuid.value) {
    return;
  }
  state.status = StatusValue.LOADING;

  try {
    const messages = await getWelcomeMessages(currentDomainUuid.value);

    state.status = StatusValue.SUCCESS;
    state.list = messages;
  } catch (error) {
    state.status = StatusValue.ERROR;

    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

async function assign(welcomeMessage: WelcomeMessage) {
  try {
    await assignWelcomeMessage(currentDomain.value.uuid, welcomeMessage.uuid);
    message.success(t('WELCOME_MESSAGES.ASSIGN_SUCCESS'));
    state.list.forEach((element) => {
      if (element.uuid === welcomeMessage.uuid) {
        element.assignedToCurrentDomain = true;
        return;
      }
      element.assignedToCurrentDomain = false;
    });
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function confirmAssign(welcomeMessage: WelcomeMessage) {
  confirmModal({
    title: t('GENERAL.ASSIGN'),
    content: t('WELCOME_MESSAGES.ASSIGN_CONFIRM'),
    okText: t('GENERAL.YES'),
    onOk: () => assign(welcomeMessage),
  });
}

async function remove(welcomeMessage: WelcomeMessage) {
  try {
    await deleteWelcomeMessage(currentDomain.value.uuid, welcomeMessage.uuid);
    message.success(t('MESSAGES.DELETE_SUCCESS'));
    state.list = state.list.filter((message) => message.uuid !== welcomeMessage.uuid);
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

async function confirmDelete(welcomeMessage: WelcomeMessage) {
  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('WELCOME_MESSAGES.DELETE_CONFIRM'),
    okText: t('GENERAL.DELETE'),
    onOk: () => remove(welcomeMessage),
  });
}

function canDeleteMessage(welcomeMessage: WelcomeMessage) {
  return (
    !welcomeMessage.readOnly &&
    welcomeMessage.uuid !== rootWelcomeMessageUuid &&
    welcomeMessage.assignedToCurrentDomain === false
  );
}

watch(currentDomainStatus, (status: StatusValue) => {
  if (status === StatusValue.LOADING) {
    fetchWelcomeMessages();
  }
});

watch(currentDomainStatus, (status: StatusValue) => {
  if (status === StatusValue.LOADING) {
    fetchWelcomeMessages();
  }
});

onMounted(fetchWelcomeMessages);
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
  width: 300px;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
}
</style>
