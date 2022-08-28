// 引入组件
// 全局注册的组件
import PageTools from './PageTools'
import UploadExcel from './UploadExcel/index'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
