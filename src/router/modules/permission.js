import Layout from '@/layout'
/**
 * todo 封装了权限管理版块所有的路由规则
 */
export default {
  path: '/permission',
  component: Layout,
  children: [
    // todo 配置一个默认路由对象
    {
      path: '',
      name: 'permission',
      component: () => import('@/views/permission/index'),
      meta: { title: '权限管理', icon: 'lock' }

    }
  ]
}
