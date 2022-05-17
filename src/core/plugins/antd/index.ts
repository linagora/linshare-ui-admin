import { App } from '@vue/runtime-core';
import {
  Alert,
  AutoComplete,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  ConfigProvider,
  DatePicker,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Layout,
  List,
  Pagination,
  Progress,
  Popconfirm,
  Popover,
  Result,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'ant-design-vue';
import '@/core/styles/variables.less';

function useAntdComponents(vueApp: App): App {
  return vueApp
    .use(Alert)
    .use(AutoComplete)
    .use(Avatar)
    .use(BackTop)
    .use(Badge)
    .use(Breadcrumb)
    .use(Button)
    .use(Card)
    .use(Checkbox)
    .use(ConfigProvider)
    .use(Col)
    .use(Collapse)
    .use(DatePicker)
    .use(Drawer)
    .use(Dropdown)
    .use(Form)
    .use(Input)
    .use(Menu)
    .use(Modal)
    .use(Layout)
    .use(List)
    .use(Pagination)
    .use(Progress)
    .use(Popover)
    .use(Popconfirm)
    .use(Result)
    .use(Row)
    .use(Select)
    .use(Spin)
    .use(Table)
    .use(Tabs)
    .use(Tag)
    .use(Tooltip);
}

export default useAntdComponents;
