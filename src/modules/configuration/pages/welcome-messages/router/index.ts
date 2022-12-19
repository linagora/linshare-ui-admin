import { RouteRecordRaw } from 'vue-router';
import WelcomeMessagesPage from '../pages/welcome-messages-page.vue';
export const ConfigurationDomainWelcomeMessagesRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainWelcomeMessages',
    path: ':domainUuid/welcome-messages',
    component: WelcomeMessagesPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'DomainWelcomeMessageNew',
    path: ':domainUuid/welcome-messages/new',
    component: () => import('../components/domain-welcome-message.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'DomainWelcomeMessageDetails',
    path: ':domainUuid/welcome-messages/:uuid',
    component: () => import('../components/domain-welcome-message.vue'),
    meta: {
      requiresAuth: true,
    },
  },
];
