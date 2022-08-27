/**
  该文件封装了员工操作版块的所有接口函数
 */

import http from '@/utils/request'

/**
   * 获取员工列表-包含详细信息
   * @param {*} page 当前页 默认1
   * @param {*} size 每页条数 默认5
   */
export const reqGetUserList = (page = 1, size = 5) => {
  return http({
    method: 'get',
    url: '/sys/user',
    params: {
      page,
      size
    }
  })
}
/**
 * 删除员工
 * @param {string} id 员工id
 * @returns
 */
export function reqDelEmployee(id) {
  return http({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}
/**
 * 添加员工
 * @param {object} form - 完整的员工信息对象
 * @returns
 */
export const reqAddEmployee = (form) => {
  return http({
    method: 'post',
    url: '/sys/user',
    data: form
  })
}
