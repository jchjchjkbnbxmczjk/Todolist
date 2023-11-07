import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Login from '@/views/Login.vue'
// import Register from '@/views/Register';
// import Todo from '@/views/Todo.vue';
// import { createRouter, createWebHashHistory } from "vue-router";
import Register from '@/views/Register.vue';


Vue.use(VueRouter)


const routes = [
  // 当碰到/的时候跳到/login =》即login组件页面
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    // children:[
    //   {
    //     path: '/todo',
    //      name:'Todo',
    //      component:()=>import('../views/Todo.vue'),
    //      // component: Todo
    //      meta: {
    //       keepAlive: true,
    //     }
    //   },
    //   {
    //     path: '/register',
    //      name:'Register',
    //      component:()=>import('../views/Register.vue'),
    //      meta: {
    //       keepAlive: true,
    //     }
    //      // component: Todo
    //   },
    // ]
  },
  {
    path: '/todo',
    name: 'Todo',
    component: () => import('../views/Todo.vue')
    // component: Todo
  },
  {
    path: '/register',
    name: 'Register',
    // component:()=>import('../views/Todo.vue')
    component: Register
  },


  // {
  //   path: '/login',
  //   name:'Login',
  //   component:()=>import('../views/Login.vue')
  // },

  // {
  //   path: '/todo',
  //   name:'Todo',
  //   component:()=>import('../views/Todo.vue')
  // },




]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 添加路由导航守卫
// 添加路由导航守卫
// 用来对访问的路由进行权限控制
// 除了login这个路由其他的路由都要进行了登录之后才能访问
router.beforeEach((to, from, next) => {  
      //前置导航守卫函数
  console.log(to)
  console.log(from)
  console.log(next)
  // 判断访问的是否是登录页面
  // if (to.path === '/login') {
  // 	return next()
  // 	// 判断当前sessionStorage中是否有token(判断是否登录过)
  // } else if (window.sessionStorage.getItem('token')) {
  // 	return next()
  // } else {
  // 	return next('/login')
  // }

  // if(to.path=== '/login' || window.sessionStorage.getItem('token')) return next()
  // return next('/login')
  // 这里应该要判断是否登录好，到时候看登录有token就代表登录好了,相当于没有token就必须跳转到登录
  if(sessionStorage.getItem('token')){
    // 如果有token则是登录了 想去哪里去哪里
    next()
  }else if((to.name=='Login'||to.name=='Register')&&!window.sessionStorage.getItem('token')){
    // 如果没token但是这两个页面可以随时进,登录和注册不需要拦截，直接放行
    next()
  }else{
    next("/login") 
  }
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router