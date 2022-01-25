import { NavigationGuard, RouteRecordRaw } from 'vue-router';
import store from '@/core/store';
import { isEnable } from '@/core/utils/functionality';

const checkSecondFAEnabled: NavigationGuard = () => {
  const functionality = store.getters['Domain/getLoggedUserFunctionality']('SECOND_FACTOR_AUTHENTICATION');

  return isEnable(functionality) || '/';
};

export const LoginRoutes: Array<RouteRecordRaw> = [
  {
    name: 'Login',
    path: '/login',
    props: true,
    component: () => import('../pages/Login.vue')
  },
  {
    name: 'LoginUsingSecondFactorAuthentication',
    path: '/login/2fa',
    component: () => import('../pages/LoginSecondFactor.vue'),
    props: true,
    beforeEnter: (to, from, next) => {
      if (!to.params.email || !to.params.password) {
        return next('/login');
      }
      next();
    }
  },
  {
    name: 'OIDCCallback',
    path: '/oidccallback',
    component: () => import('../components/OIDCCallback.vue')
  }
];

export const ManageSecondFactorAuthenticationRoute: RouteRecordRaw = {
  name: 'ManageSecondFactorAuthentication',
  path: '/second_factor_authentication',
  component: () => import('../pages/ManageSecondFactorAuthentication.vue'),
  beforeEnter: [checkSecondFAEnabled],
  meta: {
    requiresAuth: true
  }
};
