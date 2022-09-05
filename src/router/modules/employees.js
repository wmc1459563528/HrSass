/*
  todo 封装了员工版块所有的路由规则
*/
import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    // 配置一个默认路由对象
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees/index.vue'),
      meta: { title: '员工', icon: 'people' }
    },
    // 详情页
    {
      path: 'detail/:id',
      name: 'detail',
      component: () => import('@/views/employees/detail.vue'),
      hidden: true
    },
    // 打印页
    {
      path: 'print/:id',
      name: 'print',
      component: () => import('@/views/employees/print.vue'),
      hidden: true
    }
  ]
}
