// import {
//   createRouter,
//   createWebHistory,
//   createWebHashHistory
// } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // 路由模式:hash模式
  // history:createWebHashHistory(import.meta.env.BASE_URL)
  // 路由模式:历史模式(history)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/bigscreen',
      component: HomeView
    },
    {
      path: '/bigscreen',
      name: 'BigScreen',
      component: () => import('../views/BigScreenView.vue')
    }
  ]
})

export default router
