const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // token
  name: state => state.user.userInfo.username, // 用户名
  staffPhoto: state => state.user.userInfo.staffPhoto, // 用户头像
  routes: state => state.permission.router, // 获取路由数组
  roles: state => state.user.userInfo.roles // 获取权限数组

}
export default getters

