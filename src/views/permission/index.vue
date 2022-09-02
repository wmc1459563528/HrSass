<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small">添加权限</el-button>
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
            <template>
              <el-button size="small" type="text">添加权限点</el-button>
              <el-button size="small" type="text">查看</el-button>
              <el-button size="small" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { reqGetPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getPermissionList()
  },
  // 获取权限列表
  methods: {
    async getPermissionList() {
      const { data: res } = await reqGetPermissionList()
      // console.log(res)
      this.list = tranListToTreeData(res, '0')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
