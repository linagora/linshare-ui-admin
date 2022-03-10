import state from './domain.state';
import getters from './domain.getters';
import actions from './domain.actions';
import mutations from './domain.mutations';

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};
