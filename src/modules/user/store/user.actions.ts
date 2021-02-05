
import { ActionTree } from 'vuex';
import { UserState } from './user.state';
import RootState from '@/core/store/RootState';
import UserAPIClient from '@/modules/user/services/UserAPIClient';
import User from '@/modules/user/type/User';

const actions: ActionTree<UserState, RootState> = {
  async fetchUser ({ commit }, id, config?: object) {
    try {
      const user = await UserAPIClient.getUser(id, config);

      commit('setUser', user);
    } catch {
      commit('setUser', {});
    }
  },

  async updateUser ({ commit }, payload: User) {
    const updatedUser = await UserAPIClient.updateUser(payload);

    commit('mergeUser', updatedUser);
  },

  async deleteUser ({ commit }, payload: User) {
    await UserAPIClient.deleteUser(payload);

    commit('setUser', {});
  },

  setUser ({ commit }, payload: User) {
    commit('setUser', payload);
  }
};

export default actions;
