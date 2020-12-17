import { DomainState } from './domain.state';
import getters from './domain.getters';
import actions from './domain.actions';
import mutations from './domain.mutations';

const state: DomainState = {
  domains: []
};

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};
