import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';
import { getMainPages, canAccessPage, DomainManagementPage } from '../helpers/domainPageManagement';

export default function useDomainConfigurationPages () {
  const store = useStore();
  const { push } = useRouter();
  const { redirect } = useLegacyFeatures();
  const domainType = computed(() => store.getters['Domain/getCurrentDomainType']);
  const loggedUserRole = computed(() => store.getters['Auth/getLoggedUserRole']);

  const pages = computed(() => {
    const pages = getMainPages();

    return pages.filter(page => canAccessPage(page, loggedUserRole.value, domainType.value));
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
    goToPage,
    pages
  };
}
