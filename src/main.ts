import { createApp } from 'vue';
import App from './App.vue';
import router from '@/core/router';
import store from '@/core/store';
import useAntdComponents from '@/core/plugins/antd';

const app = createApp(App).use(store).use(router);

useAntdComponents(app).mount('#app');
