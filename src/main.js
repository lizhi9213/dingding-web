// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// 2.0 导入需要的静态资源
// 2.0.2 导入mui的样式
import '../static/mui/css/mui.css'
// ui框架样式
import 'mint-ui/lib/style.min.css'
import 'element-ui/lib/theme-chalk/index.css';
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-light.css' // 使用 carbon 主题
import 'ml-ui/styles/index.css'
// 2.0.2 导入公共部分的样式
import '../static/css/site.css'
// 2.0.3 导入layui 的gride布局样式
import '../static/layui/layui-row.css'
// 2.0.4 导入自定义字体样式
import '../static/font/iconfont.css'
import '../static/mui/css/icons-extra.css'


// 3.0 导入各组件对象
// import 'babel-polyfill'
import mintui from 'mint-ui'
import ElementUI from 'element-ui';
import vueTap from 'v-tap';
import MuseUI from 'muse-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'
import MlUi from 'ml-ui'
import vuescroll from 'vue-scroll'


// Vue.prototype.axios = axios

// 4.0 在Vue 中使用各个组件
Vue.use(mintui)
Vue.use(ElementUI)
Vue.use(vueTap)
Vue.use(MuseUI)
Vue.use(MlUi)
Vue.use(vuescroll)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

// // 路由导航守卫
router.beforeEach((to, from, next) => {
  let time = new Date().getTime();
  // 设置是否能使用浏览器返回，login和home页面是不能使用浏览器返回的
  if (to.fullPath.indexOf("/login") >= 0 || to.fullPath == '/' || to.fullPath.indexOf('/Home') >= 0) {
    store.commit("sessionuAllow", false);
  } else {
    store.commit("sessionuAllow", true);
  }
  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    //console.log(store.state.uId)
    if (store.state.uId !== '') { // 通过vuex state获取当前的token是否存在
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
const root = new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

// axios 拦截器
axios.interceptors.request.use(
  config => {
    // console.log(config);
    // config.url = 'http://171.11.74.219:17915/data/' + config.url;
    config.url = 'http://171.8.5.209:19000/data/' + config.url;
    return config;
  },
  err => {
    return Promise.reject(err);
  });
