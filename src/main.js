import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './plugins/element.js';

// 引入全局css
import './assets/css/global.css';
// 引入字体图标裤
import './assets/fonts/iconfont.css';

import ElementUI from 'element-ui';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 将axios注册给vue
Vue.prototype.$http = axios;
// 将Element注册给vue
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
