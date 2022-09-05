/*
  1) 这个文件的主要作用是什么?
  - 权限控制 (整个项目的 页面访问拦截 和 权限 都是在这个文件中写的)
  - 一般像后台管理系统项目, 都是需要做权限控制的
    - 如果用户没有token, 统一拦截去登录
    - 如果用户访问一些不需要拦截的页面, 直接放行

  2) 页面访问拦截的具体步骤
  - 配置一个白名单数组
    const whiteList = ['/login', '/404']
  - 在路由的全局前置守卫中
    - 获取token
    - 判断
      - 如果有token
        - 访问的是登录页, 或者404页面, 引导去首页
        - 访问其它页面, 直接放行
      - 如果没有token
        - 访问的是登录页, 或者404页面,直接放行
        - 访问是其它页面, 拦截去登录页面
*/
// 1. 引入
import router from '@/router'
import store from '@/store'
// 引入进度条插件
import NProgress from 'nprogress' // 引入进度条对象
// 如果要重写进度条样式, 可以复制一份独立修改, 尽量不要在源文件上修改
import '@/styles/NProgress.scss' // 引入进度条样式
const whiteList = ['/login', '/404']
// 2. 配置路由全局前置守卫
router.beforeEach(async(to, from, next) => {
  // 开启进入条效果
  NProgress.start()
  if (store.getters.token) {
    // 有身份 & 去登录页
    if (to.path === '/login') {
      next('/')// 拦截去主页面
      // 结束进度条
      NProgress.done()
    } else { // 有身份 & 去其它页面
      if (!store.state.user.userInfo.userId) {
        const res = await store.dispatch('user/getUserInfo')
        // console.log(res.roles.menus)
        const otherRoutes = await store.dispatch('permission/filterRouter', res.roles.menus)
        // console.log(res)
        // 在这里做动态路由规则
        /*
          addRoutes 的作用:
            - 动态的在原有的路由规则基础上, 新增路由
          语法:
            - 给已有的路由实例动态添加路由规则
            router.addRoutes([{ path: xx, component: xxx, name: xxx }, ...])
         */
        // 添加动态路由（异步操作，为了避免出现访问路径丢失问题，重新再进入一次页面）
        router.addRoutes([
          ...otherRoutes,
          // 最后放上404，访问不存在的页面时跳转到404
          { path: '*', redirect: '/404', hidden: true }
        ])
        next({
          ...to // 重新去一次原来的地方
          // replace: true // 解决跳转历史重复问题
        })
        router.replace(to.path) // 解决跳转历史重复问题
        return
      }
      next()// 直接放行
    }
  } else {
    // 没有身份
    if (whiteList.indexOf(to.path) !== -1) {
      // 去白名单中路径对应的页面
      next()
    } else {
      // 结束进度条
      NProgress.done()
      // 去白名单中路径对应以外的页面
      next('/login')
    }
  }
})
// 3. 配置路由全局后置守卫
router.afterEach((to, from) => {
  // 结束进度条
  NProgress.done()
})
// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
