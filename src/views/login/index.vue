<template>
  <div class="login-container">
    <!-- 登录表单 -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
      auto-complete="off"
    >
      <!-- 放置标题图片 @是设置的别名-->
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>
      <!-- 手机号 -->
      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="请输入手机号码"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>
      <!-- 密码  -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <!-- 明文和密文 -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        class="loginBtn"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
      <!-- 提示文本 -->
      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
// import { reqLogin } from '@/api/user'

export default {
  name: 'Login',
  data() {
    // 自定义校验-手机号
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      // 1. 数据对象
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      // 2. 校验规则对象
      loginRules: {
        // 2.1 手机号码
        mobile: [
          // 非空校验
          { required: true, message: '手机号不能为空', trigger: ['change', 'blur'] },
          // 自定义校验
          { validator: validateMobile, trigger: ['change', 'blur'] }
        ],
        // 2.2 密码
        password: [
          // 非空校验
          { required: true, message: '密码不能为空', trigger: ['change', 'blur'] },
          // 长度校验校验
          { min: 6, max: 16, message: '密码长度在6-16位之间', trigger: ['change', 'blur'] }
        ]
      },
      loading: false,
      passwordType: 'password', // 密码的显示类型('password': 密文 '': 明文)
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 1. 处理密码的明文和密文显示
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      // 1.1 在下一个宏任务去更新视图
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 2. 处理登录
    handleLogin() {
      this.$refs.loginForm.validate(flag => {
        // 2.1 没有通过校验
        if (!flag) return
        // 方式一:
        // 2.2 通过了校验
        // this.$http.post('http://ihrm-java.itheima.net/api/sys/login', this.loginForm)
        //   .then((res) => {
        //     console.log(res)
        //   }).catch((error) => {
        //     console.log(error)
        //   })

        // 测试代理服务器
        // this.$http.post('http://localhost:8889/api/sys/login', this.loginForm)
        //   .then((res) => {
        //     console.log(res)
        //   }).catch((error) => {
        //     console.log(error)
        //   })

        // 方式二:
        // reqLogin(this.loginForm).then((res) => {
        //   console.log(res)
        // }).catch((error) => {
        //   console.log(error)
        // })

        // 方式三(终极方案):
        // 向仓库派发一个异步任务(login函数)
        this.$store.dispatch('user/login', this.loginForm)
          .then(() => {
            this.loading = true
            this.$message.success('登录成功~')
            this.$router.push('/')
          })
          .catch(() => {
            this.loading = true
          })
          .finally(() => {
            // 无论失败还是成功都会触发
            setTimeout(() => {
              this.loading = false
            }, 1000)
          })
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#407ffe; // 修改输入框字体颜色
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/login.jpg'); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  // 此处修改
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.9); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }

  .el-form-item__error {
    color: #fff;
    font-size: 14px;
  }

  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
