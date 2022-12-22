<template>
  <div v-if="state.status === 'loading'" class="spinner">
    <a-spin />
  </div>
  <router-link :to="{ name: 'ConfigurationDomainProviders' }">
    <ArrowLeftIcon></ArrowLeftIcon>
  </router-link>
  <div v-if="state.status === 'loaded'">
    <a-result v-if="!state.provider.uuid && !state.provider.type" :title="$t('GROUP_PROVIDER.EMPTY_MESSAGE')">
      <template #extra>
        <a-button type="primary" @click="state.provider.type = 'LDAP_PROVIDER'">
          {{ $t('GROUP_PROVIDER.CREATE') }}
        </a-button>
      </template>
    </a-result>

    <a-row v-else>
      <a-col :xl="{ span: 12, offset: 6 }" :sm="{ span: 24 }">
        <DomainGroupProviderLDAPForm
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
    <a-result status="error" :title="$t('GROUP_PROVIDER.ERROR_MESSAGE')">
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
import DomainGroupProviderLDAPForm from './domain-group-provider-ldap-form.vue';
import { getGroupProviders } from '../services/providers-api';
import { LDAPGroupProvider, EMPTY_PROVIDER } from '../types/GroupProvider';
import { listRemoteServers } from '@/modules/configuration/pages/remote-servers/services/remote-server-api';
import RemoteServer from '@/modules/configuration/pages/remote-servers/types/RemoteServer';
import { LDAPGroupFilter } from '@/modules/configuration/pages/remote-filters/types/GroupFilters';
import { listGroupFilters } from '@/modules/configuration/pages/remote-filters/services/group-filter-api';
import StatusValue from '@/core/types/Status';
import { storeToRefs } from 'pinia';
import ArrowLeftIcon from '@/core/components/icons/arrow-left-icon.vue';

interface State {
  status?: 'loading' | 'loaded' | 'error';
  provider: LDAPGroupProvider;
  ldapServers: RemoteServer[];
  groupFilters: LDAPGroupFilter[];
}

const domainStore = useDomainStore();
const { currentDomain, getStatus } = storeToRefs(domainStore);
const currentDomainStatus = computed<StatusValue>(() => getStatus.value('currentDomain'));

const state = reactive<State>({
  provider: { ...EMPTY_PROVIDER },
  ldapServers: [],
  groupFilters: [],
});

function setProvider(provider: LDAPGroupProvider) {
  state.provider = { ...provider };
}

async function prepareLDAPServers() {
  const servers = await listRemoteServers();

  state.ldapServers = servers.filter((server) => server.serverType === 'LDAP');
}

async function prepareGroupFilters() {
  const filters = await listGroupFilters();

  state.groupFilters = filters.filter((filter) => filter.type === 'LDAP');
}

async function prepareGroupProviders() {
  const providers = await getGroupProviders(currentDomain.value.uuid);

  state.provider = providers[0] || { ...EMPTY_PROVIDER };
}

async function prepareData() {
  state.status = 'loading';

  try {
    await prepareLDAPServers();
    await prepareGroupFilters();
    await prepareGroupProviders();

    state.status = 'loaded';
  } catch (error) {
    state.status = 'error';
  }
}

onMounted(prepareData);

watch(currentDomainStatus, async (status: StatusValue) => {
  if (status === StatusValue.LOADING) {
    state.status = 'loading';

    try {
      await prepareGroupProviders();

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

.empty-provider {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
