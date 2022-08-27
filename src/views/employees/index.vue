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
          <el-button type="primary" size="small" @click="showNewDialog = true">新增员工</el-button>
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
          >
            <template #default="{row}">
              {{ row.timeOfEntry | formatData }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable
            fixed="right"
            width="280"
          >
            <template #default="{row}">
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
                @click="handleDelUserInfo(row.id)"
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
      <!-- 利用sync放权给子组件修改内容 -->
      <add-employee
        :show-dialog.sync="showNewDialog"
        :add-user="getUserList"
      />
    </div>
  </div>
</template>

<script>
import { reqDelEmployee, reqGetUserList } from '@/api/employees'
import employees from '@/constant/employees'
// 引入添加弹层组件
import AddEmployee from './components/AddEmployee.vue'
export default {
  name: 'Employees',
  components: {
    AddEmployee
  },
  data() {
    return {
      // 分页相关
      list: [],
      page: 1,
      size: 5,
      total: 0,
      // 加载中
      loading: false,
      // 添加员工的弹层
      showNewDialog: false
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
      // todo 这种写法太局限，可以用枚举解决
      // return cellValue === 1 ? '正式员工' : '临时员工'
      const { hireType } = employees
      // console.log(hireType)
      // ! 后端接口给回来的cellValue的值得类型有number和string类型两种 需要特殊处理
      const res = hireType.find(item => item.id === +cellValue)
      return res ? res.value : '未知工种'
    },
    // 6.删除当前员工信息
    handleDelUserInfo(id) {
      this.$confirm('确定删除当前项吗？此操作将不可逆！', '温馨提示', { type: 'warning' }).then(async() => {
        // 发送请求
        await reqDelEmployee(id)
        // ! 特殊处理：如果为当前页的第一项，且数组长度为1则需要当前页-1
        if (this.list.length === 1 && this.page > 1) this.page--
        // 提示用户删除成功
        this.$message.success('删除成功~')
        // 重新拉取数据
        this.getUserList()
      }).catch(err => {
        this.$message.info(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
