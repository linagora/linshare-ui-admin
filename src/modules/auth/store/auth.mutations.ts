import User from '@/modules/user/type/User';
import { AuthState } from './auth.state';

export default {
  setLoggedUser (state: AuthState, user: User | null) {
    state.loggedUser = user;
  }
};
