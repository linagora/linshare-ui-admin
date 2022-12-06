import { RouteRecordRaw } from 'vue-router';
import WelcomeMessagesPage from '../pages/welcome-messages-page.vue';
import WelcomeMessageDetail from '@/modules/domain/components/domain-welcome-message.vue';
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
    name: 'DomainWelcomeMessageDetails',
    path: ':domainUuid/welcome-messages/:uuid',
    component: WelcomeMessageDetail,
    meta: {
      requiresAuth: true,
    },
  },
];
