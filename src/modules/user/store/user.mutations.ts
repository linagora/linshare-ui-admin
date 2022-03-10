import User from '@/modules/user/types/User';
import { UserState } from './user.state';

export default {
  dehydrate(state: UserState): void {
    state.user = {};
  },
  setUser(state: UserState, user: User): void {
    state.user = user;
  },
  mergeUser(state: UserState, user: User): void {
    state.user = {
      ...state.user,
      ...user,
    };
  },
};
