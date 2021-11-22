import { ActionTree } from 'vuex';
import { DomainState } from './domain.state';
import { RootState } from '@/core/store';
import Status from '@/core/types/Status';
import Domain from '@/modules/domain/types/Domain';
import { getDomains, getDomain, updateDomain } from '@/modules/domain/services/domain-api';

const actions: ActionTree<DomainState, RootState> = {
  async fetchDomainsTree ({ commit }) {
    const domains = await getDomains({ params: { tree: true } });

    commit('setDomainsTree', domains[0]);
  },
  async fetchDomainById ({ commit }, id: string) {
    commit('setCurrentDomainStatus', Status.LOADING);

    try {
      const domain = await getDomain(id, { params: { detail: true } });

      commit('setCurrentDomain', domain);
      commit('setCurrentDomainStatus', Status.SUCCESS);
    } catch (error) {
      commit('setCurrentDomainStatus', Status.ERROR);
    }
  },
  async updateDomain ({ commit }, domain: Domain) {
    const updated = await updateDomain(domain);

    commit('setCurrentDomain', updated);
    commit('setDomainNameInTree', updated);
  }
};

export default actions;
