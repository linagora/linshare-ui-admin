import { computed, ComputedRef } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDomainStore } from '@/modules/domain/store';
import { useAuthStore } from '@/modules/auth/store';
import { getMainPages, findDomainPage, canAccessPage, ConfigurationPage } from '../services/configuration-pages';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';

type UsableConfigurationPages = {
  isCurrentPageAccessible: ComputedRef<boolean>;
  goToPage: (page: ConfigurationPage) => void;
  pages: ComputedRef<ConfigurationPage[]>;
};

export default function useConfigurationPages(): UsableConfigurationPages {
  const { t } = useI18n();
  const { push, currentRoute } = useRouter();
  const { redirect } = useLegacyFeatures();
  const domainStore = useDomainStore();
  const authStore = useAuthStore();
  const { currentDomain } = storeToRefs(domainStore);
  const { loggedUser } = storeToRefs(authStore);

  const pages = computed(() =>
    getMainPages()
      .filter((page) => canAccessPage(page, loggedUser.value?.role, currentDomain.value.type))
      .sort((a, b) => {
        if (!a.route) return 1;

        return t(a.title).localeCompare(t(b.title));
      })
  );

  const isCurrentPageAccessible = computed(() => {
    const currentPage = findDomainPage(currentRoute.value.name || '');

    if (!currentPage) return true;

    return canAccessPage(currentPage, loggedUser.value?.role, currentDomain.value.type);
  });

  function goToPage(page: ConfigurationPage) {
    if (page.legacy) {
      return redirect(page.title);
    }

    if (page.route) {
      push({
        name: page.route.name,
        params: {
          domainUuid: page.route.requiresCurrentDomain ? currentDomain.value?.uuid : '',
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
