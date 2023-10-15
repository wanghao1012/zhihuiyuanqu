import router from './router'
import store from './store'
import asyncRoutes from '@/router/asyncRoutes'
// 定义一个白名单  不需要有token就可以访问的
const whiteList = ['/login', '/404']

// 根据权限标识  获取对应的一级路由
function getFirstRoutePermission(permission) {
  const firstPermArr = permission.map(item => {
    return item.split(':')[0]
  })
  // 去重  new Set   得到的不是一个真数组  需要通过Array.from转化为真数组
  return Array.from(new Set(firstPermArr))
}

// 根据权限标识  获取对应二级路由
function getSecondRoutePermission(permission) {
  const secondPermArr = permission.map(item => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  return Array.from(new Set(secondPermArr))
}

// 根据一级二级权限标识 筛选出对应可展示的动态路由
function getRoute(firstPermission, secondPermission, asyncRoutes) {
  // 如果是*则表示登录人是管理员  可以看到所有的模块
  if (firstPermission.includes('*')) {
    // 返回所有的路由规则
    return asyncRoutes
  }
  // 筛选一级路由
  const firstRoute = asyncRoutes.filter(item => {
    return firstPermission.includes(item.permission)
  })
  // console.log('hhhh', firstRoute)
  // 筛选二级
  const routes = firstRoute.map(item => {
    return {
      ...item,
      children: item.children.filter(child => {
        return secondPermission.includes(child.permission)
      })
    }
  })
  // console.log('jjjj', routes)
  return routes
}

router.beforeEach(async(to, from, next) => {
  // 判断是否有token
  const token = store.state.user.token
  if (token) {
    // 有token
    // 判断是否是登录页
    if (to.path === '/login') {
      next('/')
    } else {
      next()
      // 1.获取登录用户的权限信息
      const permission = await store.dispatch('menu/getUserPermission')
      // console.log('permission1', permission)
      // 2.根据权限标识  获取对应的一级路由标识
      const firstPermission = getFirstRoutePermission(permission)
      // console.log('firstPermission', firstPermission)
      // 3.根据权限标识  获取对应的二级路由
      const secondPermission = getSecondRoutePermission(permission)
      // console.log(1, secondPermission)
      // console.log('11', asyncRoutes)
      const routes = getRoute(firstPermission, secondPermission, asyncRoutes)
      console.log(routes)
      // 筛选后的路由展示到左侧
      // 把筛选之后的路由添加到路由对象中(为了实现跳转)
      routes.forEach(item => router.addRoute(item))
      // 把筛选之后的路由添加到vuex中(为了实现左侧渲染)
      store.commit('menu/setMenuList', routes)
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
