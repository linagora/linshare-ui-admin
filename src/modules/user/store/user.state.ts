import User from '@/modules/user/type/User';

export interface UserState {
  user: User | {};
}

const state: UserState = {
  user: {}
};

export default state;
