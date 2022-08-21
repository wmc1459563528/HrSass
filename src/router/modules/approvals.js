import Layout from '@/layout'
/**
 * todo 封装了审批版块所有的路由规则
 */
export default {
  path: '/approvals',
  component: Layout,
  children: [
    // todo 配置一个默认路由对象
    {
      path: '',
      name: 'approvals',
      component: () => import('@/views/approvals/index'),
      meta: { title: '审批', icon: 'tree-table' }

    }
  ]
}
