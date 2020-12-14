import User from '@/modules/user/type/User';

export interface AuthState {
  loggedUser: User | null;
}
