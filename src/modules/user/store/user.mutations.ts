import User from '@/modules/user/type/User';
import { UserState } from './user.state';

export default {
  setUser (state: UserState, user: User) {
    state.user = user;
  },
  mergeUser (state: UserState, user: User) {
    state.user = {
      ...state.user,
      ...user
    };
  }
};
