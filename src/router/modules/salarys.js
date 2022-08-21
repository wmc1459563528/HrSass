import Layout from '@/layout'
/**
 * todo 封装了薪资版块所有的路由规则
 */
export default {
  path: '/salarys',
  component: Layout,
  children: [
    // todo 配置一个默认路由对象
    {
      path: '',
      name: 'salarys',
      component: () => import('@/views/salarys/index'),
      meta: { title: '薪资', icon: 'money' }

    }
  ]
}
