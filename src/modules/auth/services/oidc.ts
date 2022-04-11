/* eslint-disable camelcase */
import { UserManager } from 'oidc-client';
import { AxiosRequestConfig } from 'axios';
import store from '@/core/store';
import { logOut } from './auth-api';
import { dehydrate, hydrate } from '@/core/store/hydrate';
import config from '@/config';

const oidcSetting = config.oidcSetting;
const manager = new UserManager({
  authority: oidcSetting.authority,
  client_id: oidcSetting.client_id,
  client_secret: oidcSetting.client_secret,
  scope: oidcSetting.scope,
  redirect_uri: window.location.origin + '/#/oidc/callback',
  response_type: 'code',
  post_logout_redirect_uri: window.location.origin + '/',
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
  await store.dispatch('Auth/fetchLoggedUser', authRequestConfig);
  store.commit('setAuthenticating', false);

  await hydrate();
}

export async function signOut(): Promise<void> {
  await logOut();
  await dehydrate();
  manager.signoutRedirect();
}
