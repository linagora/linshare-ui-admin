import User from '@/modules/user/type/User';
import SecondFactorAuthentication from '@/modules/auth/type/SecondFactorAuthentication';

export interface AuthState {
  loggedUser: User | null;
  secondFA: SecondFactorAuthentication | null;
}
