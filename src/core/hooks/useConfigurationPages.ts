import { computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';
import { getMainPages, findDomainPage, canAccessPage, ConfigurationPage } from '../services/configuration-pages';
import Domain from '@/modules/domain/types/Domain';

type UsableConfigurationPages = {
  isCurrentPageAccessible: ComputedRef<boolean>;
  goToPage: (page: ConfigurationPage) => void;
  pages: ComputedRef<ConfigurationPage[]>;
};

export default function useConfigurationPages(): UsableConfigurationPages {
  const { t } = useI18n();
  const store = useStore();
  const { push, currentRoute } = useRouter();
  const { redirect } = useLegacyFeatures();
  const currentDomain = computed<Domain>(() => store.getters['Domain/getCurrentDomain']);
  const loggedUserRole = computed(() => store.getters['Auth/getLoggedUserRole']);

  const pages = computed(() =>
    getMainPages()
      .filter((page) => canAccessPage(page, loggedUserRole.value, currentDomain.value.type))
      .sort((a, b) => {
        if (!a.route) return 1;

        return t(a.title).localeCompare(t(b.title));
      })
  );

  const isCurrentPageAccessible = computed(() => {
    const currentPage = findDomainPage(currentRoute.value.name || '');

    if (!currentPage) return true;

    return canAccessPage(currentPage, loggedUserRole.value, currentDomain.value.type);
  });

  function goToPage(page: ConfigurationPage) {
    if (page.legacy) {
      return redirect(page.title);
    }

    if (page.route) {
      push({
        name: page.route.name,
        params: {
          domainUuid: page.route.requiresCurrentDomain ? currentDomain.value.uuid : '',
        },
      });
    }
  }

  return {
    isCurrentPageAccessible,
    goToPage,
    pages,
  };
}
