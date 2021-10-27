import User from '@/modules/user/types/User';
import { UserState } from './user.state';

export default {
  setUser (state: UserState, user: User): void {
    state.user = user;
  },
  mergeUser (state: UserState, user: User): void {
    state.user = {
      ...state.user,
      ...user
    };
  }
};
