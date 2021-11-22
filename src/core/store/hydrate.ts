import DomainTreeNode from '@/modules/domain/types/DomainTreeNode';
import User from '@/modules/user/types/User';
import store from './index';

export async function hydrate () {
  const loggedUser: User = store.getters['Auth/getLoggedUser'];
  const hydrating = store.getters.isHydrating;
  const hydrated = store.getters.isHydrated;

  if (!loggedUser.uuid || hydrating || hydrated) return;

  store.commit('setHydrating', true);

  try {
    await store.dispatch('Auth/fetchSecondFA');
    await store.dispatch('Domain/fetchDomainsTree');

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
}
