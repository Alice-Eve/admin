import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'
import { initMenu } from "./utils/menus";


import {
  Autocomplete,
  Breadcrumb,
  BreadcrumbItem,
  Card,
    Collapse,
    CollapseItem,
  Dialog,
  Drawer,
  Input,
  InputNumber,
  Image,
  Icon,
  Popconfirm,
  Tooltip,
  Button,
  Form,
  FormItem,
  Container,
  Header,
  Table,
  TableColumn,
  Aside,
  Radio,
  RadioGroup,
    Pagination,
  Menu,
    Select,
    Tabs,
    Tag,
    TabPane,
    Tree,
  Submenu,
  Switch,
  MenuItem,
  Main,
    Option,
    Row,
    Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Avatar,
  MessageBox,
  Loading,
  Message,
} from 'element-ui';

Vue.use(Autocomplete);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Col);
Vue.use(Row);
Vue.use(Dialog);
Vue.use(Tabs);
Vue.use(Tag);
Vue.use(TabPane);
Vue.use(Tree);
Vue.use(Drawer);
Vue.use(Popconfirm);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Tooltip);
Vue.use(InputNumber);
Vue.use(Image);
Vue.use(Table);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Menu);
Vue.use(Option);
Vue.use(Submenu);
Vue.use(Switch);
Vue.use(Select);
Vue.use(MenuItem);
Vue.use(Main);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Avatar);

Vue.use(Loading.directive);

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

import {postRequest} from "./utils/api";
import {postKeyValueRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";

Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.path == '/') {
    next();
  } else {
    if (window.sessionStorage.getItem("user")) {
      initMenu(router, store);
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
