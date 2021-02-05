import state from './user.state';
import getters from './user.getters';
import actions from './user.actions';
import mutations from './user.mutations';

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};
