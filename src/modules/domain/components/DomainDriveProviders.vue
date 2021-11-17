<template>
  <div
    v-if="state.status === 'loading'"
    class="spinner"
  >
    <a-spin />
  </div>

  <div v-if="state.status === 'loaded'">
    <a-result
      v-if="!state.provider.uuid && !state.provider.type"
      :title="$t('DRIVE_PROVIDER.EMPTY_MESSAGE')"
    >
      <template #extra>
        <a-button
          type="primary"
          @click="state.provider.type = 'LDAP_PROVIDER'"
        >
          {{ $t('DRIVE_PROVIDER.CREATE') }}
        </a-button>
      </template>
    </a-result>

    <a-row v-else>
      <a-col
        :xl="{ span: 12, offset: 6 }"
        :sm="{ span: 24 }"
      >
        <DomainDriveProviderLDAPForm
          v-if="state.provider.type === 'LDAP_PROVIDER'"
          :provider="state.provider"
          :servers-list="state.ldapServers"
          :filters-list="state.groupFilters"
          :domain="currentDomain"
          @cancel="() => setProvider(EMPTY_PROVIDER)"
          @deleted="() => setProvider(EMPTY_PROVIDER)"
          @submitted="provider => setProvider(provider)"
        />
      </a-col>
    </a-row>
  </div>

  <div v-if="state.status === 'error'">
    <a-result
      status="error"
      :title="$t('DRIVE_PROVIDER.ERROR_MESSAGE')"
    >
      <template #extra>
        <a-button
          type="primary"
          @click="prepareData()"
        >
          {{ $t('GENERAL.TRY_AGAIN') }}
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang='ts' setup>
import {
  computed,
  reactive,
  onMounted,
  watchEffect
} from 'vue';
import { useStore } from 'vuex';
import DomainDriveProviderLDAPForm from './DomainDriveProviderLDAPForm.vue';
import { getDriveProviders } from '../services/domain-api';
import { LDAPDriveProvider, EMPTY_PROVIDER } from '../types/DriveProvider';
import { listRemoteServers } from '@/modules/remote-server/services/remote-server-api';
import RemoteServer from '@/modules/remote-server/types/RemoteServer';
import { LDAPDriveFilter } from '@/modules/drive-filter/types/DriveFilters';
import { listDriveFilters } from '@/modules/drive-filter/services/drive-filter-api';

interface State {
  status?: 'loading' | 'loaded' | 'error';
  provider: LDAPDriveProvider;
  ldapServers: RemoteServer[];
  groupFilters: LDAPDriveFilter[];
}

const store = useStore();
const currentDomain = computed(() => store.getters['Domain/getCurrentDomain']);
const state = reactive<State>({
  provider: { ...EMPTY_PROVIDER },
  ldapServers: [],
  groupFilters: []
});

function setProvider (provider: LDAPDriveProvider) {
  state.provider = { ...provider };
}

async function prepareLDAPServers () {
  const servers = await listRemoteServers();

  state.ldapServers = servers.filter(server => server.serverType === 'LDAP');
}

async function prepareGroupFilters () {
  const filters = await listDriveFilters();

  state.groupFilters = filters.filter(filter => filter.type === 'LDAP');
}

async function prepareUserProvider () {
  const providers = await getDriveProviders(currentDomain.value.uuid);

  state.provider = providers[0] || { ...EMPTY_PROVIDER };
}

async function prepareData () {
  state.status = 'loading';

  try {
    await prepareLDAPServers();
    await prepareGroupFilters();

    state.status = 'loaded';
  } catch (error) {
    state.status = 'error';
  }
}

onMounted(prepareData);

watchEffect(async () => {
  if (currentDomain.value.uuid) {
    state.status = 'loading';

    try {
      await prepareUserProvider();
      state.status = 'loaded';
    } catch (error) {
      state.status = 'error';
    }
  }
});
</script>

<style class='less' scoped>
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
