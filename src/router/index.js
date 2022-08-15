// 1. 引入
import Vue from 'vue'
import Router from 'vue-router'

/* ---------------------之前使用路由的方式---------------
import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)
 */
/* 1) 常规写法 --- 静态引入(直接加载)
import Login from '@/views/login/index.vue'
const router = new VueRouter({
  routes: [
    { path: '/login', component: Login }
  ]
})
export default router */

/* 2) 高频写法(推荐) --- 动态引入(路由懒加载)
const router = new VueRouter({
  routes: [
    { path: '/login', component: () => import('@/views/login/index.vue') }
  ]
})
export default router */
/**
 1) 注意点: 静态引入 和 动态引入 都会有缓存
     - 只要页面组件有被引入一次, 后边都是直接去读取缓存数据
 2) 静态引入 和 动态引入 的选择问题
     - 如果当前的页面组件不是在首屏渲染时要立马展示, 都统一采用动态引入形式
     - 如果当前的页面组件在首屏渲染时要立马展示, 可以采用静态引入
     - 一般LayOut页面组件采用静态引入
 */

// 2. 全局注册
Vue.use(Router)

// 3. 静态引入Layout页面组件(主体架子)
import Layout from '@/layout'

// 4. 按需导出静态路由数组 (写在这个数组内部的路由规则对象是不需要做权限管理的)
// 加按需导出, 可以方便外部拿到这个静态数组去做一些业务
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  // 当所有的规则都匹配不上, 统一走404(都要放在规则数组的尾部)
  { path: '*', redirect: '/404', hidden: true }
]

// 5. 调用函数, 创建一个全局的路由对象
const createRouter = () => new Router({
  mode: 'hash', // 配置路由模式
  // 在页面切换时, 进入到新的页面时, 都会滚动到页面的顶部 scorllTop = 0
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes // 路由规则对象数组
})
const router = createRouter()

// 6. 重置路由对象
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 7. 导出路由对象
export default router

