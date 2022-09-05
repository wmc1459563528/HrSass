// 引入组件
// 全局注册的组件
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImage from './UploadImage'
import ScreenFull from './ScreenFull'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImage', UploadImage)
    Vue.component('ScreenFull', ScreenFull)
  }
}
