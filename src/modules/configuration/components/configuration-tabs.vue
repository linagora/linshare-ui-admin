<template>
  <div class="configuration-tabs">
    <a-tabs v-model:activeKey="activeKey" class="tabs" @tab-click="onSelectTab">
      <a-tab-pane v-for="configuration in configurationTabsArray" :key="configuration.key" :tab="configuration.name">
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import { useRouter } from 'vue-router';
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
const activeKey = ref('DETAILS');
const configurationTabs = {
  DETAILS: {
    key: 'DETAILS',
    name: 'Details',
    title: 'NAVIGATOR.DETAILS',
    route: {
      name: 'ConfigurationDomainDetail',
      requiresCurrentDomain: true,
    },
  },
  PARAMETERS: {
    key: 'PARAMETERS',
    name: 'Parameters',
    title: 'NAVIGATOR.PARAMETERS',
    route: {
      name: 'ConfigurationDomainParameters',
      requiresCurrentDomain: true,
    },
  },
  TYPE_MIME_POLICIES: {
    title: 'NAVIGATOR.TYPE_MIME',
    legacy: true,
    key: 'TYPE_MIME_POLICIES',
    name: 'Type mime policies',
  },
  WELCOME_MESSAGES: {
    title: 'NAVIGATOR.WELCOME_MESSAGES',
    route: {
      name: 'ConfigurationDomainWelcomeMessages',
      requiresCurrentDomain: true,
    },
    key: 'WELCOME_MESSAGES',
    name: 'Welcome messages',
  },
  QUOTA: {
    title: 'NAVIGATOR.QUOTA',
    route: {
      name: 'ConfigurationDomainQuota',
      requiresCurrentDomain: true,
    },
    key: 'QUOTA',
    name: 'Quota',
  },
  REMOTE_SERVERS: {
    key: 'REMOTE_SERVERS',
    title: 'NAVIGATOR.REMOTE_SERVERS',
    name: 'Remote Servers',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'ConfigurationDomainRemoteServers',
    },
  },
  PROVIDERS: {
    key: 'PROVIDERS',
    name: 'Providers',
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
  REMOTE_FILTERS: {
    key: 'REMOTE_FILTERS',
    name: 'Remote Filters List',
    title: 'NAVIGATOR.REMOTE_FILTERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'ConfigurationDomainRemoteFilters',
    },
  },
  PUBLIC_KEYS_JWT: {
    title: 'NAVIGATOR.PUBLIC_KEYS',
    key: 'PUBLIC_KEYS_JWT',
    name: 'Public keys (JWT)',
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
