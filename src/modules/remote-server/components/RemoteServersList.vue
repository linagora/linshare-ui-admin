<template>
  <PageTitle
    :title="$t('NAVIGATOR.REMOTE_SERVERS')"
    :breadcrumbs="breadcrumbs"
  >
  </PageTitle>

  <div>
    <div class="actions">
      <a-dropdown :trigger="['click']">
        <a-button :disabled="state.loading" type="primary">
          <template #icon><PlusCircleOutlined /></template>
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
      :dataSource="state.list"
      :loading="state.loading"
      rowKey="uuid"
    >
      <template #date="{ text }">
        {{ $d(text, 'mediumDate') }}
      </template>

      <template #actions="{ record }">
        <a-dropdown :trigger="['click']">
          <EllipsisOutlined style="font-size: 16px"/>
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
              <a-menu-item>
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
    @cancel="onCancel"
  />

  <RemoteServerAssociatedDomainsModal
    :visible="state.showDomainsModal"
    :data="state.target"
    @ok="onOk"
  />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import RemoteServerAPIClient from '../services/RemoteServerAPICLient';
import RemoteServer from '../types/RemoteServer';

import PageTitle from '@/core/components/PageTitle.vue';
import RemoteServerLDAPModal from '../components/RemoteServerLDAPModal.vue';
import RemoteServerAssociatedDomainsModal from '../components/RemoteServerAssociatedDomainsModal.vue';
import { PlusCircleOutlined, EllipsisOutlined } from '@ant-design/icons-vue';

interface RemoteServersListState {
  loading: boolean;
  showLDAPModal: boolean;
  showDomainsModal: boolean;
  list: RemoteServer[];
  target: RemoteServer | {};
}

export default defineComponent({
  name: 'RemoteServersList',
  components: {
    EllipsisOutlined,
    PageTitle,
    PlusCircleOutlined,
    RemoteServerLDAPModal,
    RemoteServerAssociatedDomainsModal
  },
  setup () {
    const { t } = useI18n();
    const { breadcrumbs } = useBreadcrumbs();
    const state = reactive<RemoteServersListState>({
      loading: true,
      showLDAPModal: false,
      showDomainsModal: false,
      list: [],
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

    function onCancel () {
      state.showLDAPModal = false;
    }

    function onOk () {
      state.showDomainsModal = false;
    }

    function onSuccess () {
      state.showLDAPModal = false;

      fetchRemoteServers();
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

    onMounted(fetchRemoteServers);

    return {
      breadcrumbs,
      columns,
      onCancel,
      onSuccess,
      onOk,
      openAssociatedDomainsModal,
      openEditModal,
      openCreateModal,
      state
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
