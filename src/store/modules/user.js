// 引入登录的接口函数
import { reqLogin } from '@/api/user'
// 引入js-cookie来操作token
import { setToken, getToken } from '@/utils/auth'

const state = () => ({
  // 一运行要从本地获取下存储的token
  token: getToken() || ''
})

const mutations = {
  // 1. 设置新token
  setNewToken(state, newToken) {
    state.token = newToken
    // 往本地存储一份
    setToken(newToken)
  }
}

const actions = {
  /*  // 1. 登录
  async login(ctx, data) {
    const res = await reqLogin(data)
    console.log(res)
    // 1.1 提交mutations, 存储token
    ctx.commit('setNewToken', res.data)
    // 将promise对象返回出去
    return res
  } */
  login(ctx, data) {
    return new Promise((resolve, reject) => {
      reqLogin(data).then((res) => {
        // 1.1 提交mutations, 存储token
        ctx.commit('setNewToken', res.data)
        resolve(res.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

