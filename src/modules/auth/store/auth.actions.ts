import { ActionTree } from 'vuex';
import { AuthState } from './auth.state';
import RootState from '@/core/types/RootState';
import {
  create2FAKey,
  get2FAStatus,
  getAuthorizedUser,
  remove2FAKey
} from '@/modules/auth/services/auth-api';

const actions: ActionTree<AuthState, RootState> = {
  async fetchLoggedUser ({ commit }, config?) {
    try {
      const loggedUser = await getAuthorizedUser(config);

      commit('setLoggedUser', loggedUser);
    } catch (error) {
      commit('setLoggedUser', {});

      throw error;
    }
  },
  async fetchSecondFA ({ commit, state }) {
    const loggedUserUuid = state.loggedUser?.uuid;

    if (!loggedUserUuid) {
      return;
    }

    try {
      const secondFA = await get2FAStatus(loggedUserUuid);

      commit('setSecondFA', secondFA);
    } catch (error) {
      commit('setSecondFA', null);

      throw error;
    }
  },
  async createSecondFA ({ commit }) {
    const secondFA = await create2FAKey();

    commit('setSecondFA', secondFA);
  },
  async removeSecondFA ({ commit, state }) {
    const loggedUserUuid = state.loggedUser?.uuid;

    if (!loggedUserUuid) {
      return;
    }

    try {
      const secondFA = await remove2FAKey(loggedUserUuid);

      commit('setSecondFA', secondFA);
    } catch (error) {
      commit('setSecondFA', null);

      throw error;
    }
  }
};

export default actions;
