import { App } from '@vue/runtime-core';
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Input,
  Alert
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

function useAntdComponents (vueApp: App): App {
  return vueApp
    .use(Alert)
    .use(Card)
    .use(Col)
    .use(Button)
    .use(Form)
    .use(Input)
    .use(Row);
}

export default useAntdComponents;
