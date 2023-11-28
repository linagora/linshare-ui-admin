import { RouteRecordRaw } from 'vue-router';

export const UPGRADES_TEMPLATES_ROUTE_NAMES = {
  ENTRIES: 'UpgradesEntries',
  UPGRADES_LIST: 'UpgradesList',
  UPGRADES_DETAIL: 'UpgradesDetail',
  UPGRADES_DETAIL_CONSOLE: 'UpgradesDetailConsole',
};
export const UpgradesRoute: RouteRecordRaw = {
  name: 'Upgrades',
  path: 'upgrades',
  component: () => import('@/core/layouts/upgrade-page.vue'),
  meta: {
    label: 'NAVIGATOR.UPGRADES',
    requiresAuth: true,
    uiBeta: true,
  },
  children: [
    {
      name: UPGRADES_TEMPLATES_ROUTE_NAMES.UPGRADES_LIST,
      path: '',
      component: () => import('@/modules/upgrades/pages/upgrade-list-page.vue'),
      meta: {
        requiresAuth: true,
        parentRoute: 'Upgrades',
        label: 'NAVIGATOR.UPGRADES_TASK',
      },
    },
    {
      name: UPGRADES_TEMPLATES_ROUTE_NAMES.UPGRADES_DETAIL,
      path: ':id',
      component: () => import('@/modules/upgrades/pages/upgrade-list-detail-page.vue'),
      meta: {
        requiresAuth: true,
        parentRoute: UPGRADES_TEMPLATES_ROUTE_NAMES.UPGRADES_LIST,
        label: 'NAVIGATOR.UPGRADES_DETAIL',
      },
    },
    {
      name: UPGRADES_TEMPLATES_ROUTE_NAMES.UPGRADES_DETAIL_CONSOLE,
      path: 'console/:identifier/:id',
      component: () => import('@/modules/upgrades/pages/upgrade-console.vue'),
      meta: {
        requiresAuth: true,
        parentRoute: UPGRADES_TEMPLATES_ROUTE_NAMES.UPGRADES_LIST,
        label: 'NAVIGATOR.UPGRADES_CONSOLE',
      },
    },
  ],
};
