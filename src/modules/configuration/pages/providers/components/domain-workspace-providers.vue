<template>
  <div v-if="state.status === 'loading'" class="spinner">
    <a-spin />
  </div>
  <router-link :to="{ name: 'ConfigurationDomainProviders' }">
    <ArrowLeftIcon></ArrowLeftIcon>
  </router-link>
  <div v-if="state.status === 'loaded'">
    <a-result v-if="!state.provider.uuid && !state.provider.type" :title="$t('WORKSPACE_PROVIDER.EMPTY_MESSAGE')">
      <template #extra>
        <a-button type="primary" @click="state.provider.type = 'LDAP_PROVIDER'">
          {{ $t('WORKSPACE_PROVIDER.CREATE') }}
        </a-button>
      </template>
    </a-result>

    <a-row v-else>
      <a-col :xl="{ span: 12, offset: 6 }" :sm="{ span: 24 }">
        <DomainWorkspaceProviderLDAPForm
          v-if="state.provider.type === 'LDAP_PROVIDER'"
          :provider="state.provider"
          :servers-list="state.ldapServers"
          :filters-list="state.groupFilters"
          :domain="currentDomain"
          @cancel="() => setProvider(EMPTY_PROVIDER)"
          @deleted="() => setProvider(EMPTY_PROVIDER)"
          @submitted="(provider) => setProvider(provider)"
        />
      </a-col>
    </a-row>
  </div>

  <div v-if="state.status === 'error'">
    <a-result status="error" :title="$t('WORKSPACE_PROVIDER.ERROR_MESSAGE')">
      <template #extra>
        <a-button type="primary" @click="prepareData()">
          {{ $t('GENERAL.TRY_AGAIN') }}
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, watch } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import DomainWorkspaceProviderLDAPForm from './domain-workspace-provider-ldap-form.vue';
import { getWorkspaceProviders } from '../services/providers-api';
import { listRemoteServers } from '@/modules/configuration/pages/remote-servers/services/remote-server-api';
import { listWorkspaceFilters } from '@/modules/configuration/pages/remote-filters/services/workspace-filter-api';
import { LDAPWorkspaceFilter } from '@/modules/configuration/pages/remote-filters/types/WorkspaceFilters';
import RemoteServer from '@/modules/configuration/pages/remote-servers/types/RemoteServer';
import { LDAPWorkspaceProvider, EMPTY_PROVIDER } from '../types/WorkspaceProvider';
import { STATUS } from '@/core/types/Status';
import ArrowLeftIcon from '@/core/components/icons/arrow-left-icon.vue';
import { useRouter } from 'vue-router';
import useProviders from '../hooks/use-providers';

interface State {
  status?: 'loading' | 'loaded' | 'error';
  provider: LDAPWorkspaceProvider;
  ldapServers: RemoteServer[];
  groupFilters: LDAPWorkspaceFilter[];
}

const domainStore = useDomainStore();
const { currentRoute, push } = useRouter();
const { isPageAccessible } = useProviders();
const currentDomain = domainStore.currentDomain;
const currentDomainStatus = computed<STATUS>(() => domainStore.getStatus('currentDomain'));

const state = reactive<State>({
  provider: { ...EMPTY_PROVIDER },
  ldapServers: [],
  groupFilters: [],
});

function setProvider(provider: LDAPWorkspaceProvider) {
  state.provider = { ...provider };
}

async function prepareLDAPServers() {
  const servers = await listRemoteServers();

  state.ldapServers = servers.filter((server) => server.serverType === 'LDAP');
}

async function prepareGroupFilters() {
  const filters = await listWorkspaceFilters();

  state.groupFilters = filters.filter((filter) => filter.type === 'LDAP');
}

async function prepareWorkspaceProviders() {
  const providers = await getWorkspaceProviders(currentDomain.uuid);

  state.provider = providers[0] || { ...EMPTY_PROVIDER };
}

async function prepareData() {
  state.status = 'loading';

  try {
    await prepareLDAPServers();
    await prepareGroupFilters();
    await prepareWorkspaceProviders();

    state.status = 'loaded';
  } catch (error) {
    state.status = 'error';
  }
}

onMounted(prepareData);

watch(
  () => currentRoute.value.fullPath,
  () => {
    if (!isPageAccessible('DomainWorkspaceProviders')) {
      push({
        name: 'ConfigurationDomainDetail',
        params: { ...currentRoute.value.params },
      });
    }
  }
);

watch(currentDomainStatus, async (status: STATUS) => {
  if (status === STATUS.LOADING) {
    state.status = 'loading';

    try {
      await prepareWorkspaceProviders();

      state.status = 'loaded';
    } catch (error) {
      state.status = 'error';
    }
  }
});
</script>

<style class="less" scoped>
.spinner {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
