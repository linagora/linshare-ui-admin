import { RouteRecordRaw } from 'vue-router';
import EmailTemplatePage from '@/modules/configuration/pages/email-templates/pages/entries-page.vue';
export const CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES = {
  ENTRIES: 'ConfigurationDomainEmailTemplates',
  CONFIGURATION: 'ConfigurationDomainEmailTemplatesConfiguration',
  CONFIGURATION_DETAIL: 'ConfigurationDomainEmailTemplatesConfigurationDetail',
  LAYOUT: 'ConfigurationDomainEmailTemplatesLayout',
  LAYOUT_DETAIL: 'ConfigurationDomainEmailTemplatesLayoutDetail',
  FOOTER: 'ConfigurationDomainEmailTemplatesFooter',
  CONTENT: 'ConfigurationDomainEmailTemplatesContent',
  ACTIVATION: 'ConfigurationDomainEmailTemplatesActivation',
};

export const ConfigurationDomainEmailTemplatesRoutes: RouteRecordRaw[] = [
  {
    name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ENTRIES,
    path: ':domainUuid/email-templates',
    component: EmailTemplatePage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.EMAIL_TEMPLATES',
    },
    redirect: { name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONFIGURATION },
    children: [
      {
        name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONFIGURATION,
        path: 'configuration',
        component: () => import('@/modules/configuration/pages/email-templates/pages/configuration-page.vue'),
        meta: {
          requiresAuth: true,
          parentRoute: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ENTRIES,
          label: 'EMAIL_TEMPLATES.VERTICAL_TABS.CONFIGURATION',
        },
      },
      {
        name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONFIGURATION_DETAIL,
        path: 'configuration/:id',
        component: () => import('@/modules/configuration/pages/email-templates/pages/configuration-detail-page.vue'),
        meta: {
          requiresAuth: true,
          parentRoute: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ENTRIES,
          label: 'EMAIL_TEMPLATES.VERTICAL_TABS.CONFIGURATION',
        },
      },
      {
        name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.LAYOUT,
        path: 'layout',
        component: () => import('@/modules/configuration/pages/email-templates/pages/layout-page.vue'),
        meta: {
          requiresAuth: true,
          parentRoute: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ENTRIES,
          label: 'EMAIL_TEMPLATES.VERTICAL_TABS.LAYOUT',
        },
      },
      {
        name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.LAYOUT_DETAIL,
        path: 'layout/:id',
        component: () => import('@/modules/configuration/pages/email-templates/pages/layout-detail-page.vue'),
        meta: {
          requiresAuth: true,
          parentRoute: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ENTRIES,
          label: 'EMAIL_TEMPLATES.VERTICAL_TABS.LAYOUT',
        },
      },
      {
        name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.FOOTER,
        path: 'footer',
        component: () => import('@/modules/configuration/pages/email-templates/pages/footer-page.vue'),
        meta: {
          requiresAuth: true,
          parentRoute: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ENTRIES,
          label: 'EMAIL_TEMPLATES.VERTICAL_TABS.FOOTER',
        },
      },
      {
        name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONTENT,
        path: 'content',
        component: () => import('@/modules/configuration/pages/email-templates/pages/content-page.vue'),
        meta: {
          requiresAuth: true,
          parentRoute: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ENTRIES,
          label: 'EMAIL_TEMPLATES.VERTICAL_TABS.CONTENT',
        },
      },
      {
        name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ACTIVATION,
        path: 'activation',
        component: () => import('@/modules/configuration/pages/email-templates/pages/activation-page.vue'),
        meta: {
          requiresAuth: true,
          parentRoute: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ENTRIES,
          label: 'EMAIL_TEMPLATES.VERTICAL_TABS.ACTIVATION',
        },
      },
    ],
  },
];
