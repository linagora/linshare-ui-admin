import { Button } from 'ant-design-vue';
import { App } from '@vue/runtime-core';
import 'ant-design-vue/dist/antd.css';

function useAntdComponents (vueApp: App): App {
  return vueApp
    .use(Button);
}

export default useAntdComponents;
