import { GetterTree } from 'vuex';
import { AuthState } from './auth.state';
import RootState from '@/core/store/RootState';

const getters: GetterTree<AuthState, RootState> = {
  getLoggedUser: state => state.loggedUser,
  getLoggedUserRole: state => state.loggedUser?.role,
  getLoggedUserFirstName: state => state.loggedUser?.firstName
};

export default getters;
