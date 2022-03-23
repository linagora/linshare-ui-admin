import { createApp } from 'vue';
import App from './App.vue';
import router from '@/core/router';
import i18n from '@/core/plugins/i18n';
import store from '@/core/store';
import useAntdComponents from '@/core/plugins/antd';
import { requiresAuthGuard } from './modules/auth/router/requiresAuth.guard';
import { requiresDomainAccessibility } from './modules/domain/router/requiresDomainAccessibility';
import { requiresDomainUpdate } from './modules/domain/router/requiresDomainUpdate';

requiresDomainUpdate(router, store);
requiresAuthGuard(router, store);
requiresDomainAccessibility(router, store);

const app = createApp(App).use(store).use(router).use(i18n);

useAntdComponents(app).mount('#app');
