
import { ActionTree } from 'vuex';
import RootState from '@/core/types/RootState';
import { getSharedSpaceRoles } from '../services/shared-space-api';
import { SharedSpaceState } from './shared-space.state';
import { SHARED_SPACE_TYPE } from '../types/SharedSpace';

const actions: ActionTree<SharedSpaceState, RootState> = {
  async fetchRoles ({ commit }) {
    try {
      const workgroupRoles = await getSharedSpaceRoles(SHARED_SPACE_TYPE.WORKGROUP);
      const workspaceRoles = await getSharedSpaceRoles(SHARED_SPACE_TYPE.WORKSPACE);

      commit('setRoles', [...workgroupRoles, ...workspaceRoles]);
    } catch {
      commit('setRoles', []);
    }
  }
};

export default actions;
