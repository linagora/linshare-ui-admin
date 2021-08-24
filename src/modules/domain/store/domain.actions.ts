import { ActionTree } from 'vuex';
import { DomainState } from './domain.state';
import RootState from '@/core/store/RootState';
import DomainAPIClient from '@/modules/domain/services/DomainAPIClient';

const actions: ActionTree<DomainState, RootState> = {
  async fetchDomainsTree ({ commit }) {
    try {
      const domains = await DomainAPIClient.getDomains({ params: { tree: true } });

      commit('setDomainsTree', domains[0]);
    } catch (error) {
      commit('setDomainsTree', {});
    }
  },
  async fetchDomain ({ commit }, uuid: string) {
    try {
      const domain = await DomainAPIClient.getDomain(uuid, { params: { detail: true } });

      commit('setCurrentDomain', domain);
    } catch (error) {
      commit('setCurrentDomain', {});
    }
  }
};

export default actions;
