<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="loginForm" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="loginForm.username" />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="loginForm.password" show-password type="password" />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { FORM_KEY } from '@/constants/KEY'
// import { loginAPI } from '@/api/user'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rememberMe: false,
      rules: {
        username: [{ required: true, message: '用户名不可为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不可为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 将用户信息回显到页面中
    const formData = localStorage.getItem(FORM_KEY)
    if (formData) {
      const { username, password } = JSON.parse(formData)
      this.loginForm.username = username
      this.loginForm.password = password
      this.rememberMe = true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate(async flag => {
        if (!flag) return
        // console.log('哈哈哈')
        // const res = await loginAPI(this.loginForm)
        // console.log(res)
        // this.$store.commit('user/setToken', res.data.token)
        // try {
        // async声明的函数 会遵循内同步,外异步的方式执行 所以这里会先执行下面的代码再执行这里的代码
        await this.$store.dispatch('user/loginActions', this.loginForm)
        // console.log(this.$route.query.redirect)
        // 判断用户 如果是第一次登录就跳转到默认的页面   如果是从其他页面跳转过来的就在登录后再跳回到那个页面
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect)
        } else {
          this.$router.push('/')
        }
        // 判断用户是否点击记住我
        if (this.rememberMe) {
          // 将用户信息存储到本地
          localStorage.setItem(FORM_KEY, JSON.stringify(this.loginForm))
        } else {
          // 如果用户没有选择记住我 则登录完成之后清空表单数据
          localStorage.removeItem(FORM_KEY)
        }
        // } catch (error) {
        //   this.$message.error(error.response.data.msg)
        // }
      })
    }
  }

}

</script>

<style scoped lang="scss">
  .login_body {
    display: flex;
  }
  .bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat;
    background-position: right top;
    background-size: cover;
  }
  .box {
    margin: 200px 10% 0;
    flex: 1;
    .title {
      padding-bottom: 76px;
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
    }
    ::v-deep() {
      .ant-form-item {
        display: flex;
        margin-bottom: 62px;
        flex-direction: column;
      }
      .ant-form-item-label label {
        font-size: 16px;
        color: #8b929d;
      }
      .ant-input,
      .ant-input-password {
        border-radius: 8px;
      }
    }
  }
  .login_btn{
    width: 100%;
  }
</style>
