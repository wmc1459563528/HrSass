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
