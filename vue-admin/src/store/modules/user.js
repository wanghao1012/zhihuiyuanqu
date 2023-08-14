import { loginAPI } from '@/api/user'
import { setToken, getToken } from '@/utils/auth'
export default {
  namespaced: true, // 开启命名空间
  state: {
    token: getToken() || ''

  },
  mutations: {
    // mutations 中的方法 只有一种调用方式  store.commit('mutations中的方法名')  并没有  方法名()
    setToken(state, newToken) {
      state.token = newToken
      setToken(newToken)
    }
  },
  actions: {
    async loginActions(store, data) {
      const res = await loginAPI(data)
      // console.log(res)
      store.commit('setToken', res.data.token)
    }
  }
}
