<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane v-for="configuration in configurationTabs" :key="configuration.key" :tab="configuration.name">
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';

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

const activeKey = ref('QUOTA');
const configurationTabs: ConfigurationPage[] = [
  {
    key: 'DETAILS',
    name: 'Details',
    title: 'NAVIGATOR.DETAILS',
    route: {
      name: 'DomainDetails',
      requiresCurrentDomain: true,
    },
  },
  {
    key: 'REMOTE_SERVERS',
    title: 'NAVIGATOR.REMOTE_SERVERS',
    name: 'Remote Servers',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'RemoteServersList',
    },
  },
  {
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
  {
    key: 'PROVIDERS',
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
  {
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
  {
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
  {
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
  {
    key: 'REMOTE_FILTERS',
    name: 'Remote Filters List',
    title: 'NAVIGATOR.REMOTE_FILTERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'RemoteFiltersList',
    },
  },
  {
    key: 'PARAMETERS',
    name: 'Parameters',
    title: 'NAVIGATOR.PARAMETERS',
    route: {
      name: 'DomainFunctionalities',
      requiresCurrentDomain: true,
    },
  },
  {
    title: 'NAVIGATOR.TYPE_MIME',
    legacy: true,
    key: 'TYPE_MIME_POLICIES',
    name: 'Type mime policies',
  },
  {
    title: 'NAVIGATOR.WELCOME_MESSAGES',
    route: {
      name: 'WelcomeMessages',
      requiresCurrentDomain: true,
    },
    key: 'WELCOME_MESSAGES',
    name: 'Welcome messages',
  },
  {
    title: 'NAVIGATOR.QUOTA',
    route: {
      name: 'WelcomeMessages',
      requiresCurrentDomain: true,
    },
    key: 'QUOTA',
    name: 'Quota',
  },
  {
    title: 'NAVIGATOR.PUBLIC_KEYS',
    key: 'PUBLIC_KEYS_JWT',
    name: 'Public keys (JWT)',
  },
];
</script>
