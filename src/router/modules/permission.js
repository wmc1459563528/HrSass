/*
  todo 封装了权限管理版块所有的路由规则
*/
import Layout from '@/layout'
export default {
  path: '/permission',
  component: Layout,
  children: [
    // 配置一个默认路由对象
    {
      path: '',
      name: 'permissions',
      component: () => import('@/views/permission/index.vue'),
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]
}
