/**
  该文件封装了组织架构版块操作的所有接口函数
 */
import http from '@/utils/request'

/**
 *  查询企业的部门列表
 * @param {*} data {mobile: 'xxx', password: 'xxxxx'}
 * @returns
 */
export const reqGetDepartments = () => {
  return http({
    url: '/company/department',
    method: 'get'
  })
}
/**
 * 根据ID删除部门
 * @param {String} id
 * @returns
 */
export const reqDelDepartment = (id) => {
  return http({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
