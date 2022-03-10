import User from '@/modules/user/types/User';
import SecondFactorAuthentication from '@/modules/auth/types/SecondFactorAuthentication';
import { AuthState } from './auth.state';

export default {
  dehydrate(state: AuthState): void {
    state.loggedUser = null;
    state.secondFA = null;
  },
  setLoggedUser(state: AuthState, user: User | null): void {
    state.loggedUser = user;
  },
  setSecondFA(state: AuthState, secondFA: SecondFactorAuthentication | null): void {
    state.secondFA = secondFA;
  },
};
