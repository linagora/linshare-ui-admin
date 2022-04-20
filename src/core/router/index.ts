import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';

/**
 * We prefer hash routing for 2 reasons:
 *  - Ease for webserver configuration as the app can be served under a subpath
 *  - Callback uri for OIDC authentication is fixed in the app
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
