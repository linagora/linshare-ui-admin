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
      :sub-title="currentDomain.type === DOMAIN_TYPE.GUEST && $t('USER_PROVIDER.EMPTY_MESSAGE_GUEST_DOMAIN')"
    >
      <template #extra>
        <a-button
          v-if="currentDomain.type === DOMAIN_TYPE.GUEST"
          type="primary"
          @click="state.provider.type = 'TWAKE_GUEST_PROVIDER'"
        >
          {{ $t('USER_PROVIDER.CREATE_TWAKE_PROVIDER') }}
        </a-button>

        <a-dropdown
          v-else
          :trigger="['click']"
        >
          <a-button type="primary">
            {{ $t('USER_PROVIDER.CREATE') }}
          </a-button>

          <template #overlay>
            <a-menu>
              <a-menu-item @click="state.provider.type = 'LDAP_PROVIDER'">
                {{ $t('USER_PROVIDER.TYPES.LDAP') }}
              </a-menu-item>
              <a-menu-item @click="state.provider.type = 'OIDC_PROVIDER'">
                {{ $t('USER_PROVIDER.TYPES.OIDC') }}
              </a-menu-item>
              <a-menu-item @click="state.provider.type = 'TWAKE_PROVIDER'">
                {{ $t('USER_PROVIDER.TYPES.TWAKE') }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-result>

    <a-row v-else>
      <a-col
        :xl="{ span: 12, offset: 6 }"
        :sm="{ span: 24 }"
      >
        <DomainUserProviderLDAPForm
          v-if="state.provider.type === 'LDAP_PROVIDER'"
          :provider="state.provider"
          :servers-list="state.servers.filter(server => server.serverType === 'LDAP')"
          :filters-list="state.userFilters"
          :domain="currentDomain"
          @cancel="() => setProvider(EMPTY_PROVIDER)"
          @deleted="() => setProvider(EMPTY_PROVIDER)"
          @submitted="provider => setProvider(provider)"
        />

        <DomainUserProviderOIDCForm
          v-if="state.provider.type === 'OIDC_PROVIDER'"
          :provider="state.provider"
          :domain="currentDomain"
          @cancel="() => setProvider(EMPTY_PROVIDER)"
          @deleted="() => setProvider(EMPTY_PROVIDER)"
          @submitted="provider => setProvider(provider)"
        />

        <DomainUserProviderTwakeForm
          v-if="state.provider.type === 'TWAKE_PROVIDER' || state.provider.type === 'TWAKE_GUEST_PROVIDER'"
          :servers-list="state.servers.filter(server => server.serverType === 'TWAKE')"
          :provider="state.provider"
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
  watchEffect,
  watch
} from 'vue';
import { useStore } from 'vuex';
import DomainUserProviderLDAPForm from './DomainUserProviderLDAPForm.vue';
import DomainUserProviderOIDCForm from './DomainUserProviderOIDCForm.vue';
import DomainUserProviderTwakeForm from './DomainUserProviderTwakeForm.vue';
import { getUserProviders } from '../services/domain-api';
import {
  LDAPUserProvider,
  OIDCUserProvider,
  EMPTY_PROVIDER,
  TwakeUserProvider
} from '../types/UserProvider';
import { listRemoteServers } from '@/modules/remote-server/services/remote-server-api';
import RemoteServer from '@/modules/remote-server/types/RemoteServer';
import UserFilter, { USER_FILTER_TYPE } from '@/modules/remote-filter/types/UserFilter';
import { listUserFilters } from '@/modules/remote-filter/services/user-filter-api';
import Domain, { DOMAIN_TYPE } from '../types/Domain';
import StatusValue from '@/core/types/Status';

interface State {
  status?: 'loading' | 'loaded' | 'error';
  provider: LDAPUserProvider | OIDCUserProvider | TwakeUserProvider;
  servers: RemoteServer[];
  userFilters: UserFilter[];
}

const store = useStore();
const currentDomain = computed<Domain>(() => store.getters['Domain/getCurrentDomain']);
const currentDomainStatus = computed<StatusValue>(() => store.getters['Domain/getStatus']('currentDomain'));

const state = reactive<State>({
  provider: { ...EMPTY_PROVIDER },
  servers: [],
  userFilters: []
});

function setProvider (provider: LDAPUserProvider) {
  state.provider = { ...provider };
}

async function prepareServers () {
  state.servers = await listRemoteServers();
}

async function prepareUserFilters () {
  const filters = await listUserFilters();

  state.userFilters = filters.filter(filter => filter.type === USER_FILTER_TYPE.LDAP);
}

async function prepareUserProvider () {
  const providers = await getUserProviders(currentDomain.value.uuid);

  state.provider = providers[0] || { ...EMPTY_PROVIDER };
}

async function prepareData () {
  state.status = 'loading';

  try {
    await prepareServers();
    await prepareUserFilters();

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
</style>
