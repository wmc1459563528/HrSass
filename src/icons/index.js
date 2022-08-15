// 1. 引入vue
import Vue from 'vue'
// 2. 引入一个Svg组件
import SvgIcon from '@/components/SvgIcon'
// 3. 把SvgIcon注册成全局组件
// .vue文件中使用: <svg-icon/>
Vue.component('svg-icon', SvgIcon)

// 把svg文件全局引入, 在组件中才可以去使用
// import dashboard from './svg/dashboard.svg'
// import example from './svg/example.svg'
// import example from './svg/example.svg'
// import example from './svg/example.svg'
// import example from './svg/example.svg'

// ------------需求: 手动去导入svg文件太麻烦, 能不能自动化导入 ---------
/*
  require.context(directory,useSubdirectories,regExp)
    - directory:表示检索的目录
    - useSubdirectories：表示是否检索子文件夹
    - regExp:匹配文件的正则表达式,一般是文件名
*/

// 以下3句代码能实现所有的svg文件自动化导入
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

// console.log(req.keys()) // 获取到当前文件夹下所有.svg文件的路径
// console.log(requireAll(req)) // 根据路径数组映射引入去生成模块数组

/*
  注意:
  在我们当前的这个项目中, 已经集成了svg精灵图技术, 在webpack中已经配置了svg-sprite-loader
  svg-sprite-loader
  - 会把引入的所有svg模块处理放入一个容器中
  - 并以文件的名称加前缀组合生成id, 给到每一个模块
    id="icon-xxx"
  后边使用时, 就可以根据id去拿到模块来使用
*/
