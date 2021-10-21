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
      :title="$t('USER_PROVIDER.EMPTY_MESSAGE')"
    >
      <template #extra>
        <a-dropdown :trigger="['click']">
          <a-button type="primary">
            {{ $t('USER_PROVIDER.CREATE') }}
          </a-button>

          <template #overlay>
            <a-menu>
              <a-menu-item @click="state.provider.type = 'LDAP_PROVIDER'">
                {{ $t('USER_PROVIDER.TYPES.LDAP') }}
              </a-menu-item>
              <a-menu-item disabled>
                {{ $t('USER_PROVIDER.TYPES.OIDC') }}
              </a-menu-item>
              <a-menu-item disabled>
                {{ $t('USER_PROVIDER.TYPES.TWAKE') }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-result>

    <a-row>
      <a-col
        :xl="{ span: 12, offset: 6 }"
        :sm="{ span: 24 }"
      >
        <DomainUserProviderLDAPForm
          v-if="state.provider.type === 'LDAP_PROVIDER'"
          :provider="state.provider"
          :servers-list="state.ldapServers"
          :filters-list="state.userFilters"
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
      :title="$t('USER_PROVIDER.ERROR_MESSAGE')"
    >
      <template #extra>
        <a-button
          type="primary"
          @click="prepareData()"
        >
          {{ $t('USER_PROVIDER.TRY_AGAIN') }}
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
import PageTitle from '@/core/components/PageTitle.vue';
import DomainUserProviderLDAPForm from './DomainUserProviderLDAPForm.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import DomainAPIClient from '../services/DomainAPIClient';
import LDAPUserProvider, { EMPTY_PROVIDER } from '../type/LDAPUserProvider';
import RemoteServerAPICLient from '@/modules/remote-server/services/RemoteServerAPICLient';
import RemoteServer, { RemoteServerType } from '@/modules/remote-server/types/RemoteServer';
import UserFilter, { USER_FILTER_TYPE } from '@/modules/user-filter/types/UserFilter';
import UserFilterAPIClient from '@/modules/user-filter/services/UserFilterAPIClient';

interface State {
  status?: 'loading' | 'loaded' | 'error';
  provider: LDAPUserProvider;
  ldapServers: RemoteServer[];
  userFilters: UserFilter[];
}

const store = useStore();
const { breadcrumbs } = useBreadcrumbs();
const currentDomain = computed(() => store.getters['Domain/getCurrentDomain']);
const state = reactive<State>({
  provider: { ...EMPTY_PROVIDER },
  ldapServers: [],
  userFilters: []
});

function setProvider (provider: LDAPUserProvider) {
  state.provider = { ...provider };
}

async function prepareLDAPServers () {
  const servers = await RemoteServerAPICLient.listRemoteServers();

  state.ldapServers = servers.filter(server => server.serverType === RemoteServerType.LDAP);
}

async function prepareUserFilters () {
  const filters = await UserFilterAPIClient.listUserFilters();

  state.userFilters = filters.filter(filter => filter.type === USER_FILTER_TYPE.LDAP);
}

async function prepareUserProvider () {
  const providers = await DomainAPIClient.getUserProviders(currentDomain.value.uuid);

  state.provider = providers[0] || { ...EMPTY_PROVIDER };
}

async function prepareData () {
  state.status = 'loading';

  try {
    await prepareLDAPServers();
    await prepareUserFilters();

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
