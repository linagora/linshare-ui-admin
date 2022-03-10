import { AuthState } from './auth.state';
import getters from './auth.getters';
import actions from './auth.actions';
import mutations from './auth.mutations';

const state: AuthState = {
  loggedUser: null,
  secondFA: null,
};

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};
