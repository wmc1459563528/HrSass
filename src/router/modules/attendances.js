/*
  todo 封装了考勤版块所有的路由规则
*/
import Layout from '@/layout'
export default {
  path: '/attendances',
  component: Layout,
  children: [
    // 配置一个默认路由对象
    {
      path: '',
      name: 'attendances',
      component: () => import('@/views/attendances/index.vue'),
      meta: { title: '考勤', icon: 'skill' }
    }
  ]
}
