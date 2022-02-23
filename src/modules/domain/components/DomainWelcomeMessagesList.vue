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

      <a-button type="primary">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        {{ $t('GENERAL.CREATE') }}
      </a-button>
    </div>
  </div>
  <a-table
    :columns="columns"
    :data-source="filteredList"
    :loading="state.status === StatusValue.LOADING"
    row-key="uuid"
  >
    <template #date="{ text }">
      <span>{{ $d(text, 'mediumDate') }}</span>
    </template>
    <template #assigned="{ text }">
      <a-tag v-if="text === true" color="success">
        {{ $t('GENERAL.ASSIGNED') }}
      </a-tag>
      <a-tag v-else color="red">
        {{ $t('GENERAL.UNASSIGNED') }}
      </a-tag>
    </template>
    <template #readOnly="{ text }">
      <a-tag v-if="text === true" color="red">
        {{ $t('GENERAL.READ_ONLY') }}
      </a-tag>
      <a-tag v-if="text === false" color="success">
        {{ $t('GENERAL.EDITABLE') }}
      </a-tag>
    </template>
    <template #action="{ record }">
      <div>
        <a-dropdown>
          <EllipsisOutlined />
          <template #overlay>
            <a-menu>
              <a-menu-item
                v-if="currentDomain.type !== DOMAIN_TYPE.ROOT"
                :disabled="record.assignedToCurrentDomain === true"
              >
                {{ $t('GENERAL.ASSIGN') }}
              </a-menu-item>
              <a-menu-item>
                {{ $t('GENERAL.DUPLICATE') }}
              </a-menu-item>
              <a-menu-item>
                {{ $t(record.readOnly ? 'GENERAL.VIEW' : 'GENERAL.EDIT') }}
              </a-menu-item>
              <a-menu-item v-if="!record.readOnly">
                <span class="delete_text"> {{ $t('GENERAL.DELETE') }} </span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
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
import { getWelcomeMessages } from '../services/domain-api';
import WelcomeMessage from '../types/WelcomeMessages';
import { APIError } from '@/core/types/APIError';
import { message } from 'ant-design-vue';
import StatusValue from '@/core/types/Status';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';

interface WelcomeMessagesListState {
  status: StatusValue;
  filterText: string;
  list: WelcomeMessage[];
  disabled: boolean;
}

const { t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const state = reactive<WelcomeMessagesListState>({
  filterText: '',
  status: StatusValue.LOADING,
  list: [],
});

const store = useStore();
const currentDomainUuid = computed(() => store.getters['Domain/getCurrentDomainUuid']);
const currentDomain = computed(() => store.getters['Domain/getCurrentDomain']);
const filteredList = computed(() =>
  state.list.filter((message) => message.name.toLowerCase().includes(state.filterText.toLowerCase()))
);
const currentDomainStatus = computed<StatusValue>(() => store.getters['Domain/getStatus']('currentDomain'));

const columns = computed(() => [
  {
    title: t('GENERAL.NAME'),
    dataIndex: 'name',
    sorter: (a: WelcomeMessage, b: WelcomeMessage) => a.name.localeCompare(b.name),
  },
  {
    title: t('GENERAL.READ_ONLY'),
    dataIndex: 'readOnly',
    slots: { customRender: 'readOnly' },
  },
  {
    title: t('GENERAL.DOMAIN'),
    dataIndex: 'domain.name',
    sorter: (a: WelcomeMessage, b: WelcomeMessage) => a.domain.name.localeCompare(b.domain.name),
  },
  {
    title: t('GENERAL.CREATION_DATE'),
    dataIndex: 'creationDate',
    sorter: (a: WelcomeMessage, b: WelcomeMessage) => (a.creationDate || 0) - (b.creationDate || 0),
    slots: { customRender: 'date' },
  },
  {
    title: t('GENERAL.MODIFICATION_DATE'),
    dataIndex: 'modificationDate',
    sorter: (a: WelcomeMessage, b: WelcomeMessage) => (a.modificationDate || 0) - (b.modificationDate || 0),
    defaultSortOrder: 'descend',
    slots: { customRender: 'date' },
  },
  {
    title: t('GENERAL.ASSIGNED'),
    dataIndex: 'assignedToCurrentDomain',
    slots: { customRender: 'assigned' },
  },
  {
    title: t('GENERAL.ACTIONS'),
    slots: { customRender: 'action' },
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
</style>
