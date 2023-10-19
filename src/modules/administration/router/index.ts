import { RouteRecordRaw } from 'vue-router';
import { UserRoutes } from '@/modules/user/router';
import {
  AdministrationContactListsRoutes,
  CONTACT_LISTS_ROUTE_NAMES,
} from '@/modules/administration/pages/contact-list/router';
import { MY_USERS_ROUTE_NAMES } from '@/modules/user/router';
import { MY_TECHNICAL_USERS_ROUTE_NAMES } from '@/modules/administration/pages/technical-accounts/router';
import { MY_SHARED_SPACES_ROUTE_NAMES, SharedSpacesRoutes } from '@/modules/shared-spaces/router';
import { INCONSISTENT_USERS_ROUTE_NAMES, InconsistentUsersRoutes } from '@/modules/inconsistent-users/router';

export const ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES = {
  CONTACT_LIST: 'AdministrationContactList',
  LOGGERS: 'AdministrationLoggers',
  ENTRIES: 'AdministrationEntries',
  INCONSISTENT_USERS_ROUTE_NAMES,
  MY_SHARED_SPACES_ROUTE_NAMES,
  MY_USERS_ROUTE_NAMES,
  CONTACT_LISTS_ROUTE_NAMES,
  MY_TECHNICAL_USERS_ROUTE_NAMES,
};
export const AdministrationRoute: RouteRecordRaw = {
  name: 'Administration',
  path: 'administration',
  component: () => import('@/core/layouts/administration-page.vue'),
  meta: {
    label: 'NAVIGATOR.ADMINISTRATION',
    requiresAuth: true,
    uiBeta: true,
  },
  children: [
    {
      name: ADMINISTRATIONS_TEMPLATES_ROUTE_NAMES.ENTRIES,
      path: '',
      component: () => import('@/modules/administration/pages/entries-page.vue'),
      meta: {
        blankPage: true,
      },
    },
    ...AdministrationContactListsRoutes,
    ...UserRoutes,
    ...InconsistentUsersRoutes,
    ...SharedSpacesRoutes,
  ],
};
