import { RouteRecordRaw } from 'vue-router';
import RemoteFilterPage from '../pages/remote-filters-page.vue';
export const ConfigurationDomainRemoteFiltersRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainRemoteFilters',
    path: ':domainUuid/remote-filters',
    component: RemoteFilterPage,
    meta: {
      requiresAuth: true,
    },
    children: [],
  },
];
