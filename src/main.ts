import { createApp } from 'vue';
import App from './App.vue';
import router from '@/core/router';
import i18n from '@/core/plugins/i18n';
import store from '@/core/store';
import useAntdComponents from '@/core/plugins/antd';

const app = createApp(App).use(store).use(router).use(i18n);

useAntdComponents(app).mount('#app');
