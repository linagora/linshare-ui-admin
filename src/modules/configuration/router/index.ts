import { RouteRecordRaw } from 'vue-router';
import { ConfigurationDomainQuotaRoutes } from '@/modules/configuration/pages/quota/router';
import { ConfigurationDomainDetailRoutes } from '@/modules/configuration/pages/detail/router';
import { ConfigurationDomainProvidersRoutes } from '@/modules/configuration/pages/providers/router';
import { ConfigurationDomainParametersRoutes } from '@/modules/configuration/pages/parameters/router';
import { ConfigurationDomainRemoteServersRoutes } from '@/modules/configuration/pages/remote-servers/router';
import { ConfigurationDomainRemoteFiltersRoutes } from '@/modules/configuration/pages/remote-filters/router';
import { ConfigurationDomainGroupProvidersRoutes } from '@/modules/configuration/pages/domain-group-providers/router';
import {
  ConfigurationDomainWelcomeMessagesRoutes,
  CONFIGURATION_DOMAIN_WELCOME_MESSAGES_ROUTE_NAMES,
} from '@/modules/configuration/pages/welcome-messages/router';
import { ConfigurationDomainTypeMimePoliciesRoutes } from '@/modules/configuration/pages/type-mime-policies/router';
import { ConfigurationDomainProviderManagementRoutes } from '@/modules/configuration/pages/domain-provider-management/router';
import { ConfigurationDomainEmailTemplatesRoutes } from '@/modules/configuration/pages/email-templates/router';
import { ConfigurationDomainDomainUserProvidersRoutes } from '@/modules/configuration/pages/domain-user-providers/router';
import { ConfigurationDomainDomainWorkspaceProvidersRoutes } from '@/modules/configuration/pages/domain-workspace-providers/router';

export const ConfigurationRoute: RouteRecordRaw = {
  name: 'Configuration',
  path: 'configuration',
  component: () => import('../layouts/configuration-layout.vue'),
  meta: {
    label: 'NAVIGATOR.CONFIGURATION',
    requiresAuth: true,
    uiBeta: true,
  },
  children: [
    {
      name: 'ConfigurationEntries',
      path: '',
      component: () => import('../pages/index-page.vue'),
    },
    ...ConfigurationDomainQuotaRoutes,
    ...ConfigurationDomainDetailRoutes,
    ...ConfigurationDomainProvidersRoutes,
    ...ConfigurationDomainParametersRoutes,
    ...ConfigurationDomainRemoteServersRoutes,
    ...ConfigurationDomainRemoteFiltersRoutes,
    ...ConfigurationDomainGroupProvidersRoutes,
    ...ConfigurationDomainWelcomeMessagesRoutes,
    ...ConfigurationDomainTypeMimePoliciesRoutes,
    ...ConfigurationDomainProviderManagementRoutes,
    ...ConfigurationDomainDomainUserProvidersRoutes,
    ...ConfigurationDomainDomainWorkspaceProvidersRoutes,
    ...ConfigurationDomainEmailTemplatesRoutes,
  ],
};

export const CONFIGURATION_ROUTE_NAMES = {
  ...CONFIGURATION_DOMAIN_WELCOME_MESSAGES_ROUTE_NAMES,
};
