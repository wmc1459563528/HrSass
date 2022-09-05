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
          <!--
            :disabled="!handleBtnRole('POINT_USER_EXPORT')"
            如果有POINT_USER_EXPORT，则取反，让显示出来
           -->
          <el-button
            type="danger"
            size="small"
            :disabled="!handleBtnRole('POINT_USER_EXPORT')"
            @click="handleExport"
          >excel导出</el-button>
          <el-button
            type="success"
            size="small"
            :disabled="!handleBtnRole('POINT_USER_IMPORT')"
            @click="$router.push('/import?type=emp')"
          >excel导入</el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="!handleBtnRole('POINT_USER_ADD')"
            @click="showNewDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <el-card v-loading="loading" element-loading-text="拼命加载中" style="margin-top: 10px;">
        <!-- 下方表格 -->
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
            label="员工头像"
            sortable
          >
            <template #default="{row}">
              <img
                v-imgerror="errorImg"
                class="staff-photo"
                :src="row.staffPhoto || defaultStaff"
                alt=""
                @click="handleStaffClick"
              >
            </template>
          </el-table-column>
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
                :disabled="!handleBtnRole('POINT_USER_EDIT')"
                @click="$router.push(`/employees/detail/${row.id}`)"
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
              <!-- 点击角色弹窗 -->
              <el-button
                type="text"
                size="small"
                @click="handleAssignRole(row.id)"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="!handleBtnRole('POINT_USER_DEL')"
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
      <!-- 二维码展示弹窗 -->
      <el-dialog
        width="250px"
        style="taxt-alin:center;"
        title="扫码看图片"
        :visible.sync="showQrcodeDialog"
      >
        <canvas ref="qrcodeCanvas" />
      </el-dialog>
      <assign-role
        :user-id="userId"
        :show-role-dialog.sync="showRoleDialog"
      />
    </div>
  </div>
</template>

<script>
// 引入接口文件
import { reqDelEmployee, reqGetUserList } from '@/api/employees'
// 引入公共组件
import employees from '@/constant/employees'
import errorImg from '@/assets/common/head.jpg'
import bigUserHeader from '@/assets/common/bigUserHeader.png'
// 引入添加弹层组件
import AddEmployee from './components/AddEmployee.vue'
import AssignRole from './components/AssignRole.vue'
// 引入三方组件
import dayjs from 'dayjs'
// 引入二维码的三方库
import QRCode from 'qrcode'

export default {
  name: 'Employees',
  components: {
    AddEmployee,
    AssignRole
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
      showNewDialog: false,
      // 默认头像
      defaultStaff: bigUserHeader,
      // 头像错误是展示的头像
      errorImg,
      // 二维码弹窗的显示/隐藏
      showQrcodeDialog: false,
      // 10. 角色弹窗的显示/隐藏
      showRoleDialog: false,
      // 11.需要传递的id
      userId: ''
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
    },
    // 7. 点击下载excel文件
    async handleExport() {
      // 7.1 获取所有的员工数据 将总条数传给后端，拿到所有员工数据
      const { data: { rows }} = await reqGetUserList(1, this.total)
      // console.log(rows)
      // 多表头
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      // 合并单元格
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      // 表头数组
      const headersArr = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      // 中英转换数组
      const headersRelations = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const resArr = this.formatFn(rows, headersArr, headersRelations)
      // console.log(resArr)
      import('@/vendor/Export2Excel').then(excel => {
        // 2. 导出excel
        excel.export_json_to_excel({
          header: headersArr, // 表头
          data: resArr, // 表内容
          filename: '员工表', // 文件名称
          autoWidth: true, // 是否定宽
          bookType: 'xlsx', // 文件类型
          multiHeader, // 多表头
          merges // 合并单元格
        })
        this.$message.success('导出成功')
      })
    },
    // 8. 把对象数组转成二维数组
    formatFn(rows, headersArr, headersRelations) {
      // 一维数组
      const oneArr = []

      // 遍历后端数组
      rows.forEach(item => {
        // 二维数组
        const twoArr = []
        // console.log(item)
        // 遍历表头数组，将表头的顺序按照二维数组的顺序
        headersArr.forEach(key => {
          // 从中英文对照表中取出英文键
          const englishKey = headersRelations[key]
          // console.log(englishKey)
          // 根据英文键从对象中取出对应的值
          let value = item[englishKey]
          // todo 如果是单个添加 则时间会不统一，设置统一的时间格式
          if (['timeOfEntry', 'correctionTime'].includes(englishKey)) {
            value = dayjs(value).format('YYYY年MM月DD日')
          }
          // todo 利用枚举来将后端的数据改为工种
          if (englishKey === 'formOfEmployment') {
            const { hireType } = employees
            const res = hireType.find(val => val.id === +value)
            value = res ? res.value : '未知工种'
          }
          // console.log(value)
          // 将值装入到二维数组
          twoArr.push(value)
        })
        // 将二维数组添加到一维数组
        oneArr.push(twoArr)
      })
      // console.log()
      return oneArr
    },
    // 9.点击图片展示二维码
    handleStaffClick(e) {
      // 二维码弹窗的显示 / 隐藏
      this.showQrcodeDialog = true
      // console.log(e.target.src)
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.qrcodeCanvas, e.target.src)
      })
    },
    // 10. 点击分配角色操作
    handleAssignRole(id) {
      this.showRoleDialog = true
      // console.log(id)
      this.userId = id
    },
    // 11.按钮操作权
    handleBtnRole(str) {
      const roles = this.$store.getters.roles
      // todo 判断roles内的point是否为str，如果是，则有该权限
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
.employees-container {
  .staff-photo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
}
</style>
