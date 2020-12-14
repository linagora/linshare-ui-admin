import { LoginRoutes } from '@/modules/auth/router';

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/core/views/About.vue'),
    meta: {
      requiresAuth: true
    }
  },
  ...LoginRoutes
];
