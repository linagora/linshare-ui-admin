import { GetterTree } from 'vuex';
import { AuthState } from './auth.state';
import RootState from '@/core/store/RootState';

const getters: GetterTree<AuthState, RootState> = {
  getLoggedUser: state => state.loggedUser,
  getLoggedUserRole: state => state.loggedUser?.role,
  getLoggedUserUuid: state => state.loggedUser?.uuid,
  getLoggedUserFirstName: state => state.loggedUser?.firstName,
  getLoggedUserFullName: state => `${state.loggedUser?.firstName || ''} ${state.loggedUser?.lastName || ''}`.trim(),
  getLoggedUserEmail: state => state.loggedUser?.mail,
  is2FARequired: state => state.loggedUser?.secondFARequired,
  is2FAEnabled: state => state.loggedUser?.secondFAEnabled,
  isFeature2FAEnabled: state => state.loggedUser?.secondFAEnabled !== undefined && state.loggedUser?.secondFARequired !== undefined,
  getSecondFA: state => state.secondFA
};

export default getters;
