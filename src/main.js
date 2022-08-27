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

// 11. 往原型对象上绑定全局方法
// import http from './utils/request'
// Vue.prototype.$http = http

// 11. 自定义全局指令
// 第一种方式
// import '@/directives'

// 第二种方式
/* import { imgerror, color } from '@/directives/index'
Vue.directive('imgerror', imgerror)
Vue.directive('color', color)
 */
// 改进1: -----批量导入--------
import * as directives from '@/directives/index'
// for (const key in directives) {
//   Vue.directive(key, directives[key])
// }
// todo 改进2: -----批量导入--------
Object.keys(directives).forEach(item => {
  Vue.directive(item, directives[item])
})
/*
  todo 在项目开发过程中, 遍历优先选数组, 选择对象次之
  - 原因1: 数组是有序的, 对象是无序的
  - 原因2: 数组有更多的内置方法, 对象相对较少
  todo 第二种写法的可扩展性会更强
*/
// todo 12.注册全局组件
/* import PageTools from '@/components/PageTools'
Vue.component('PageTools', PageTools) */
import HrSassUI from '@/components'
Vue.use(HrSassUI)
// todo 13. 注册全局过滤器
/* import dayjs from 'dayjs'
Vue.filter('formatData', value => {
  return dayjs(value).format('YYYY年MM月DD日')
}) */
import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
// 将App.vue根组件转换成DOM元素渲染到指定的挂载点(灰常重要)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
