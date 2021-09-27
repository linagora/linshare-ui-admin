import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, LocationAsRelativeRaw } from 'vue-router';
import { DOMAIN_TYPE } from '@/modules/domain/type/Domain';
import { RemoteServersRoute } from '@/modules/remote-server/router';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';
import { ACCOUNT_ROLE } from '@/modules/user/type/User';
interface DomainManagementPage {
  title: string;
  legacy?: boolean;
  route?: LocationAsRelativeRaw;
  usedFor?: {
    types?: DOMAIN_TYPE[];
    roles?: ACCOUNT_ROLE[];
  };
}

const DOMAIN_MANAGEMENT_PAGES: DomainManagementPage[] = [
  {
    title: 'NAVIGATOR.DETAILS',
    route: { name: 'DomainDetails' }
  },
  {
    title: 'NAVIGATOR.REMOTE_SERVERS',
    usedFor: { roles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: { name: RemoteServersRoute.name }
  },
  {
    title: 'NAVIGATOR.PROVIDERS',
    legacy: true,
    usedFor: { types: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB] }
  },
  {
    title: 'NAVIGATOR.REMOTE_FILTERS',
    usedFor: { roles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: { name: 'DomainRemoteFilters' }
  },
  {
    title: 'NAVIGATOR.USER_FILTERS',
    usedFor: { roles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: { name: 'UserFilters' }
  },
  {
    title: 'NAVIGATOR.PARAMETERS',
    legacy: true
  },
  {
    title: 'NAVIGATOR.TYPE_MIME',
    legacy: true
  },
  {
    title: 'NAVIGATOR.WELCOME_MESSAGES',
    legacy: true
  },
  {
    title: 'NAVIGATOR.TYPE_MIME',
    legacy: true
  },
  {
    title: 'NAVIGATOR.QUOTA',
    legacy: true
  },
  {
    title: 'NAVIGATOR.PUBLIC_KEYS'
  }
];

export default function useDomainConfigurationPages () {
  const store = useStore();
  const { currentRoute, push } = useRouter();
  const { redirect } = useLegacyFeatures();
  const domainType = computed(() => store.getters['Domain/getCurrentDomainType']);
  const loggedUserRole = computed(() => store.getters['Auth/getLoggedUserRole']);

  const isPageAccessible = (page: DomainManagementPage): boolean => {
    if (!page.usedFor) {
      return true;
    }

    if (page.usedFor.roles && !page.usedFor.roles.includes(loggedUserRole.value)) {
      return false;
    }

    return !page.usedFor.types || !!page.usedFor.types.includes(domainType.value);
  };

  const pages = computed(() => DOMAIN_MANAGEMENT_PAGES
    .filter(isPageAccessible)
    .sort((a, b) => {
      if (!a.route) return 1;

      return a.title.localeCompare(b.title);
    }));

  const canAccessPage = computed(() => {
    const currentPage = DOMAIN_MANAGEMENT_PAGES.find(page => !page.legacy && page.route?.name === currentRoute.value.name);

    return currentPage && isPageAccessible(currentPage);
  });

  function goToPage (page: DomainManagementPage) {
    if (page.legacy) {
      return redirect(page.title);
    }

    if (page.route) {
      push(page.route);
    }
  }

  return {
    canAccessPage,
    goToPage,
    pages
  };
}
