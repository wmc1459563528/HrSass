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
/**
 * 新增子部门
 * @param {object} data {pid,code,introduce,manager,name}
 * @returns
 */
export const reqAddDepartment = (data) => {
  return http({
    url: '/company/department',
    method: 'post',
    data
  })
}
/**
 * 根据部门ID修改部门详情
 * @param {string} id
 * @returns
 */
export const reqEditDepartment = (id) => {
  return http({
    url: `/company/department/${id}`,
    method: 'get'
  })
}
/**
 * 根据id修改部门详情
 * @param {string} form {id,...}
 * @returns
 */
export const reqUpdateDepartDetail = (form) => {
  return http({
    method: 'put',
    url: `/company/department/${form.id}`,
    data: form
  })
}
