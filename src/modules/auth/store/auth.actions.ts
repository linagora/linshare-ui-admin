import { ActionTree } from 'vuex';
import { AuthState } from './auth.state';
import RootState from '@/core/store/RootState';
import AuthAPIClient from '@/modules/auth/services/AuthAPIClient';

const actions: ActionTree<AuthState, RootState> = {
  async fetchLoggedUser ({ commit }, config?: object) {
    try {
      const loggedUser = await AuthAPIClient.getAuthorizedUser(config);

      commit('setLoggedUser', loggedUser);
    } catch (error) {
      commit('setLoggedUser', null);

      throw error;
    }
  },
  async logoutUser ({ commit }, config?: object) {
    await AuthAPIClient.logOut(config);

    commit('setLoggedUser', null);
  }
};

export default actions;
