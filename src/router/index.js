// 1. 引入
import Vue from 'vue'
import Router from 'vue-router'

// 2. 全局注册
Vue.use(Router)

// 3. 静态引入Layout页面组件(主体架子)
import Layout from '@/layout'
// 引入多个模块的规则
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'

// 4. 静态路由规则数组(里面的所有路由对象都不做权限管理)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    /*
    如果侧边需要出现导航，则应该满足两个条件
      - 没有hidden: true,的键值对
      - 添加一个元信息对象 meta: { title: '首页', icon: 'dashboard' }
    */
    hidden: true,
    meta: { title: '首页', icon: 'dashboard' }
  },
  // 导入Excel组件路径
  {
    path: '/import',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        name: 'import',
        component: () => import('@/views/import/index')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 一级路由 - 首页板块
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      // 元信息对象：配置一些额外的数据
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }

  // 当所有的规则都匹配不上, 统一走404(都要放在规则数组的尾部)
  // { path: '*', redirect: '/404', hidden: true }
]
// 5. 动态路由规则数组(里面的所有路由对象后期都要权限管理)
export const asyncRoutes = [
  departmentsRouter, // 组织架构
  settingRouter, // 设置
  employeesRouter, // 员工
  permissionRouter, // 权限管理
  approvalsRouter, // 审批
  attendancesRouter, // 考勤
  salarysRouter, // 薪资
  socialRouter// 社保
]
// 6. 调用函数, 创建一个全局的路由对象
const createRouter = () => new Router({
  mode: 'history', // 配置路由模式
  // 在页面切换时, 进入到新的页面时, 都会滚动到页面的顶部 scorllTop = 0
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    ...constantRoutes
    // 动态路由需要做权限管理，这里不做引入，在全局前置守卫处理
    // ...asyncRoutes
  ] // 路由规则对象数组
})
const router = createRouter()

// 7. 重置路由对象
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}

// 8. 导出路由对象
export default router

// ---------------------之前使用路由的方式---------------
// import VueRouter from 'vue-router'
// import Vue from 'vue'

// Vue.use(VueRouter)

// 1) 常规写法 --- 静态引入(直接加载)
// import Login from '@/views/login/index.vue'
// const router = new VueRouter({
//   routes: [
//     { path: '/login', component: Login }
//   ]
// })
// export default router

// 2) 高频写法(推荐) --- 动态引入(路由懒加载)
// const router = new VueRouter({
//   routes: [
//     { path: '/login', component: () => import ('@/views/login/index.vue') }
//   ]
// })
// export default router

/**
 1) 注意点: 静态引入 和 动态引入 都会有缓存
     - 只要页面组件有被引入一次, 后边都是直接去读取缓存数据
 2) 静态引入 和 动态引入 的选择问题
     - 如果当前的页面组件不是在首屏渲染时要立马展示, 都统一采用动态引入形式
     - 如果当前的页面组件在首屏渲染时要立马展示, 可以采用静态引入
     - 一般LayOut页面组件采用静态引入
 */
