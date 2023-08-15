import router from './router'
import store from './store'
// 定义一个白名单  不需要有token就可以访问的
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  // 判断是否有token
  const token = store.state.user.token
  if (token) {
    // 有token
    // 判断是否是登录页
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 没有token
    // 判断访问的路由地址在不在白名单中  如果在就直接方向
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
