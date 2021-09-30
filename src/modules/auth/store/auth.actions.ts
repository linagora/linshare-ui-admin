import { ActionTree } from 'vuex';
import { AuthState } from './auth.state';
import RootState from '@/core/store/RootState';
import AuthAPIClient from '@/modules/auth/services/AuthAPIClient';

const actions: ActionTree<AuthState, RootState> = {
  async fetchLoggedUser ({ commit }, config?) {
    try {
      const loggedUser = await AuthAPIClient.getAuthorizedUser(config);

      commit('setLoggedUser', loggedUser);
    } catch (error) {
      commit('setLoggedUser', {});

      throw error;
    }
  },
  async logoutUser ({ commit }) {
    await AuthAPIClient.logOut();

    commit('setLoggedUser', {});
  },
  async fetchSecondFA ({ commit, state }) {
    const loggedUserUuid = state.loggedUser?.uuid;

    if (!loggedUserUuid) {
      return;
    }

    try {
      const secondFA = await AuthAPIClient.get2FAStatus(loggedUserUuid);

      commit('setSecondFA', secondFA);
    } catch (error) {
      commit('setSecondFA', null);

      throw error;
    }
  },
  async createSecondFA ({ commit }) {
    const secondFA = await AuthAPIClient.create2FAKey();

    commit('setSecondFA', secondFA);
  },
  async removeSecondFA ({ commit, state }) {
    const loggedUserUuid = state.loggedUser?.uuid;

    if (!loggedUserUuid) {
      return;
    }

    try {
      const secondFA = await AuthAPIClient.remove2FAKey(loggedUserUuid);

      commit('setSecondFA', secondFA);
    } catch (error) {
      commit('setSecondFA', null);

      throw error;
    }
  }
};

export default actions;
