/*
  todo 封装了设置版块所有的路由规则
*/
import Layout from '@/layout'
export default {
  path: '/setting',
  component: Layout,
  children: [
    // 配置一个默认路由对象
    {
      path: '',
      name: 'settings',
      component: () => import('@/views/setting/index.vue'),
      meta: { title: '设置', icon: 'setting' }
    }
  ]
}
