import { getProfileApi } from '@/api/user'
import { routes, resetRouter } from '@/router/index'
export default {
  namespaced: true, // 开启命名空间
  state: {
    // 权限标识
    permission: [],
    // 路由规则
    menuList: []
  },
  mutations: {
    // 修改权限标识
    setPermission(state, Newpermission) {
      state.permission = Newpermission
    },
    // 修改路由规则
    setMenuList(state, asyncRoutes) {
      state.menuList = [...routes, ...asyncRoutes]
    },
    // 删除路由规则
    clearMenuList(state) {
      state.menuList = []
      resetRouter()
    }
  },
  actions: {
    // 获取登录用户权限信息
    async getUserPermission(store) {
      // 发送请求
      const res = await getProfileApi()
      store.commit('setPermission', res.data.permissions)
      console.log(res)
      return res.data.permissions
    }
  }
}
