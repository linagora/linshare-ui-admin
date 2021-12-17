import { GetterTree } from 'vuex';
import RootState from '@/core/types/RootState';
import { SharedSpaceState } from './shared-space.state';
import { SHARED_SPACE_TYPE } from '../types/SharedSpace';
import SharedSpaceRole from '../types/SharedSpaceRole';

const getters: GetterTree<SharedSpaceState, RootState> = {
  getRoles: state => state.roles,
  getRolesByType: state => (type: SHARED_SPACE_TYPE): SharedSpaceRole[] => state.roles.filter(role => role.type === type)
};

export default getters;
