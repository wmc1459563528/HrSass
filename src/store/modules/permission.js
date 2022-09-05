import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 作用：动态控制左侧菜单
  router: constantRoutes
}
const mutations = {
  // 1. 根据不同用户信息中的menus数组, 在原有的数组基础上添加新的路由规则对象
  // otherRoutes: 要追加进来的路由对象数组
  setRouters(state, otherRoutes) {
    state.router = [...constantRoutes, ...otherRoutes]
  }
}
const actions = {
  // 1. 根据menus数组去筛选路由
  filterRouter(ctx, menus) {
    // console.log(menus)
    // 1.1 根据menu筛选出该用户所拥有的动态路由对象
    // todo 根据动态路由过滤出包含item中children中下标为0的name
    const otherRoutes = asyncRoutes.filter(item => {
      return menus.includes(item.children[0].name)
    })
    // console.log(otherRoutes)
    // 1.2 提交mutation
    ctx.commit('setRouters', otherRoutes)
    return otherRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
