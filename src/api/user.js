import http from '@/utils/request'

/**
 * 登录接口函数
 * @param {*} data {mobile: 'xxx', password: 'xxxxx'}
 * @returns
 */
export function reqLogin(data) {
  return http({
    // url: 'http://localhost:8889/api/sys/login',
    url: '/sys/login',
    method: 'post',
    data
  })
}
