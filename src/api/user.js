/**
  该文件封装了用户操作的所有接口函数
 */

import http from '@/utils/request'

/**
 * 登录接口函数
 * @param {*} data {mobile: 'xxx', password: 'xxxxx'}
 * @returns
 */
export function reqLogin(data) {
  return http({
    // url: 'http://localhost:8888/api/sys/login',
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
 * 根据用户id获取用户的基本信息
 * @param {*} id
 * @returns
 */
export const reqGetUserInfo = (id) => {
  return http({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}

/**
 * 获取员工简单列表
 */
export const reqGetSimpleUserList = () => {
  return http({
    url: '/sys/user/simple',
    method: 'get'
  })
}
