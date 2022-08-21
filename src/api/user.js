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
/**
 * 获取用户基本资料
 * @returns
 */
export const reqGetProfile = () => {
  return http({
    url: '/sys/profile',
    method: 'post'
  })
}
/**
 * 用于获取基本信息(带头像)  需要传id
 * @param {*} id
 * @returns
 */
export const reqGetUserInfo = (id) => {
  return http({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}
