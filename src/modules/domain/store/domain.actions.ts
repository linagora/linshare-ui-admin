import { ActionTree } from 'vuex';
import { DomainState } from './domain.state';
import RootState from '@/core/store/RootState';
import Status from '@/core/types/Status';
import DomainAPIClient from '@/modules/domain/services/DomainAPIClient';

const actions: ActionTree<DomainState, RootState> = {
  async fetchDomainsTree ({ commit }) {
    commit('setDomainsTreeStatus', Status.LOADING);

    try {
      const domains = await DomainAPIClient.getDomains({ params: { tree: true } });

      commit('setDomainsTree', domains[0]);
      commit('setDomainsTreeStatus', Status.SUCCESS);
    } catch (error) {
      commit('setDomainsTreeStatus', Status.ERROR);
    }
  },
  async fetchDomainById ({ commit }, id: string) {
    commit('setCurrentDomainStatus', Status.LOADING);

    try {
      const domain = await DomainAPIClient.getDomain(id, { params: { detail: true } });

      commit('setCurrentDomain', domain);
      commit('setCurrentDomainStatus', Status.SUCCESS);
    } catch (error) {
      commit('setDomainsTreeStatus', Status.ERROR);
    }
  }
};

export default actions;
