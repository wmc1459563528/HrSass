<template>
  <!-- 分配角色的弹窗 -->
  <el-dialog
    title="分配角色"
    :visible="showRoleDialog"
    @close="handleCloseRoleDialog"
    @open="handleOpenDialog"
  >
    <!-- 复选框组件 -->
    <el-checkbox-group v-model="checkList" v-loading="loading">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
      <el-button size="small" @click="handleCloseRoleDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetRoleList } from '@/api/role'
import { reqGetUserInfo } from '@/api/user'
import { reqAssignRoles } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    // dialog的状态
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      roleList: [],
      // 选中角色列表
      checkList: [],
      loading: false
    }
  },
  methods: {
    // 1.向父组件授权获取修改showRoleDialog的状态
    handleCloseRoleDialog() {
      this.$emit('update:showRoleDialog', false)
      // 关闭窗口时清空选中状态
      this.checkList = []
    },
    // 2.打开dialog时获取权限列表
    handleOpenDialog() {
      this.loading = true
      // 获取角色列表
      // this.getRoleList()
      // 获取当前员工角色信息用于回显
      // this.getUserRoles()
      Promise.all([this.getRoleList(), this.getUserRoles()]).then(() => {
        this.loading = false
      })
    },
    // 3.获取权限列表
    async getRoleList() {
      // 传入的每页条数可以写大一点，获取到所有的
      const { data: { rows }} = await reqGetRoleList(1, 999999)
      //   console.log(rows)
      this.roleList = rows
    },
    // 4. 获取当前用户所拥有的角色
    async getUserRoles() {
      // 4.1 获取用户信息
      const { data: { roleIds }} = await reqGetUserInfo(this.userId)
      this.checkList = roleIds
    //   console.log(111)
    },
    // 5.点击确认更新数据
    async handleSubmit() {
      // 发送请求
      await reqAssignRoles(this.userId, this.checkList)
      //   提示用户
      this.$message.success('更新角色权限成功~')
      //   关闭窗口
      this.handleCloseRoleDialog()
    }
  }
}
</script>

<style>

</style>
