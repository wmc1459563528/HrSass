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
