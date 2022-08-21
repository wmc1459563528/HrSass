import Layout from '@/layout'
/**
 * todo 封装了社保版块所有的路由规则
 */
export default {
  path: '/social',
  component: Layout,
  children: [
    // todo 配置一个默认路由对象
    {
      path: '',
      name: 'social',
      component: () => import('@/views/social/index'),
      meta: { title: '社保', icon: 'table' }

    }
  ]
}
