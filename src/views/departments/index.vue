<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 卡片 -->
      <el-card class="tree-card">
        <!-- 头部 -->
        <tree-row
          :node-data="company"
          :root="true"
          @add-depts="handleAddDept"
        />
        <!-- 树型数组 -->
        <el-tree :data="departs" :props="{ label: 'name' }" default-expand-all>
          <!-- 作用域插槽: 自己自定义树形结构 -->
          <template #default="{ data }">
            <tree-row
              :node-data="data"
              @add-depts="handleAddDept"
              @del-depts="getDepartment"
              @edit-depts="handleEditDept"
            />
          </template>
        </el-tree>
      </el-card>

      <!-- 添加子组件 -->
      <!--
         :is-show.sync
         - 父组件已经放权让你可以以固定的方式去直接修改isShow属性的属性值
         - 在子组件中一旦修改了isShow属性的属性值, 会同步影响到父组件中isShowAddDept属性的属性值

         删除之前注册的自定义事件:
          @closeDialog="handleCloceAddDept"
       -->
      <add-dept
        ref="addDept"
        :is-show.sync="isShowAddDept"
        :depts-list="deptsList"
        :node-data="nodeData"
        @addDept="getDepartment"
      />
    </div>
  </div>
</template>

<script>
// 引入子组件
import TreeRow from './components/TreeRow.vue'
import AddDept from './components/AddDept.vue'
// 引入接口
import { reqGetDepartments } from '@/api/departments'
// 引入工具
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Departments',
  components: {
    TreeRow,
    AddDept
  },
  data() {
    // 1. 树形组件的数据源数组(树形数组)
    return {
      departs: [],
      // 公司信息
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      isShowAddDept: false,
      // 添加子部门对应得父部门的数据
      nodeData: {},
      // 5. 部门完整的数据数组(对象数组)
      deptsList: []
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const { data: { companyName, depts }} = await reqGetDepartments()
      // console.log(companyName, depts)
      // 1.2 处理公司的名称
      this.company.name = companyName
      // 1.4 在总公司下添加一个空id 方便添加一级标题
      this.company.id = ''
      // 1.3 把对象数组转成树形数组
      this.departs = tranListToTreeData(depts, '')
      // 记录对象数组
      this.deptsList = depts
    },
    /*     handleCloceAddDept() {
      // this.$message.info('您已关闭窗口')
      this.isShowAddDept = false
    }, */
    // 添加子部门
    handleAddDept(nodedata) {
      this.isShowAddDept = true
      this.nodeData = nodedata
      // 第一种方法，利用ref refs来调用子组件方法
      // this.$refs.addDept.getSimpleUserList()
      this.$refs.addDept.dialogTitle = '添加部门'
    },
    // 编辑子部门
    handleEditDept(nodedata) {
      this.isShowAddDept = true
      this.nodeData = nodedata
      this.$refs.addDept.dialogTitle = '编辑部门'
      // 调用子组件中的函数，进行回显操作
      this.$refs.addDept.getDeptDetail(nodedata.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tree {
  // 深度穿透
  ::v-deep {
    // 小三角的样式, 去掉默认的小三角的旋转效果
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    // 有子节点 且未展开 +
    .el-icon-caret-right:before {
      background: url("~@/assets/common/add-circle.png") no-repeat 0 0;
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 有子节点 且已展开 -
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
      background: url("~@/assets/common/minus-circle.png") no-repeat 0 0;
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 没有子节点
    .el-tree-node__expand-icon.is-leaf::before {
      background: url("~@/assets/common/user-filling.png") no-repeat 0 0;
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
  }
}
</style>
