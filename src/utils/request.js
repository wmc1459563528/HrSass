// 1. 引入
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// 2. 创建了一个axios实例对象
const http = axios.create({
  // 2.1 从环境变量中去取接口的基地址(手动转自动)
  // process.env: 获取当前运行的环境变量对象
  baseURL: process.env.VUE_APP_BASE_API,
  // 2.2 请求过期时间
  timeout: 5000
})

// 3. 配置axios实例对象的请求拦截器
// 在请求发出去之前, 做一些公共的配置, 比如: 携带token
http.interceptors.request.use(
  config => {
    // 发送请求时携带token
    // console.log(store.getters.token)
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // console.log(error)
    return Promise.reject(error)
  }
)

// 4. 配置axios实例对象的响应拦截器
// 在响应到达页面之前, 做一些针对数据的公共处理, 比如: 统一解构返回的数据
http.interceptors.response.use(
  response => {
    // 4.1 取出数据对象
    const res = response.data
    // console.log(res)
    if (res.success === false) {
      // 统一提示用户
      Message.error(res.message)
      // 返回错误
      return Promise(new Error(res.message))
    }
    // 4.3 正常情况
    return res
  },
  error => {
    // 处理4XX，5XX的错误
    // console.dir(error)
    if (error.response) {
      // 处理token过期
      if (error.response.status === 401 && error.response.data.code === 10002) {
        // 向仓库派发任务 清除本地token和登录信息
        store.dispatch('user/loginOut')
        Message.error('登录信息已过期,请您重新登录')
        router.push('/login')
      } else {
        // Message.error(error.message)
        Message.error(error.response.data.message)
      }
    } else {
      Message.error(error.message)
    }
    return Promise.reject(error)
  }
)

// 5. 导出axios实例对象
export default http
