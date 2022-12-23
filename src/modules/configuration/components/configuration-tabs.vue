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
import { computed, ref, watch } from 'vue';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import { useRoute, useRouter } from 'vue-router';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';

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

const { redirect } = useLegacyFeatures();
const router = useRouter();
const route = useRoute();
const activeKey = ref('ConfigurationDomainDetail');
const configurationTabs = {
  ConfigurationDomainDetail: {
    key: 'DETAILS',
    name: 'ConfigurationDomainDetail',
    title: 'NAVIGATOR.DETAILS',
    route: {
      name: 'ConfigurationDomainDetail',
      requiresCurrentDomain: true,
    },
  },
  ConfigurationDomainParameters: {
    key: 'PARAMETERS',
    name: 'ConfigurationDomainParameters',
    title: 'NAVIGATOR.PARAMETERS',
    route: {
      name: 'ConfigurationDomainParameters',
      requiresCurrentDomain: true,
    },
  },
  TypeMinePolicies: {
    title: 'NAVIGATOR.TYPE_MIME',
    legacy: true,
    key: 'TYPE_MIME_POLICIES',
    name: 'TypeMinePolicies',
  },
  ConfigurationDomainWelcomeMessages: {
    title: 'NAVIGATOR.WELCOME_MESSAGES',
    route: {
      name: 'ConfigurationDomainWelcomeMessages',
      requiresCurrentDomain: true,
    },
    key: 'WELCOME_MESSAGES',
    name: 'ConfigurationDomainWelcomeMessages',
  },
  ConfigurationDomainQuota: {
    title: 'NAVIGATOR.QUOTA',
    route: {
      name: 'ConfigurationDomainQuota',
      requiresCurrentDomain: true,
    },
    legacy: true,
    key: 'QUOTA',
    name: 'ConfigurationDomainQuota',
  },
  ConfigurationDomainRemoteServers: {
    key: 'REMOTE_SERVERS',
    title: 'NAVIGATOR.REMOTE_SERVERS',
    name: 'ConfigurationDomainRemoteServers',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'ConfigurationDomainRemoteServers',
    },
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
  },
  ConfigurationDomainRemoteFilters: {
    key: 'REMOTE_FILTERS',
    name: 'ConfigurationDomainRemoteFilters',
    title: 'NAVIGATOR.REMOTE_FILTERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'ConfigurationDomainRemoteFilters',
    },
  },
  PublicKeysJwt: {
    title: 'NAVIGATOR.PUBLIC_KEYS',
    key: 'PUBLIC_KEYS_JWT',
    name: 'PublicKeysJwt',
    legacy: true,
  },
};

const configurationTabsArray = computed(() => {
  return Object.values(configurationTabs);
});
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
      activeKey.value = name.toString();
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
