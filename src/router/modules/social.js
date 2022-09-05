/*
  todo 封装了社保版块所有的路由规则
*/
import Layout from '@/layout'
export default {
  path: '/social',
  component: Layout,
  children: [
    // 配置一个默认路由对象
    {
      path: '',
      name: 'social_securitys',
      component: () => import('@/views/social/index.vue'),
      meta: { title: '社保', icon: 'table' }
    }
  ]
}
