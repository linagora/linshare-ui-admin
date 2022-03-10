import SharedSpaceRole from '../types/SharedSpaceRole';
import { SharedSpaceState } from './shared-space.state';

export default {
  dehydrate(state: SharedSpaceState): void {
    state.roles = [];
  },
  setRoles(state: SharedSpaceState, roles: SharedSpaceRole[]): void {
    state.roles = roles;
  },
};
