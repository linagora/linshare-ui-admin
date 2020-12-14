import { AuthState } from '@/modules/auth/store/auth.state';

export default interface RootState {
  auth: AuthState;
}
