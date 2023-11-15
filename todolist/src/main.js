import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import ElementUI from 'element-ui'; //element元素
import Antd from 'ant-design-vue'; //引入组件
import 'element-ui/lib/theme-chalk/index.css'; //element css元素
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';
import request from './utils/request';
// import request from "@/utils/request";
//  request.get("http://localhost:8080/user/findAll").then( res=> {
//       console.log(res);
//     })
Vue.prototype.request = request  //全局注册request，其他文件可通过this.request使用分装好的request实例

// // 计算响应式
// import 'lib-flexible-computer'
// import request from './api';

// import VueRouter from "vue-router";


// 将请求对象，绑定到vue的原型上
// $request 这个是我们自定义的变量名称
// Vue.prototype.$request = request
Vue.prototype.$axios = axios

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Antd);
// // 注册全局
// Vue.use(VueRouter);

new Vue({
  router,
  store,
  axios,
  el: '#app',
  // data: {
  //   todos: []
  // },
  render: h => h(App)
});
