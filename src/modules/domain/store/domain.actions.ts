import { ActionTree } from 'vuex';
import { DomainState } from './domain.state';
import RootState from '@/core/types/RootState';
import Status from '@/core/types/Status';
import Domain from '@/modules/domain/types/Domain';
import {
  getDomains,
  getDomain,
  updateDomain,
  deleteDomain,
  getFunctionalties,
} from '@/modules/domain/services/domain-api';
import User from '@/modules/user/types/User';

const actions: ActionTree<DomainState, RootState> = {
  setCurrentDomainUuid({ commit }, uuid: string) {
    commit('setCurrentDomain', { uuid });
  },
  async fetchDomainsTree({ commit }) {
    const domains = await getDomains({ params: { tree: true } });

    commit('setDomainsTree', domains[0]);
  },
  async fetchDomain({ commit, state }) {
    commit('setCurrentDomainStatus', Status.LOADING);

    try {
      const domain = await getDomain(state.currentDomain.uuid, { params: { detail: true } });

      commit('setCurrentDomain', domain);
      commit('setCurrentDomainStatus', Status.SUCCESS);
    } catch (error) {
      commit('setCurrentDomainStatus', Status.ERROR);
    }
  },
  async updateDomain({ commit }, domain: Domain) {
    const updated = await updateDomain(domain);

    commit('setCurrentDomain', updated);
    commit('setDomainNameInTree', updated);
  },
  async deleteCurrentDomain({ commit, state, dispatch }) {
    await deleteDomain(state.currentDomain);
    await dispatch('fetchDomainsTree');
    commit('setCurrentDomain', state.domainsTree);
    await dispatch('fetchDomain');
  },
  async fetchLoggedUserFunctionalities({ commit, rootGetters }) {
    const loggedUser: User = rootGetters['Auth/getLoggedUser'];

    if (!loggedUser) return;

    const functionalities = await getFunctionalties(loggedUser.domain.uuid, { includeSubs: true });

    commit('setLoggedUserFunctionalities', functionalities);
  },
};

export default actions;
