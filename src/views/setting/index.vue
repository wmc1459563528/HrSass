<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 页面主体 -->
      <el-card
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="role">
            <el-button type="primary" icon="el-icon-plus" @click="isShowDiaLog = true">新增角色</el-button>
            <el-table :data="list">
              <el-table-column type="index" :index="indexFn" label="序号" width="100" />
              <el-table-column prop="name" label="角色名称" width="250" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作" width="300" fixed="right">
                <template #default="{row}">
                  <el-button
                    type="success"
                  >分配权限</el-button>
                  <el-button
                    type="primary"
                    @click="handelEditRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    @click="handleDelRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>

            </el-table>
            <!-- 分页组件 -->
            <!--
              current-page: 当前页
              page-sizes: 控制每页显示的条数
              page-size: 每页默认显示的条数
              layout: 组件的布局空间
              total: 总条数

              @size-change: 当每页显示的条数发生变化时会触发后边函数的执行
              @current-change: 当前页发生变化时会触发后边函数的执行
             -->
            <el-pagination
              :current-page="page"
              :page-sizes="[1,2,3,4,5]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="company">
            <!-- 警告信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="success"
              show-icon
              :closable="false"
            />
            <!-- 表单 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input :value="companyForm.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input :value="companyForm.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input :value="companyForm.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input :value="companyForm.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 对话框 -->
      <el-dialog
        :title="diaLogTitle"
        :visible="isShowDiaLog"
        @close="handleClose"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入角色描述" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleAddRoleOrEditRole">确 定</el-button>
        </template>

      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reqGetRoleList, reqAddRole, reqDelRole, reqGetRoleDetail, reqUpdateRole } from '@/api/role'
import { reqSelectCompany } from '@/api/company'
import { mapState } from 'vuex'
export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'role',
      list: [],
      page: 1,
      pagesize: 3,
      total: 0,
      // 加载动画
      loading: false,
      isShowDiaLog: false,
      // 表单
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: ['blur', 'change'] }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: ['blur', 'change'] }
        ]
      },
      // 公司信息展示表单
      companyForm: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      }

    }
  },
  computed: {
    // 从仓库中拿数据
    ...mapState('user', ['userInfo']),
    // 根据表单是否有id来修改标题
    diaLogTitle() {
      return this.form.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList()
    this.getComputedInfo()
  },
  methods: {
    async getRoleList() {
      this.loading = true
      const { data: { rows, total }} = await reqGetRoleList(this.page, this.pagesize)
      // console.log(rows)
      this.list = rows
      this.total = total
      this.loading = false
    },
    // 3. 处理每页显示条数发生变化
    handleSizeChange(val) {
      // console.log(val)
      // 3.1 改变每页条数
      this.pagesize = val
      // 3.2 重新获取角色列表
      this.getRoleList()
    },
    // 4. 处理当前页发生变化
    handleCurrentChange(val) {
      // 4.1 改变每页条数
      this.page = val
      // 4.2 重新获取角色列表
      this.getRoleList()
    },
    // 自定义索引
    indexFn(index) {
      return (index + 1) + this.pagesize * (this.page - 1)
    },
    // 关闭对话框
    handleClose() {
      this.isShowDiaLog = false
      // 重置表单数据及校验规则
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        description: ''
      }
    },
    // 新增/编辑
    handleAddRoleOrEditRole() {
      // 校验表单完整性
      this.$refs.form.validate(async(flag) => {
        if (!flag) return
        if (this.form.id) {
          // 发送请求
          await reqUpdateRole(this.form)
          // 提示用户
          this.$message.success('编辑成功~')
        } else {
          // 发送请求
          await reqAddRole(this.form)
          // 提示用户
          this.$message.success('添加成功~')
        }
        // 关闭弹窗
        this.handleClose()
        // 重新拉取数据
        this.getRoleList()
      })
    },
    // 删除当前角色
    handleDelRole(id) {
      this.$confirm('确定删除该项吗？一经删除则不可恢复', '温馨提醒', { type: 'warning' }).then(async() => {
        // 调用接口
        await reqDelRole(id)
        // 提醒用户
        this.$message.success('删除成功')
        // ! 特殊处理 如果当前页只有一条且还不是第一页时需要跳转到上一页
        if (this.list.length === 1 && this.page > 1) {
          this.page--
        }
        // 重新拉取数据
        this.getRoleList()
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    // 编辑数据回显
    async handelEditRole(id) {
      // 发送请求
      const res = await reqGetRoleDetail(id)
      // console.log(res)
      // 将数据回显到form
      this.form = res.data
      // 显示表格
      this.isShowDiaLog = true
    },
    // 获取公司信息
    async getComputedInfo() {
      // 从仓库中获取企业的ID
      const { data: res } = await reqSelectCompany(this.userInfo.companyId)
      this.companyForm = res
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
