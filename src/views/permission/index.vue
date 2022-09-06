<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button
            :disabled="!handleBtnRoles('POINT_PERMISSIONS_ADD')"
            type="primary"
            size="small"
            @click="handleAdd(1,'0')"
          >添加权限</el-button>
        </div>
        <!--
        表格要以树形结构展示
        核心点:
        1) row包含 children 字段，被视为树形数据
        2) 配置row-key="id"
       -->
        <el-table
          :data="list"
          border
          row-key="id"
        >
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="code" label="标识" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button
                :disabled="!handleBtnRoles('POINT_PERMISSIONS_ADD')"
                size="small"
                type="text"
                @click="handleAdd(2,row.id)"
              >添加权限点</el-button>
              <el-button
                :disabled="!handleBtnRoles('POINT_PERMISSIONS_EDIT')"
                size="small"
                type="text"
                @click="handleEdit(row.id)"
              >查看</el-button>
              <el-button
                :disabled="!handleBtnRoles('POINT_PERMISSIONS_DEL')"
                size="small"
                type="text"
                @click="handleDle(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 新增/编辑的弹层 -->
      <el-dialog
        :visible="showDialog"
        :title="dialogTitle"
        @close="handleColseDialog"
      >
        <!-- 表单内容 -->
        <el-form label-width="100px">
          <el-form-item label="权限名称">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限启用">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <div style="text-align: right;">
            <el-button @click="handleColseDialog">取消</el-button>
            <el-button type="primary" @click="handleSumbit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reqAddPermission, reqDelPermission, reqGetPermissionDetail, reqGetPermissionList, reqUpdatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      // 1.树形结构数组
      list: [],
      // 2. 控制弹窗的显示/隐藏
      showDialog: false,
      // 3. 表单数据对象
      formData: {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 权限名称
        code: '', // 权限标识,用于将来判断
        description: '', // 权限描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
    }
  },
  computed: {
    // 标题名称
    dialogTitle() {
      return this.formData.id ? '编辑权限' : '添加权限'
    }
  },
  created() {
    // 渲染数据
    this.getPermissionList()
  },
  methods: {
    // 1.获取权限列表
    async getPermissionList() {
      const { data: res } = await reqGetPermissionList()
      // console.log(res)
      this.list = tranListToTreeData(res, '0')
    },
    // 点击添加
    handleAdd(type, pid) {
      // 显示弹窗
      this.showDialog = true
      // 将数据传给表单
      // console.log(type, pid)
      this.formData.type = type
      this.formData.pid = pid
    },
    // 2.添加/编辑权限
    async handleSumbit() {
      if (this.formData.id) {
        // 发送请求
        await reqUpdatePermission(this.formData)
        // 提示用户
        this.$message.success('修改权限成功~')
      } else {
      // 发送请求
        await reqAddPermission(this.formData)
        // 提示用户
        this.$message.success('添加权限成功~')
      }
      // 关闭窗口并清空数据
      this.handleColseDialog()
      // 重新拉取数据
      this.getPermissionList()
    },
    // 3.关闭窗口并清空数据
    handleColseDialog() {
      this.showDialog = false
      // 清空表单数据（增强用户体验，加一个延时器）
      setTimeout(() => {
        this.formData = {
          enVisible: '0', // 启用禁用, 0禁用, 1启用
          name: '', // 权限名称
          code: '', // 权限标识,用于将来判断
          description: '', // 权限描述
          type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
          pid: '' // 添加到哪个节点下
        }
      }, 200)
    },
    // 4.删除当前项
    handleDle(id) {
      this.$confirm('确认删除此项权限吗？此操作将不可逆！', '温馨提示', { type: 'warning' }).then(async() => {
      // 发送删除请求
        await reqDelPermission(id)
        // 提示用户
        this.$message.success('删除权限成功~')
        // 重新拉取数据
        this.getPermissionList()
      }).catch(err => this.$message.warning(err)) // 取消时提醒用户
    },
    // 5.编辑当前项
    async handleEdit(id) {
      const { data: res } = await reqGetPermissionDetail(id)
      // console.log(res)
      this.formData = res
      this.showDialog = true
    },
    // 6.按钮操作权
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

<style lang="scss" scoped>

</style>
