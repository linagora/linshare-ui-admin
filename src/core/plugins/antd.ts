import { App } from '@vue/runtime-core';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Menu,
  Layout,
  Row,
  Select
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

function useAntdComponents (vueApp: App): App {
  return vueApp
    .use(Alert)
    .use(Button)
    .use(Card)
    .use(Col)
    .use(Form)
    .use(Input)
    .use(Menu)
    .use(Layout)
    .use(Row)
    .use(Select);
}

export default useAntdComponents;
