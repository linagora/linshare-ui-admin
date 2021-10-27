
import { ActionTree } from 'vuex';
import { UserState } from './user.state';
import RootState from '@/core/store/RootState';
import { getUser, updateUser, deleteUser } from '@/modules/user/services/user-api';
import User from '@/modules/user/type/User';

const actions: ActionTree<UserState, RootState> = {
  async fetchUser ({ commit }, id) {
    try {
      const user = await getUser(id);

      commit('setUser', user);
    } catch {
      commit('setUser', {});
    }
  },

  async updateUser ({ commit }, payload: User) {
    const updatedUser = await updateUser(payload);

    commit('mergeUser', updatedUser);
  },

  async deleteUser ({ commit }, payload: User) {
    await deleteUser(payload);

    commit('setUser', {});
  },

  setUser ({ commit }, payload: User) {
    commit('setUser', payload);
  }
};

export default actions;
