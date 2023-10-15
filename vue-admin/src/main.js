import Vue from 'vue'
// 初始化样式 清空浏览器的默认样式
import 'normalize.css/normalize.css'
// 引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

// 启动微前端配置
import './registerMicroApp'
// 引入根组件
import App from './App'
// 引入Vuex
import store from './store'
// 引入Router路由
import router from './router'

// 注册svg
import '@/icons'

// 导入导航守卫
import './permission'

// 导入全局指令组件
import '@/directive'

// 把ElementUI提供的所有组件注册为全局组件
Vue.use(ElementUI)

// 上线之后如果有警告  要不要展示
Vue.config.productionTip = false

// vue实例化
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
