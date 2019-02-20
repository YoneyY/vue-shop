import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";

// 引入全局css
import "./assets/css/global.css";
// 引入字体图标裤
import "./assets/fonts/iconfont.css";

import ElementUI from "element-ui";
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 将axios注册给vue
Vue.prototype.$http = axios;
// 设置拦截器 验证token
axios.interceptors.request.use(function(config) {
  var token = window.sessionStorage.getItem("token");
  config.headers.Authorization = token;
  return config;
}),
  function(error) {
    return Promise.reject(error);
  };
// 将Element注册给vue
Vue.use(ElementUI);

Vue.config.productionTip = false;
// 导航守卫  取session是否存有token 如果没有将跳转到登录页面 如果有继续向下执行
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    return next();
  }
  var session = window.sessionStorage.getItem("token");
  if (!session) {
    return next("/login");
  }
  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
