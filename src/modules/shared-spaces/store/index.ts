import state from './shared-space.state';
import getters from './shared-space.getters';
import actions from './shared-space.actions';
import mutations from './shared-space.mutations';

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};
