import { App } from '@vue/runtime-core';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Layout,
  Pagination,
  Popover,
  Row,
  Select,
  Table
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

function useAntdComponents (vueApp: App): App {
  return vueApp
    .use(Alert)
    .use(Avatar)
    .use(Badge)
    .use(Button)
    .use(Card)
    .use(Col)
    .use(Dropdown)
    .use(Form)
    .use(Input)
    .use(Menu)
    .use(Modal)
    .use(Layout)
    .use(Pagination)
    .use(Popover)
    .use(Row)
    .use(Select)
    .use(Table);
}

export default useAntdComponents;
