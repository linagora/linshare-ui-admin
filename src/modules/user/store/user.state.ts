import User from '@/modules/user/types/User';

export interface UserState {
  user: User | Record<string, never>;
}

const state: UserState = {
  user: {}
};

export default state;
