import { storeToRefs } from 'pinia';
import { useAppStore } from '@/core/store';
import { useAuthStore } from '@/modules/auth/store';
import { useDomainStore } from '@/modules/domain/store';
import { useSharedSpacesStore } from '@/modules/shared-spaces/store';
import { useAuth2FAStore } from '@/modules/auth/store/auth2FAstore';

export async function hydrate(): Promise<void> {
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const domainStore = useDomainStore();
  const sharedSpacesStore = useSharedSpacesStore();
  const hydrating = appStore.hydrating;
  const hydrated = appStore.hydrated;
  const authenticated = appStore.authenticated;

  if (!authenticated || hydrating || hydrated) return;

  appStore.setHydrating(true);

  try {
    await authStore.fetchSecondFA();
    await authStore.fetchFunctionalities();
    await domainStore.fetchDomainsTree();
    await sharedSpacesStore.fetchRoles();

    const { currentDomain, domainsTree } = storeToRefs(domainStore);

    if (!currentDomain.value.uuid) {
      domainStore.setCurrentDomainUuid(domainsTree.value.uuid);
    }
    await domainStore.fetchDomain();
  } catch (error) {
    appStore.setError(true);
    throw error;
  } finally {
    appStore.setHydrating(false);
  }

  appStore.setHydrated(true);
}

export function dehydrate(): void {
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const auth2FAStore = useAuth2FAStore();
  const domainStore = useDomainStore();

  domainStore.dehydrate();
  authStore.dehydrate();
  auth2FAStore.dehydrate();
  appStore.setHydrated(false);
  appStore.setAuthenticated(false);
}
