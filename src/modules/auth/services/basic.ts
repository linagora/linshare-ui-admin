import { useAuthStore } from '@/modules/auth/store';
import { useAppStore } from '@/core/store';
import { hydrate, dehydrate } from '@/core/store/hydrate';
import { logOut } from './auth-api';
import { AxiosRequestConfig } from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
  otp?: string;
}

interface AuthRequestConfig extends AxiosRequestConfig {
  headers: {
    'x-linShare-2fa-pin'?: string;
  };
}

export async function login(credentials: LoginCredentials): Promise<void> {
  const params: AuthRequestConfig = {
    auth: {
      username: credentials.email,
      password: credentials.password,
    },
    headers: {},
  };

  if (credentials.otp) {
    params.headers['x-linShare-2fa-pin'] = credentials.otp;
  }

  const authStore = useAuthStore();
  const appStore = useAppStore();
  await authStore.fetchLoggedUser(params);
  appStore.setAuthenticated(true);
  hydrate();
}

export async function logout(): Promise<void> {
  await logOut();
  await dehydrate();
}
