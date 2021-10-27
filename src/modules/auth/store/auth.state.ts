import User from '@/modules/user/types/User';
import SecondFactorAuthentication from '@/modules/auth/types/SecondFactorAuthentication';

export interface AuthState {
  loggedUser: User | null;
  secondFA: SecondFactorAuthentication | null;
}
