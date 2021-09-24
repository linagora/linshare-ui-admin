import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, LocationAsRelativeRaw } from 'vue-router';
import { DOMAIN_TYPE } from '@/modules/domain/type/Domain';
import { RemoteServersRoute } from '@/modules/remote-server/router';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';
interface DomainManagementPage {
  title: string;
  legacy?: boolean;
  route?: LocationAsRelativeRaw;
  usedFor?: DOMAIN_TYPE[];
}

const DOMAIN_MANAGEMENT_PAGES: DomainManagementPage[] = [
  {
    title: 'NAVIGATOR.DETAILS',
    route: { name: 'DomainDetails' }
  },
  {
    title: 'NAVIGATOR.REMOTE_SERVERS',
    usedFor: [DOMAIN_TYPE.ROOT],
    route: { name: RemoteServersRoute.name }
  },
  {
    title: 'NAVIGATOR.PROVIDERS',
    legacy: true,
    usedFor: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB]
  },
  {
    title: 'NAVIGATOR.REMOTE_FILTERS',
    route: { name: 'DomainFilters' }
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

  const pages = computed(() => DOMAIN_MANAGEMENT_PAGES
    .filter(page => !page.usedFor || page.usedFor.includes(domainType.value))
    .sort((a, b) => {
      if (!a.route) return 1;

      return a.title.localeCompare(b.title);
    }));

  const availableForCurrentDomain = computed(() => {
    const currentPage = DOMAIN_MANAGEMENT_PAGES.find(page => !page.legacy && page.route?.name === currentRoute.value.name);

    if (!currentPage || !currentPage.usedFor) {
      return true;
    }

    return currentPage.usedFor.includes(domainType.value);
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
    availableForCurrentDomain,
    goToPage,
    pages
  };
}
