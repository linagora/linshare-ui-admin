import { App } from '@vue/runtime-core';
import {
  Alert,
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Layout,
  List,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Select,
  Table,
  Tabs,
  Tag
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

function useAntdComponents (vueApp: App): App {
  return vueApp
    .use(Alert)
    .use(AutoComplete)
    .use(Avatar)
    .use(Badge)
    .use(Button)
    .use(Card)
    .use(Checkbox)
    .use(Col)
    .use(Dropdown)
    .use(Form)
    .use(Input)
    .use(Menu)
    .use(Modal)
    .use(Layout)
    .use(List)
    .use(Pagination)
    .use(Popover)
    .use(Popconfirm)
    .use(Row)
    .use(Select)
    .use(Table)
    .use(Tabs)
    .use(Tag);
}

export default useAntdComponents;
