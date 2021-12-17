import SharedSpaceRole from '../types/SharedSpaceRole';
import { SharedSpaceState } from './shared-space.state';

export default {
  dehydrate (state: SharedSpaceState) {
    state.roles = [];
  },
  setRoles (state: SharedSpaceState, roles: SharedSpaceRole[]): void {
    state.roles = roles;
  }
};
