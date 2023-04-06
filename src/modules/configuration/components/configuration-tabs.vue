<template>
  <div class="configuration-tabs">
    <a-tabs v-model:activeKey="activeKey" class="tabs" @tab-click="onSelectTab">
      <a-tab-pane
        v-for="configuration in configurationTabsArray"
        :key="configuration.name"
        :tab="$t(configuration.title)"
      >
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDomainStore } from '@/modules/domain/store';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';

interface ConfigurationPage {
  key: string;
  name: string;
  title: string;
  legacy?: boolean;
  sub?: boolean;
  route?: {
    name: string;
    requiresCurrentDomain?: boolean;
  };
  accessibility?: {
    domainTypes?: DOMAIN_TYPE[];
    userRoles?: ACCOUNT_ROLE[];
  };
}

// hooks
const { redirect } = useLegacyFeatures();
const authStore = useAuthStore();
const { breadcrumbs } = useBreadcrumbs();
const domainStore = useDomainStore();
const router = useRouter();
const route = useRoute();
const { loggedUserRole } = storeToRefs(authStore);
// computed
const configurationTabsArray = computed(() => {
  const tabs = Object.values(configurationTabs);
  return tabs.filter((item) => item.visible);
});
const isSelectingRootDomain = computed(() => {
  return domainStore.currentDomain?.type === DOMAIN_TYPE.ROOT;
});

const activeKey = ref('ConfigurationDomainDetail');
const configurationTabs = reactive({
  ConfigurationDomainDetail: {
    key: 'DETAILS',
    name: 'ConfigurationDomainDetail',
    title: 'NAVIGATOR.DETAILS',
    route: {
      name: 'ConfigurationDomainDetail',
      requiresCurrentDomain: true,
    },
    visible: true,
  },
  ConfigurationDomainParameters: {
    key: 'PARAMETERS',
    name: 'ConfigurationDomainParameters',
    title: 'NAVIGATOR.PARAMETERS',
    route: {
      name: 'ConfigurationDomainParameters',
      requiresCurrentDomain: true,
    },
    visible: true,
  },
  ConfigurationDomainTypeMimePolicies: {
    title: 'NAVIGATOR.TYPE_MIME',
    legacy: false,
    route: {
      name: 'ConfigurationDomainTypeMimePolicies',
      requiresCurrentDomain: true,
    },
    key: 'TYPE_MIME_POLICIES',
    name: 'ConfigurationDomainTypeMimePolicies',
    visible: true,
  },
  ConfigurationDomainWelcomeMessages: {
    title: 'NAVIGATOR.WELCOME_MESSAGES',
    route: {
      name: 'ConfigurationDomainWelcomeMessages',
      requiresCurrentDomain: true,
    },
    key: 'WELCOME_MESSAGES',
    name: 'ConfigurationDomainWelcomeMessages',
    visible: true,
  },
  ConfigurationDomainQuota: {
    title: 'NAVIGATOR.QUOTA',
    route: {
      name: 'ConfigurationDomainQuota',
      requiresCurrentDomain: true,
    },
    legacy: false,
    key: 'QUOTA',
    name: 'ConfigurationDomainQuota',
    visible: computed(() => {
      return loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN;
    }),
  },
  ConfigurationDomainRemoteServers: {
    key: 'REMOTE_SERVERS',
    title: 'NAVIGATOR.REMOTE_SERVERS',
    name: 'ConfigurationDomainRemoteServers',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'ConfigurationDomainRemoteServers',
    },
    visible: computed(() => {
      return loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN;
    }),
  },
  ConfigurationDomainProviders: {
    key: 'PROVIDERS',
    name: 'ConfigurationDomainProviders',
    title: 'NAVIGATOR.PROVIDERS',
    accessibility: {
      domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB, DOMAIN_TYPE.GUEST],
      userRoles: [ACCOUNT_ROLE.SUPERADMIN],
    },
    route: {
      name: 'ConfigurationDomainProviders',
      requiresCurrentDomain: true,
    },
    visible: computed(() => {
      return !isSelectingRootDomain.value && loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN;
    }),
  },
  ConfigurationDomainRemoteFilters: {
    key: 'REMOTE_FILTERS',
    name: 'ConfigurationDomainRemoteFilters',
    title: 'NAVIGATOR.REMOTE_FILTERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'ConfigurationDomainRemoteFilters',
    },
    visible: computed(() => {
      return loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN;
    }),
  },
  PublicKeysJwt: {
    title: 'NAVIGATOR.PUBLIC_KEYS',
    key: 'PUBLIC_KEYS_JWT',
    name: 'PublicKeysJwt',
    legacy: true,
    visible: true,
  },
});

//methods
function onSelectTab(tab: string) {
  const activeTab = configurationTabs[tab as keyof typeof configurationTabs] as ConfigurationPage;
  if (activeTab?.route && !activeTab?.legacy) {
    router.push(activeTab?.route);
  } else if (activeTab?.legacy) {
    redirect(activeTab?.title);
  }
}

// hooks
watch(
  () => route.name,
  (name) => {
    if (name) {
      configurationTabsArray.value?.forEach((element) => {
        const matchingRouter = breadcrumbs.value.find((item) => {
          return item.path === element?.name;
        });
        if (matchingRouter) {
          activeKey.value = matchingRouter.path;
          return;
        }
      });
    }
  },
  { immediate: true }
);
</script>
<style lang="less">
.configuration-tabs {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .tabs {
    max-width: 100%;
  }

  .tabs .ant-tabs-nav::before {
    border-bottom: none !important;
    border-color: transparent !important;
  }
}
</style>
