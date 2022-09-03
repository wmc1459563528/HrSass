/*
    ! 该文件封装了角色信息操作的所有接口信息
*/
import http from '@/utils/request'
/**
 * 获取所有角色列表
 * @param {number} page 当前页
 * @param {number} pagesize 每页条数
 * @returns
 */
export const reqGetRoleList = (page = 1, pagesize = 5) => {
  return http({
    url: '/sys/role',
    method: 'get',
    params: {
      page,
      pagesize
    }
  })
}
/**
 *添加角色
 * @param {object} form {name:XXX,description}
 * @returns
 */
export const reqAddRole = (form) => {
  return http({
    url: '/sys/role',
    method: 'post',
    data: form
  })
}
/**
 * 根据ID删除角色
 * @param {srtring} id
 * @returns
 */
export const reqDelRole = (id) => {
  return http({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
/**
 * 根据角色的id获取角色的详情
 * @param {*} id 角色的id
 * @returns
 */
export const reqGetRoleDetail = (id) => {
  return http({
    url: `/sys/role/${id}`,
    method: 'get'
  })
}

/**
 * 根据角色的id更新角色
 * @param {*} form {id:xxx, ...}
 * @returns
 */
export const reqUpdateRole = (form) => {
  return http({
    url: `/sys/role/${form.id}`,
    method: 'put',
    data: form
  })
}
/**
 * 给角色分配权限
 * @param {string} id 角色ID
 * @param {array} permIds 该角色拥有的权限id数组
 * @returns
 */
export const reqAssignPrem = (id, permIds) => {
  return http({
    url: '/sys/role/assignPrem',
    method: 'put',
    data: {
      id,
      permIds
    }
  })
}
