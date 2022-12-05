import { RouteRecordRaw } from 'vue-router';
import PublicKeysPage from '../pages/public-keys-page.vue';
export const ConfigurationDomainPublicKeysRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainPublicKeys',
    path: ':domainUuid/public-keys',
    component: PublicKeysPage,
    meta: {
      requiresAuth: true,
    },
    children: [],
  },
];
