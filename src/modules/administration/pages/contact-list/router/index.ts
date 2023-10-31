import { RouteRecordRaw } from 'vue-router';
import ContactListsEntries from '@/modules/administration/pages/contact-list/pages/entries-page.vue';

export const CONTACT_LISTS_ROUTE_NAMES = {
  ENTRIES: 'AdministrationContactListsEntries',
  CONTACT_LIST: 'AdministrationContactLists',
  CONTACT_LIST_DETAIL: 'AdministrationContactListsDetail',
};

export const AdministrationContactListsRoutes: RouteRecordRaw[] = [
  {
    name: CONTACT_LISTS_ROUTE_NAMES.ENTRIES,
    path: 'contact-list',
    component: ContactListsEntries,
    meta: {
      requiresAuth: true,
      parentRoute: 'AdministrationEntries',
      label: 'NAVIGATOR.ADMINISTRATION_CONTACT_LIST',
    },
    children: [
      {
        name: CONTACT_LISTS_ROUTE_NAMES.CONTACT_LIST,
        path: '',
        component: () => import('@/modules/administration/pages/contact-list/pages/contact-list-page.vue'),
        meta: {
          requiresAuth: true,
          parentRoute: 'AdministrationEntries',
          label: 'NAVIGATOR.ADMINISTRATION_CONTACT_LIST',
        },
      },
      {
        name: CONTACT_LISTS_ROUTE_NAMES.CONTACT_LIST_DETAIL,
        path: ':id',
        component: () => import('@/modules/administration/pages/contact-list/pages/contact-list-detail-page.vue'),
        meta: {
          requiresAuth: true,
          parentRoute: CONTACT_LISTS_ROUTE_NAMES.CONTACT_LIST,
          label: 'NAVIGATOR.ADMINISTRATION_CONTACT_LIST',
        },
      },
    ],
  },
];
