import { RouteRecordRaw } from 'vue-router';
import RemoteServersPage from '../pages/remote-servers-page.vue';
export const ConfigurationDomainRemoteServersRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainRemoteServers',
    path: ':domainUuid/remote-servers',
    component: RemoteServersPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.REMOTE_SERVERS',
    },
    children: [],
  },
];
