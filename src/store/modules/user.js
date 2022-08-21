// 引入登录的接口函数
import { reqGetProfile, reqGetUserInfo, reqLogin } from '@/api/user'
// 引入js-cookie来操作token
import { setToken, getToken, removeToken } from '@/utils/auth'

const state = () => ({
  // 一运行要从本地获取下存储的token
  token: getToken() || '',
  // 存储用户信息
  userInfo: {}
})

const mutations = {
  // 1. 设置新token
  setNewToken(state, newToken) {
    state.token = newToken
    // 往本地存储一份
    setToken(newToken)
  },
  // 设置用户信息
  setUserInfo(state, newUserinfo) {
    state.userInfo = newUserinfo
  },
  // 清除本地token及仓库token
  removeToken(state) {
    state.token = ''
    removeToken()
  },
  // 清除仓库中的用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  // 1. 获取登录信息
  async login(ctx, data) {
    const res = await reqLogin(data)
    console.log(res)
    // 1.1 提交mutations, 存储token
    ctx.commit('setNewToken', res.data)
    // 将promise对象返回出去
    return res
  },

  /*  login(ctx, data) {
    return new Promise((resolve, reject) => {
      reqLogin(data).then((res) => {
        // 1.1 提交mutations, 存储token
        ctx.commit('setNewToken', res.data)
        resolve(res.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }, */
  // 2. 获取用户信息
  async getUserInfo(ctx) {
    const res = await reqGetProfile()
    // console.log(res)
    // 获取用户信息
    const res2 = await reqGetUserInfo(res.data.userId)
    // 合成完整的用户信息对象
    const userObj = { ...res.data, ...res2.data }
    ctx.commit('setUserInfo', userObj)
    return res
  },
  // 3. 退出登录
  loginOut(ctx) {
    ctx.commit('removeToken')
    ctx.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

