<template>
  <!-- 树形组件封装 -->
  <!-- 在树形组件中 行的宽度是由内容撑开的 -->
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width:100%;">
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <!-- 两个内容 -->
        <el-col :span="12">{{ nodeData.manager }}</el-col>
        <el-col :span="12">
          <!-- 下拉菜单 element -->
          <el-dropdown class="right" @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 如果为true显示下边两项 -->
              <el-dropdown-item v-if="!root" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!root" command="del">删除部门</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { reqDelDepartment } from '@/api/departments'
export default {
  props: {
    // 行上的数据
    nodeData: {
      type: Object,
      default: () => {}
    },
    // 是否是跟结构上的行
    root: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      role: 'POINT_DEPERTMENTS_DEL'
    }
  },
  methods: {
    // 处理用户点击
    handleCommand(flag) {
      if (flag === 'add') {
        // 判断是否有此权限
        if (!this.handleBtnRoles('POINT_DEPERTMENTS_ADD')) {
          this.$message.warning('您暂无此权限，请联系管理员获取权限')
          return
        }
        // this.$message.success('添加成功')
        // 向父组件发送自定义事件并将数据回传给父组件
        this.$emit('add-depts', this.nodeData)
      } else if (flag === 'edit') {
        // 判断是否有此权限
        if (!this.handleBtnRoles('POINT_DEPERTMENTS_EDIT')) {
          this.$message.warning('您暂无此权限，请联系管理员获取权限')
          return
        }
        // this.$message.success('编辑成功')
        // 向父组件发送自定义事件并将数据回传给父组件
        this.$emit('edit-depts', this.nodeData)
      } else {
        // 判断是否有此权限
        if (!this.handleBtnRoles('POINT_DEPERTMENTS_DEL')) {
          this.$message.warning('您暂无此权限，请联系管理员获取权限')
          return
        }
        this.$confirm('此操作将永久删除该部门，是否继续？', '温馨提示').then(async() => {
          await reqDelDepartment(this.nodeData.id)
          this.$message.success('删除成功~')
          this.$emit('del-depts')
        }).catch(() => {
          this.$message.info('取消删除~')
        })
      }
    },
    // 按钮操作权
    handleBtnRoles(str) {
      const roles = this.$store.getters.roles
      if (roles) {
        return roles.points.includes(str)
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
.right{
 cursor: pointer;
}
</style>
