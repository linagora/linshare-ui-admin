import { GetterTree } from 'vuex';
import { UserState } from './user.state';
import { RootState } from '@/core/store';

const getters: GetterTree<UserState, RootState> = {
  getUser: state => state.user
};

export default getters;
