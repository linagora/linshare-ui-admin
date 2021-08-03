import { createRouter, createWebHashHistory } from 'vue-router';
import { requiresAuthGuard } from '@/modules/auth/router';
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

requiresAuthGuard(router);

export default router;
