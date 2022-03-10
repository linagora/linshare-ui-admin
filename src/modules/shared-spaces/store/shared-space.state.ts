import SharedSpaceRole from '../types/SharedSpaceRole';

export interface SharedSpaceState {
  roles: SharedSpaceRole[];
}

const state: SharedSpaceState = {
  roles: [],
};

export default state;
