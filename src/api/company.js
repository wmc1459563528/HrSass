/*
    ! 该文件封装了公司板块操作的所有接口信息
*/
import http from '@/utils/request'

/**
 * 根据id查询企业
 * @param {string} id 企业ID
 * @returns
 */
export const reqSelectCompany = (id) => {
  return http({
    url: `/company/${id}`,
    method: 'get'
  })
}
