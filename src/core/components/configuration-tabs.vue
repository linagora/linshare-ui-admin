<template>
  <a-tabs v-model:activeKey="activeKey" @tab-click="onSelectTab">
    <a-tab-pane v-for="configuration in configurationTabsArray" :key="configuration.key" :tab="configuration.name">
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import { useRouter } from 'vue-router';
import useLegacyFeatures from '../hooks/useLegacyFeatures';

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
const activeKey = ref('QUOTA');
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
      name: 'DomainFunctionalities',
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
      name: 'WelcomeMessages',
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
      name: 'RemoteServersList',
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
      name: 'DomainProviders',
      requiresCurrentDomain: true,
    },
  },
  PROVIDERS_MANAGEMENT: {
    key: 'PROVIDERS_MANAGEMENT',
    name: 'Domain Provider Management',
    title: 'NAVIGATOR.PROVIDERS',
    accessibility: {
      domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB, DOMAIN_TYPE.GUEST],
      userRoles: [ACCOUNT_ROLE.SUPERADMIN],
    },
    route: {
      name: 'DomainProviderManagement',
      requiresCurrentDomain: true,
    },
    sub: true,
  },
  USER_PROVIDERS: {
    key: 'USER_PROVIDERS',
    name: 'Domain User Providers',
    title: 'NAVIGATOR.USER_PROVIDERS',
    accessibility: {
      domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB, DOMAIN_TYPE.GUEST],
      userRoles: [ACCOUNT_ROLE.SUPERADMIN],
    },
    route: {
      name: 'DomainUserProviders',
      requiresCurrentDomain: true,
    },
    sub: true,
  },
  GROUP_PROVIDERS: {
    key: 'GROUP_PROVIDERS',
    name: 'Domain Group Providers',
    title: 'NAVIGATOR.GROUP_PROVIDERS',
    accessibility: {
      domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB],
      userRoles: [ACCOUNT_ROLE.SUPERADMIN],
    },
    route: {
      name: 'DomainGroupProviders',
      requiresCurrentDomain: true,
    },
    sub: true,
  },
  WORKSPACE_PROVIDERS: {
    key: 'WORKSPACE_PROVIDERS',
    name: 'Domain Workspace Providers',
    title: 'NAVIGATOR.WORKSPACE_PROVIDERS',
    accessibility: {
      domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB],
      userRoles: [ACCOUNT_ROLE.SUPERADMIN],
    },
    route: {
      name: 'DomainWorkspaceProviders',
      requiresCurrentDomain: true,
    },
    sub: true,
  },
  REMOTE_FILTERS: {
    key: 'REMOTE_FILTERS',
    name: 'Remote Filters List',
    title: 'NAVIGATOR.REMOTE_FILTERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'RemoteFiltersList',
    },
  },
  PUBLIC_KEYS_JWT: {
    title: 'NAVIGATOR.PUBLIC_KEYS',
    key: 'PUBLIC_KEYS_JWT',
    name: 'Public keys (JWT)',
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
