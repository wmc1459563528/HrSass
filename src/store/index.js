// 1. 引入
import Vue from 'vue'
import Vuex from 'vuex'
// 2. 引入全局的getters
import getters from './getters'
// 3. 引入小仓库
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'

// 4. 全局注册
Vue.use(Vuex)
// 5. 创建一个根仓库对象
const store = new Vuex.Store({
  // 5.1 放置小仓库
  modules: {
    app,
    settings,
    user,
    permission
  },
  // 5.2 配置全局的getters
  getters
})
// 6.导出
export default store
