import { NavigationGuard, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';
const checkCredentials: NavigationGuard = (to) => {
  if (!to.params.email || !to.params.password) {
    return '/login';
  }
};

const checkLoggedIn: NavigationGuard = (to) => {
  const authStore = useAuthStore();
  if (authStore.loggedUser) {
    return '/administration';
  }
};

export const LoginRoutes: Array<RouteRecordRaw> = [
  {
    name: 'Login',
    path: '/login',
    props: true,
    component: () => import('../pages/login-page.vue'),
    beforeEnter: [checkLoggedIn],
  },
  {
    name: 'LoginUsingSecondFactorAuthentication',
    path: '/login/2fa',
    component: () => import('../pages/login-second-factor.vue'),
    props: true,
    beforeEnter: [checkCredentials],
  },
  {
    name: 'OIDCCallback',
    path: '/oidc/callback',
    component: () => import('../components/oidc-callback.vue'),
  },
];

export const ManageSecondFactorAuthenticationRoute: RouteRecordRaw = {
  name: 'ManageSecondFactorAuthentication',
  path: '/second_factor_authentication',
  component: () => import('../pages/manage-second-factor-authentication.vue'),
  meta: {
    requiresAuth: true,
  },
};
