import DomainTreeNode from '@/modules/domain/types/DomainTreeNode';
import store from './index';

export async function hydrate () {
  const hydrating = store.getters.isHydrating;
  const hydrated = store.getters.isHydrated;
  const authenticated = store.getters.isAuthenticated;

  if (!authenticated || hydrating || hydrated) return;

  store.commit('setHydrating', true);

  try {
    await store.dispatch('Auth/fetchSecondFA');
    await store.dispatch('Domain/fetchDomainsTree');
    await store.dispatch('Domain/fetchLoggedUserFunctionalities');
    await store.dispatch('SharedSpace/fetchRoles');

    const domainsTree: DomainTreeNode = store.getters['Domain/getDomainsTree'];

    await store.dispatch('Domain/fetchDomainById', domainsTree.uuid);
  } catch (error) {
    console.error(error);
  } finally {
    store.commit('setHydrating', false);
  }

  store.commit('setHydrated', true);
}

export function dehydrate () {
  store.commit('Domain/dehydrate');
  store.commit('Auth/dehydrate');
  store.commit('setHydrated', false);
  store.commit('setAuthenticated', false);
}
