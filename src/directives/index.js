/* import Vue from 'vue'
// 第一种方式 在main.js中引入js文件即可 import '@/directives'
Vue.directive('imgerror', {
  // el: 指令绑定的dom元素, binding: 指令的参数对象(binding.value)
  inserted(el, binding) {
    // console.log(el, binding.value)
    // 当img标签加载src中的url地址失败时, 指令要起作用
    el.onerror = () => {
      el.src = binding.value
    }
  }
}) */

// 第二种方式
/*
    在main.js中导入
    import { imgerror } from '@/directives/index'
    Vue.directive('imgerror', imgerror)
*/
export const imgerror = {
  // el: 指令绑定的dom元素, binding: 指令的参数对象(binding.value)
  inserted(el, binding) {
    // console.log(el, binding.value)
    // 当img标签加载src中的url地址失败时, 指令要起作用
    el.onerror = () => {
      el.src = binding.value
    }
  }
}

export const color = {
  // el: 指令绑定的dom元素, binding: 指令的参数对象(binding.value)
  inserted(el, binding) {
    el.style.color = binding.value || '#f00'
  }
}
