<template>
  <div class="employees-detail-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账号设置">
            <!-- 放置表单 -->
            <el-form ref="userForm" :model="UserForm" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item prop="username" label="姓名:">
                <el-input v-model="UserForm.username" style="width:300px" />
              </el-form-item>
              <el-form-item prop="newPassword" label="密码:">
                <el-input v-model="UserForm.newPassword" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSaveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 打印个人详情信息 -->
            <el-tooltip class="tooltip-box" content="打印基本个人信息">
              <router-link :to="`/employees/print/${userId}?type=personal`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 打印岗位信息 -->
            <el-tooltip class="tooltip-box" content="打印基本岗位信息">
              <router-link :to="`/employees/print/${userId}?type=job`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 带头像的那个接口
import { reqGetUserInfo } from '@/api/user'
import { reqSaveUserDetailById } from '@/api/employees'
import userInfo from './components/UserInfo.vue'
import JobInfo from './components/JobInfo.vue'

export default {
  name: 'EmployeesDetail',
  components: {
    userInfo,
    JobInfo
  },
  data() {
    return {
      UserForm: {
        username: '',
        newPassword: ''
      },
      rules: {
        username:
        // 必填校验
        { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
        newPassword:
        // 密码长度校验
        { min: 6, max: 9, message: '密码必须是6-9位', trigger: ['blur', 'change'] }

      }
    }
  },

  computed: {
    userId() {
      return this.$route.params.id
    }
  },
  async created() {
    const { data } = await reqGetUserInfo(this.userId)
    // console.log(data, 9090)
    this.UserForm = data
  },
  methods: {
    handleSaveUser() {
      this.$refs.userForm.validate(async flag => {
        if (!flag) return
        // 通过校验
        await reqSaveUserDetailById({
          ...this.UserForm,
          // todo 处理密码:如果newPassword有值则按照新密码来提交，如果没有则按照password来提交
          password: this.UserForm.newPassword || this.UserForm.password
        })
        // 提示用户
        this.$message.success('更新成功~')
        // 跳转到员工页
        this.$router.push('/employees')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.employees-detail-container {
  .el-tab-pane {
    padding-top: 30px;
  }
  .tooltip-box {
    position: absolute;
    right: 30px;
    top: 10px;
    z-index: 999;
  }
}
</style>
