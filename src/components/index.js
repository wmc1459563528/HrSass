// 引入组件
// 全局注册的组件
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImage from './UploadImage'
import ScreenFull from './ScreenFull'
// 语言包
import Language from './Language'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImage', UploadImage)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('Language', Language)
  }
}
