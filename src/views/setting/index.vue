<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="role">
            <el-button type="primary" icon="el-icon-plus">新增角色</el-button>
            <el-table :data="list">
              <el-table-column type="index" :index="indexFn" label="序号" width="100" />
              <el-table-column prop="name" label="角色名称" width="250" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作" width="300" fixed="right">
                <el-button type="success">分配权限</el-button>
                <el-button type="primary">编辑</el-button>
                <el-button type="danger">删除</el-button>
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
          <el-tab-pane label="公司信息" name="company">公司信息</el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { reqGetRoleList } from '@/api/role'
export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'role',
      list: [],
      page: 1,
      pagesize: 3,
      total: 0,
      loading: false
    }
  },
  created() {
    this.getRoleList()
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
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
