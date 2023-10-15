import Vue from 'vue'
import Router from 'vue-router'
// import asyncRouter from '@/router/asyncRoutes'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workbench'
  },
  {
    path: '/workbench',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/Workbench/index'),
      meta: { title: '工作台', icon: 'el-icon-data-board' }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/roleAdd',
    component: () => import('@/views/System/Role/AddRole')
  },
  // 添加编辑月卡
  { path: '/cardAdd',
    component: () => import('@/views/Car/CarCard/cardAdd')
  },
  // 添加编辑企业
  {
    path: '/exterpriseAdd',
    component: () => import('@/views/Park/Enterprise/exterpriseAdd')
  },
  {
    path: '/exterpriseDetail',
    component: () => import('@/views/Park/Enterprise/Detail')
  },
  {
    path: '/lookWarn/:id',
    component: () => import('@/views/Rod/RodWarn/lookWarn')
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  // routes: [...routes, ...asyncRouter]
  routes: routes
})

const router = createRouter()

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher
}

export default router
