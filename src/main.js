// 1. 全局引入Vue
import Vue from 'vue'
// 2. 引入全局的css重置样式文件
import 'normalize.css/normalize.css'
// 3. 完整导入ElementUI
/*
   ElementUI有两种引入方式: 完整导入  和  按需导入
   如何选择?
   如果项目是toC的项目, 一律采用按需导入
   如果项目是toB的项目, 一般采用完整导入
   注意:
    按需导入, 打包时体积是会比较小
    完整导入, 打包时体积是固定的(比较大的)
    解决方案: CDN
*/
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // 英文语言包

// 4. 引入项目要用到的全局样式文件
// @是webpack配置的一个别名, 指向src目录
import '@/styles/index.scss'

// 5. 引入根组件
import App from './App'
// 6. 引入仓库
import store from './store'
// 7. 引入路由
import router from './router'
// 8. 引入字体图标文件
import '@/icons'
// 9. 引入权限控制文件
import '@/permission'

// 10. 全局注册ElementUI插件
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// 将 http方法, 挂载到原型上
import http from './utils/request'
Vue.prototype.$http = http

// 11. 查看当前项目运行的环境
// console.log(process.env.NODE_ENV) // development

// 将App.vue根组件转换成DOM元素渲染到指定的挂载点(灰常重要)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
  // =======
  // render: function(createElement) {
  //   return createElement(App)
  // }
  // 简写 ======
  // render(createElement) {
  //   return createElement(App)
  // }
  // 再次简写 =====
  // render(h) {
  //   return h(App)
  // }
  // 最终简写 =====
  // render: h => h(App)

})
