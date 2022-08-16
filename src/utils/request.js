// 1. 引入
import axios from 'axios'

// 2. 创建了一个axios实例对象
const http = axios.create({
  // 2.1 从环境变量中去取接口的基地址
  baseURL: process.env.VUE_APP_BASE_API,
  // 2.2 请求过期时间
  timeout: 5000
})

// 3. 配置axios实例对象的请求拦截器
// 在请求发出去之前, 做一些公共的配置, 比如: 携带token
http.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 4. 配置axios实例对象的响应拦截器
// 在响应到达页面之前, 做一些针对数据的公共处理, 比如: 统一解构返回的数据
http.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

// 5. 导出axios实例对象
export default http
