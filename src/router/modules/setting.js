import Layout from '@/layout'
/**
 * todo 封装了公司设置版块所有的路由规则
 */
export default {
  path: '/setting',
  component: Layout,
  children: [
    // todo 配置一个默认路由对象
    {
      path: '',
      name: 'setting',
      component: () => import('@/views/setting/index'),
      meta: { title: '公司设置', icon: 'setting' }

    }
  ]
}
