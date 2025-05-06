import { NavigationGuard, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';
import { useAuth2FAStore } from '@/modules/auth/store/auth2FAstore';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
const checkCredentials: NavigationGuard = (to) => {
  const auth2FAStore = useAuth2FAStore();
  if (!auth2FAStore.email || !auth2FAStore.password) {
    return '/login';
  }
};

const checkLoggedIn: NavigationGuard = (to) => {
  const authStore = useAuthStore();
  if (authStore.loggedUser) {
    return '/administration';
  }
};

const checkIsSuperAdmin: NavigationGuard = (to) => {
  const authStore = useAuthStore();
  if (authStore?.loggedUserRole !== ACCOUNT_ROLE.SUPERADMIN) {
    return '/';
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

export const ManageChangePasswordRoute: RouteRecordRaw = {
  name: 'ManageChangePassword',
  path: '/change_password',
  component: () => import('../pages/manage-change-password.vue'),
  beforeEnter: [checkIsSuperAdmin],
  meta: {
    requiresAuth: true,
  },
};
