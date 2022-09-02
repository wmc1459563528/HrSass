/**
  该文件封装了权限版块的所有接口函数
 */

import http from '@/utils/request'

/**
   * 获取权限
   * @returns
   */
export function reqGetPermissionList() {
  return http({
    method: 'get',
    url: '/sys/permission'
  })
}

/**
   * 新增权限
   * @param {*} data - {xxx: xx}
   * @returns
   */
export function reqAddPermission(data) {
  return http({
    method: 'post',
    url: '/sys/permission',
    data
  })
}

/**
   * 更新权限
   * @param {*} data - {id: xxx, xxx: xxx}
   * @returns
   */
export function reqUpdatePermission(data) {
  return http({
    method: 'put',
    url: `/sys/permission/${data.id}`,
    data
  })
}

/**
   * 删除权限
   * @param {*} id 权限的id
   * @returns
   */
export function reqDelPermission(id) {
  return http({
    method: 'delete',
    url: `/sys/permission/${id}`
  })
}

/**
   * 获取单个权限详情回显
   * @param {*} id - 权限的id
   * @returns
   */
export function reqGetPermissionDetail(id) {
  return http({
    method: 'get',
    url: `/sys/permission/${id}`
  })
}
