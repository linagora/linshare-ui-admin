<template>
  <PageTitle
    :title="$t('NAVIGATOR.REMOTE_SERVERS')"
    :breadcrumbs="breadcrumbs"
  />

  <DomainManagementWarning v-if="!availableForCurrentDomain" />

  <div v-else>
    <div class="actions">
      <a-input
        v-model:value="state.filterText"
        :placeholder="$t('GENERAL.SEARCH_BY_NAME')"
        style="width: 200px; margin-right: 10px;"
        allow-clear
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>

      <a-dropdown :trigger="['click']">
        <a-button
          :disabled="state.loading"
          type="primary"
        >
          <template #icon>
            <PlusCircleOutlined />
          </template>
          {{ $t('GENERAL.CREATE') }}
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="openCreateModal">
              {{ $t('REMOTE_SERVER.TYPE.LDAP') }}
            </a-menu-item>
            <a-menu-item disabled>
              {{ $t('REMOTE_SERVER.TYPE.TWAKE') }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredList"
      :loading="state.loading"
      row-key="uuid"
    >
      <template #date="{ text }">
        {{ $d(text, 'mediumDate') }}
      </template>

      <template #actions="{ record }">
        <a-dropdown :trigger="['click']">
          <EllipsisOutlined style="font-size: 16px" />
          <template #overlay>
            <a-menu>
              <a-menu-item @click="openEditModal(record)">
                {{ $t('GENERAL.EDIT') }}
              </a-menu-item>
              <a-menu-item @click="openCreateModal(record)">
                {{ $t('GENERAL.DUPLICATE') }}
              </a-menu-item>
              <a-menu-item @click="openAssociatedDomainsModal(record)">
                {{ $t('GENERAL.VIEW_ASSOCIATED_DOMAINS') }}
              </a-menu-item>
              <a-menu-item @click="openDeleteModal(record)">
                <span class="danger">{{ $t('GENERAL.DELETE') }}</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-table>
  </div>

  <RemoteServerLDAPModal
    :visible="state.showLDAPModal"
    :data="state.target"
    @success="onSuccess"
    @cancel="state.showLDAPModal = false"
  />

  <RemoteServerAssociatedDomainsModal
    :visible="state.showDomainsModal"
    :data="state.target"
    @ok="state.showDomainsModal = false"
    @cancel="state.showDomainsModal = false"
  />
</template>

<script lang="ts">
import { computed, createVNode, defineComponent, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Modal, message } from 'ant-design-vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useDomainConfigurationPages from '@/modules/domain/hooks/useDomainConfigurationPages';
import RemoteServerAPIClient from '../services/RemoteServerAPICLient';
import RemoteServer from '../types/RemoteServer';

import PageTitle from '@/core/components/PageTitle.vue';
import RemoteServerLDAPModal from '../components/RemoteServerLDAPModal.vue';
import RemoteServerAssociatedDomainsModal from '../components/RemoteServerAssociatedDomainsModal.vue';
import DomainManagementWarning from '@/modules/domain/components/DomainManagementWarning.vue';
import { PlusCircleOutlined, EllipsisOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';

interface RemoteServersListState {
  loading: boolean;
  showLDAPModal: boolean;
  showDomainsModal: boolean;
  filterText: string;
  list: RemoteServer[];
  target: RemoteServer | {};
}

export default defineComponent({
  name: 'RemoteServersList',
  components: {
    EllipsisOutlined,
    DomainManagementWarning,
    PageTitle,
    PlusCircleOutlined,
    RemoteServerLDAPModal,
    RemoteServerAssociatedDomainsModal,
    SearchOutlined
  },
  setup () {
    const { t } = useI18n();
    const { breadcrumbs } = useBreadcrumbs();
    const { availableForCurrentDomain } = useDomainConfigurationPages();
    const state = reactive<RemoteServersListState>({
      filterText: '',
      loading: true,
      list: [],
      showLDAPModal: false,
      showDomainsModal: false,
      target: {}
    });
    const columns = computed(() => [
      {
        title: t('GENERAL.NAME'),
        dataIndex: 'name',
        sorter: (a: RemoteServer, b: RemoteServer) => a.name.localeCompare(b.name)
      },
      {
        title: t('REMOTE_SERVER.FIELDS.TYPE'),
        dataIndex: 'serverType',
        width: '130px',
        sorter: (a: RemoteServer, b: RemoteServer) => a.name.localeCompare(b.name)
      },
      {
        title: t('GENERAL.CREATION_DATE'),
        dataIndex: 'creationDate',
        sorter: (a: RemoteServer, b: RemoteServer) => a.creationDate - b.creationDate,
        slots: { customRender: 'date' }
      },
      {
        title: t('GENERAL.MODIFICATION_DATE'),
        dataIndex: 'modificationDate',
        sorter: (a: RemoteServer, b: RemoteServer) => a.modificationDate - b.modificationDate,
        slots: { customRender: 'date' }
      },
      {
        title: t('GENERAL.ACTIONS'),
        width: '80px',
        align: 'center',
        slots: { customRender: 'actions' }
      }
    ]); ;

    function fetchRemoteServers () {
      state.loading = true;

      RemoteServerAPIClient.listRemoteServers()
        .then(remoteServers => {
          state.list = remoteServers;
        })
        .finally(() => {
          state.loading = false;
        });
    };

    function onSuccess () {
      state.showLDAPModal = false;

      fetchRemoteServers();
    }

    async function onDeleteConfirmation (target: RemoteServer, abort: boolean) {
      if (abort) {
        return;
      }

      try {
        await RemoteServerAPIClient.deleteRemoteServer(target.uuid);

        message.success(t('MESSAGES.DELETE_SUCCESS'));
      } catch (error) {
        message.error(t('MESSAGES.DELETE_FAILURE'));
      } finally {
        fetchRemoteServers();
      }
    }

    function openAssociatedDomainsModal (target: RemoteServer) {
      state.target = target;
      state.showDomainsModal = true;
    }

    function openEditModal (remoteServer: RemoteServer) {
      state.target = remoteServer;
      state.showLDAPModal = true;
    };

    function openCreateModal (duplicateTarget?: RemoteServer) {
      if (duplicateTarget) {
        state.target = { ...duplicateTarget, uuid: '', name: '' };
      } else {
        state.target = {};
      }
      state.showLDAPModal = true;
    }

    async function openDeleteModal (target: RemoteServer) {
      const usedInDomains = !!(await RemoteServerAPIClient.getAssociatedDomains(target.uuid)).length;

      Modal[usedInDomains ? 'info' : 'confirm']({
        title: () => t('GENERAL.DELETION'),
        icon: () => createVNode(ExclamationCircleOutlined),
        content: () => usedInDomains ? t('REMOTE_SERVER.DELETE_ABORT') : t('REMOTE_SERVER.DELETE_CONFIRM'),
        okText: () => usedInDomains ? t('GENERAL.OK') : t('GENERAL.DELETE'),
        cancelText: () => t('GENERAL.CANCEL'),
        onOk: () => onDeleteConfirmation(target, usedInDomains)
      });
    }

    onMounted(fetchRemoteServers);

    return {
      availableForCurrentDomain,
      breadcrumbs,
      columns,
      onSuccess,
      openAssociatedDomainsModal,
      openDeleteModal,
      openEditModal,
      openCreateModal,
      state,
      filteredList: computed(() => state.list.filter(server => server.name.toLowerCase().includes(state.filterText.toLowerCase())))
    };
  }
});
</script>

<style lang="less" scoped>
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  .danger {
    color: @error-color;
  }
</style>
