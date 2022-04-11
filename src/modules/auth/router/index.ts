import { NavigationGuard, RouteRecordRaw } from 'vue-router';

const checkCredentials: NavigationGuard = (to) => {
  if (!to.params.email || !to.params.password) {
    return '/login';
  }
};

export const LoginRoutes: Array<RouteRecordRaw> = [
  {
    name: 'Login',
    path: '/login',
    props: true,
    component: () => import('../pages/Login.vue'),
  },
  {
    name: 'LoginUsingSecondFactorAuthentication',
    path: '/login/2fa',
    component: () => import('../pages/LoginSecondFactor.vue'),
    props: true,
    beforeEnter: [checkCredentials],
  },
  {
    name: 'OIDCCallback',
    path: '/oidc/callback',
    component: () => import('../components/OIDCCallback.vue'),
  },
];

export const ManageSecondFactorAuthenticationRoute: RouteRecordRaw = {
  name: 'ManageSecondFactorAuthentication',
  path: '/second_factor_authentication',
  component: () => import('../pages/ManageSecondFactorAuthentication.vue'),
  meta: {
    requiresAuth: true,
  },
};
