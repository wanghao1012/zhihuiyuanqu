// 放置全局指令
import store from '@/store'
import Vue from 'vue'
// 单独处理管理员账号
const adminPerms = '*:*:*'
Vue.directive('permission', {
  inserted(el, binding) {
    console.log(el, binding)

    const perms = store.state.menu.permission
    // 判断是否是管理员账号
    if (perms.includes(adminPerms)) return
    if (!perms.includes(binding.value)) {
      // el.style.display = 'none'
      el.remove()
    }
  }
})
