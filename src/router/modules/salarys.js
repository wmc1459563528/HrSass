/*
  todo 封装了薪资管理版块所有的路由规则
*/
import Layout from '@/layout'
export default {
  path: '/salarys',
  component: Layout,
  children: [
    // 配置一个默认路由对象
    {
      path: '',
      name: 'salarys',
      component: () => import('@/views/salarys/index.vue'),
      meta: { title: '薪资', icon: 'money' }
    }
  ]
}
