import { ActionTree } from 'vuex';
import { DomainState } from './domain.state';
import RootState from '@/core/store/RootState';
import DomainAPIClient from '@/modules/domain/services/DomainAPIClient';

const actions: ActionTree<DomainState, RootState> = {
  async fetchDomains ({ commit }, config?: object) {
    try {
      const domains = await DomainAPIClient.getDomains(config);

      commit('setDomains', domains);
    } catch (error) {
      commit('setDomains', []);
    }
  }
};

export default actions;
