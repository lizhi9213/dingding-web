import Vue from 'vue'
import Router from 'vue-router'

// 3.0.2 给VueRoute添加一个goBack方法，用于记录路由的前进后退状态 this.isBack = true
Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
  //self.location=document.referrer;
}

//设置cookie
Router.prototype.setCookie = function (cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  // console.info(cname + "=" + cvalue + "; " + expires);
  document.cookie = cname + "=" + cvalue + "; " + expires;
  // console.info(document.cookie);
}
//获取cookie
Router.prototype.getCookie = function (cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return "";
}

Vue.use(Router)
// 路由懒加载，不同功能下所有组件都打包在同个异步块 (chunk)中，只需要使用 命名 chunk，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)。
const Home = () => import(/* webpackChunkName: "group-home" */ '@/views/home');
const Login = () => import(/* webpackChunkName: "group-login" */ '@/views/login');
const Customer = () => import(/* webpackChunkName: "group-cus" */ '@/views/customer');
const CustomerDetails = () => import(/* webpackChunkName: "group-cus" */ '@/views/customer-details');
const DetailsList = () => import(/* webpackChunkName: "group-cus" */ '@/views/details-list');
const CustomerAdd = () => import(/* webpackChunkName: "group-cus" */ '@/views/customer-add');
const Order = () => import(/* webpackChunkName: "group-cus" */ '@/views/order');
const ContactsAdd = () => import(/* webpackChunkName: "group-cus" */ '@/views/contacts-add');
const CustomerMyself = () => import(/* webpackChunkName: "group-cus" */ '@/views/customer-myself');
const RecordAdd = () => import(/* webpackChunkName: "group-rec" */ '@/views/record-add');
const Record = () => import(/* webpackChunkName: "group-rec" */ '@/views/record');
export const constantRouterMap = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requireAuth: true,
      allow: false
    }
  },

  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requireAuth: false,
      allow: false
    }
  },

  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requireAuth: true }
  },

  {
    path: '/customer',
    name: 'Customer',
    component: Customer,
    meta: {
      requireAuth: true
    }
  },

  {
    path: '/customer-details/:id',
    name: 'CustomerDetails',
    component: CustomerDetails,
    meta: { requireAuth: true }
  },

  {
    path: '/record',
    name: 'Record',
    component: Record,
    meta: { requireAuth: true }
  },

  {
    path: '/details-list/:type/:id/:uid/:cusno',
    name: 'DetailsList',
    component: DetailsList,
    meta: { requireAuth: false }
  },

  {
    path: '/customer-add/:id',
    name: 'CustomerAdd',
    component: CustomerAdd,
    meta: { requireAuth: true }
  },

  {
    path: '/order/:type/:id',
    name: 'Order',
    component: Order,
    meta: { requireAuth: true }
  },

  {
    path: '/record-add/:type/:cid/:cname/:sid',
    name: 'RecordAdd',
    component: RecordAdd,
    meta: { requireAuth: true }
  },

  {
    path: '/contacts-add/:id/:lid/:type',
    name: 'ContactsAdd',
    component: ContactsAdd,
    meta: { requireAuth: true }
  },

  {
    path: '/customer-myself',
    name: 'CustomerMyself',
    component: CustomerMyself,
    meta: { requireAuth: true }
  }
]

export default new Router({
  routes: constantRouterMap
})

