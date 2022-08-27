<template>
  <div class="employees-container">
    <div class="app-container">
      <page-tools>
        <!-- 左边插槽 -->
        <template #left>
          <span>共{{ total }}条记录</span>
        </template>
        <!-- 右边插槽 -->
        <template #right>
          <el-button type="danger" size="small">excel导出</el-button>
          <el-button type="success" size="small">excel导入</el-button>
          <el-button type="primary" size="small">新增员工</el-button>
        </template>
      </page-tools>
      <el-card v-loading="loading" element-loading-text="拼命加载中" style="margin-top: 10px;">
        <el-table
          :data="list"
          border
        >
          <el-table-column
            label="序号"
            type="index"
            :index="indexMethod"
            sortable
            width="100"
          />
          <el-table-column
            label="姓名"
            prop="username"
            sortable
          />
          <el-table-column
            label="手机号"
            prop="mobile"
            sortable
          />
          <el-table-column
            label="工号"
            prop="workNumber"
            sortable
          />
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployment"
            sortable
          />
          <el-table-column
            label="部门"
            prop="departmentName"
            sortable
          />
          <el-table-column
            label="入职时间"
            prop="timeOfEntry"
            sortable
          />
          <el-table-column
            label="操作"
            sortable
            fixed="right"
            width="280"
          >
            <template>
              <el-button
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
              >转正</el-button>
              <el-button
                type="text"
                size="small"
              >调岗</el-button>
              <el-button
                type="text"
                size="small"
              >离职</el-button>
              <el-button
                type="text"
                size="small"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div style="height: 60px; margin-top: 10px">
          <el-pagination
            :current-page="page"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="size"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { reqGetUserList } from '@/api/employees'
export default {
  name: 'Employees',
  data() {
    return {
      // 分页相关
      list: [],
      page: 1,
      size: 5,
      total: 0,
      // 加载中
      loading: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 1. 获取员工列表
    async  getUserList() {
      this.loading = true
      const { data: { rows, total }} = await reqGetUserList(this.page, this.size)
      // console.log(res)
      this.list = rows
      this.total = total

      // 将加载状态改为false
      this.loading = false
    },
    // 2. 当每页显示条数发生变化
    handleSizeChange(val) {
      this.size = val
      this.getUserList()
    },
    // 3. 当前页发生变化
    handleCurrentChange(val) {
      this.page = val
      this.getUserList()
    },
    // 4.修改序号
    indexMethod(index) {
      return (index + 1) + this.size * (this.page - 1)
    },
    // 5.格式化单元格内容
    formatterEmployment(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index)
      return cellValue === 1 ? '正式员工' : '临时员工'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
