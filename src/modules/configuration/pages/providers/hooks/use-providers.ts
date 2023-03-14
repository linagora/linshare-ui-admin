import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store';
import { useDomainStore } from '@/modules/domain/store';
import { findDomainPage, canAccessPage } from '@/core/services/configuration-pages';

export default function useProviders() {
  const authStore = useAuthStore();
  const domainStore = useDomainStore();
  const { loggedUser } = storeToRefs(authStore);
  const { currentDomain } = storeToRefs(domainStore);

  function isPageAccessible(name: string) {
    const page = findDomainPage(name);

    return page && canAccessPage(page, loggedUser.value?.role, currentDomain.value.type);
  }

  return { isPageAccessible };
}
