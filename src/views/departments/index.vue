<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 卡片 -->
      <el-card class="tree-card">
        <!-- 头部 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex">
              <!-- 两个内容 -->
              <el-col :span="12">负责人</el-col>
              <el-col :span="12">
                <!-- 下拉菜单 element -->
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <!-- 下拉菜单 -->
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 树型数组 -->
        <el-tree
          :data="list"
          :props="{label:'name'}"
          default-expand-all
        />
      </el-card>

    </div>
  </div>
</template>

<script>

export default {
  name: 'Departments',
  data() {
    return {
      list: [
        {
          name: '河南省',
          children: [
            {
              name: '郑州市',
              children: [
                { name: '二七区' },
                { name: '登封市', children: [
                  {
                    name: '少林寺'
                  }
                ] },
                { name: '郑东新区' }
              ]
            },
            {
              name: '焦作市',
              children: [
                { name: '山阳区' },
                { name: '温县',
                  children: [
                    { name: '太极拳' },
                    { name: '铁棍山药' }
                  ] },
                { name: '博爱县' }
              ]

            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
