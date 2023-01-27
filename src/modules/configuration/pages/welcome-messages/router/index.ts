import { RouteRecordRaw } from 'vue-router';
import WelcomeMessagesPage from '../pages/welcome-messages-page.vue';

export const CONFIGURATION_DOMAIN_WELCOME_MESSAGES_ROUTE_NAMES = {
  CONFIGURATION_DOMAIN_WELCOME_MESSAGES: 'ConfigurationDomainWelcomeMessages',
  DOMAIN_WELCOME_MESSAGE_NEW: 'DomainWelcomeMessageNew',
  DOMAIN_WELCOME_MESSAGE_DETAILS: 'DomainWelcomeMessageDetails',
};

export const ConfigurationDomainWelcomeMessagesRoutes: RouteRecordRaw[] = [
  {
    name: CONFIGURATION_DOMAIN_WELCOME_MESSAGES_ROUTE_NAMES.CONFIGURATION_DOMAIN_WELCOME_MESSAGES,
    path: ':domainUuid/welcome-messages',
    component: WelcomeMessagesPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.WELCOME_MESSAGES',
    },
  },
  {
    name: CONFIGURATION_DOMAIN_WELCOME_MESSAGES_ROUTE_NAMES.DOMAIN_WELCOME_MESSAGE_NEW,
    path: ':domainUuid/welcome-messages/new',
    component: () => import('../components/domain-welcome-message.vue'),
    meta: {
      requiresAuth: true,
      parentRoute: CONFIGURATION_DOMAIN_WELCOME_MESSAGES_ROUTE_NAMES.CONFIGURATION_DOMAIN_WELCOME_MESSAGES,
    },
  },
  {
    name: CONFIGURATION_DOMAIN_WELCOME_MESSAGES_ROUTE_NAMES.DOMAIN_WELCOME_MESSAGE_DETAILS,
    path: ':domainUuid/welcome-messages/:uuid',
    component: () => import('../components/domain-welcome-message.vue'),
    meta: {
      requiresAuth: true,
      label: 'NAVIGATOR.WELCOME_MESSAGE_DETAIL',
      parentRoute: CONFIGURATION_DOMAIN_WELCOME_MESSAGES_ROUTE_NAMES.CONFIGURATION_DOMAIN_WELCOME_MESSAGES,
    },
  },
];
