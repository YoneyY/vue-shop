import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login.vue';
import Home from './components/Home.vue';
import Welcome from './views/Welcome.vue';
import Users from './views/Users.vue';
import Rights from './views/Rights.vue';
import Goods from './views/Goods.vue'

Vue.use(Router);

export default new Router({
  routes: [
    // 重定向到home页面
    {
      path: '/',
      redirect: '/welcome'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/welcome',
          name: 'Welcome',
          component:Welcome
        },
        {
          path: '/users',
          name: 'Users',
          component:Users
        },
        {
          path: '/rights',
          name: 'Rights',
          component:Rights
        },
        {
          path: '/goods',
          name: 'Goods',
          component:Goods
        }
      ]
    }
  ]
});