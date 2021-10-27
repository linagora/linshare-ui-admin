import User from '@/modules/user/types/User';
import SecondFactorAuthentication from '@/modules/auth/types/SecondFactorAuthentication';
import { AuthState } from './auth.state';

export default {
  setLoggedUser (state: AuthState, user: User | null) {
    state.loggedUser = user;
  },
  setSecondFA (state: AuthState, secondFA: SecondFactorAuthentication | null) {
    state.secondFA = secondFA;
  }
};
