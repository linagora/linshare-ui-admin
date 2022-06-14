/* eslint-disable camelcase */
import { UserManager } from 'oidc-client';
import { AxiosRequestConfig } from 'axios';
import { logOut } from './auth-api';
import config from '@/config';
import { useAuthStore } from '@/modules/auth/store';
import { useAppStore } from '@/core/store';
import { hydrate, dehydrate } from '@/core/store/hydrate';

const oidcSetting = config.oidcSetting;
const manager = new UserManager({
  authority: oidcSetting.authority,
  client_id: oidcSetting.client_id,
  client_secret: oidcSetting.client_secret,
  scope: oidcSetting.scope,
  response_type: 'code',
  redirect_uri: `${window.location.origin}${window.location.pathname}#/oidc/callback`,
  post_logout_redirect_uri: `${window.location.origin}${window.location.pathname}`,
});

interface OIDCBearerRequest extends AxiosRequestConfig {
  headers: {
    Authorization: string;
  };
}

export function signinRedirect(): void {
  manager.signinRedirect();
}

export async function signinCallback(): Promise<void> {
  const { access_token } = await manager.signinRedirectCallback();
  const authRequestConfig: OIDCBearerRequest = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const authStore = useAuthStore();
  const appStore = useAppStore();

  await authStore.fetchLoggedUser(authRequestConfig);
  appStore.setAuthenticating(false);

  await hydrate();
}

export async function signOut(): Promise<void> {
  await logOut();
  await dehydrate();
  manager.signoutRedirect();
}
