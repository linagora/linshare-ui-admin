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
    children: [],
  },
];
