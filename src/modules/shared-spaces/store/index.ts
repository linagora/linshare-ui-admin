import { defineStore } from 'pinia';
import { getSharedSpaceRoles } from '../services/shared-space-api';
import { SHARED_SPACE_TYPE } from '../types/SharedSpace';
import type SharedSpaceRole from '../types/SharedSpaceRole';

export interface SharedSpaceState {
  roles: SharedSpaceRole[];
}

export const useSharedSpacesStore = defineStore('sharedSpacesStore', {
  state: (): SharedSpaceState => ({
    roles: [],
  }),
  getters: {
    getRolesByType:
      (state) =>
      (type: SHARED_SPACE_TYPE): SharedSpaceRole[] =>
        state.roles.filter((role) => role.type === type),
  },
  actions: {
    async fetchRoles() {
      try {
        const workgroupRoles = await getSharedSpaceRoles(SHARED_SPACE_TYPE.WORKGROUP);
        const workspaceRoles = await getSharedSpaceRoles(SHARED_SPACE_TYPE.WORKSPACE);

        this.roles = [...workgroupRoles, ...workspaceRoles];
      } catch {
        this.roles = [];
      }
    },
  },
});
