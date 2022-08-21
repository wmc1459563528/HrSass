import Layout from '@/layout'
/**
 * todo 封装了考勤版块所有的路由规则
 */
export default {
  path: '/attendances',
  component: Layout,
  children: [
    // todo 配置一个默认路由对象
    {
      path: '',
      name: 'attendances',
      component: () => import('@/views/attendances/index'),
      meta: { title: '考勤', icon: 'skill' }

    }
  ]
}
