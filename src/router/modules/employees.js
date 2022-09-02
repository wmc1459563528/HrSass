import Layout from '@/layout'
/**
 * todo 封装了员工版块所有的路由规则
 */
export default {
  path: '/employees',
  component: Layout,
  children: [
    // todo 配置一个默认路由对象
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees/index'),
      meta: { title: '员工', icon: 'people' }

    },
    {
      path: 'detail/:id',
      name: 'detail',
      component: () => import('@/views/employees/detail.vue'),
      hidden: true
    },
    {
      path: 'print/:id',
      name: 'print',
      component: () => import('@/views/employees/print.vue'),
      hidden: true
    }
  ]
}
