/*
  todo 封装了审批版块所有的路由规则
*/
import Layout from '@/layout'
export default {
  path: '/approvals',
  component: Layout,
  children: [
    // 配置一个默认路由对象
    {
      path: '',
      name: 'approvals',
      component: () => import('@/views/approvals/index.vue'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]
}
