/*
  todo 封装了组织架构版块所有的路由规则
*/
import Layout from '@/layout'
export default {
  path: '/departments',
  component: Layout,
  children: [
    // 配置一个默认路由对象
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments/index.vue'),
      meta: { title: '组织架构', icon: 'tree' }
    }
  ]
}
