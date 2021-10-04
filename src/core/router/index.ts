import { createRouter, createWebHashHistory } from 'vue-router';
import { requiresAuthGuard } from '@/modules/auth/router';
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

requiresAuthGuard(router);

export default router;
