import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1'
  // timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 获取token
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.dir(error)
    // 轻提示
    Message.error(error.response.data.msg)
    // 错误处理
    if (error.response.status === 401) {
      // token过期
      // 清空token+ 跳转到登录页
      store.commit('user/removeToken')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service
