<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    @close="handelColse"
    @click.native="handleDialogClick"
  >
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          :value="formData.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @click.native.stop="handleClick"
        />
        <!--  <el-card
          v-if="isShowTree"
          style="width:50%"
        >
          <el-tree
            v-loading="loadingTree"
            :data="treeData"
            :props="{label:'name'}"
            @node-click="handelNodeClick"
          />
        </el-card> -->
        <div v-if="isShowTree" class="tree-box">
          <el-scrollbar>
            <el-tree
              v-loading="loadingTree"
              :data="treeData"
              :props="{label:'name'}"
              @node-click="handelNodeClick"
            />
          </el-scrollbar>
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template #footer>
      <el-button @click="handelColse">取消</el-button>
      <el-button type="primary" @click="handleAddUser">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import employees from '@/constant/employees'
import { reqAddEmployee } from '@/api/employees'
const { hireType } = employees
export default {
  name: 'AddEmployee',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间

      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      treeData: [], // 树型数组
      isShowTree: false,
      loadingTree: false,
      hireType
    }
  },
  methods: {
    // 关闭窗口
    handelColse() {
      this.$emit('update:showDialog', false)
      // 重置表单数据
      this.$refs.addForm.resetFields()
    },
    // 获取树型数组
    async handleClick() {
      // 显示树形结构显示与隐藏
      this.isShowTree = !this.isShowTree
      // 判断isShowTree如果为true 则不需要执行下边代码
      if (!this.isShowTree) return
      // 显示loading
      this.loadingTree = true
      const { data: { depts }} = await reqGetDepartments()
      // console.log(res)
      this.treeData = tranListToTreeData(depts, '')
      this.loadingTree = false
    },
    // 对话框触发点击事件(冒泡)将树形结构隐藏
    handleDialogClick() {
      this.isShowTree = false
    },
    // 点击树形叶子的节点
    handelNodeClick(data) {
      // 判断是否是叶子节点(没有子部门),如果不是不做任何操作
      if (data.children && data.children.length > 1) return
      // 是叶子节点(数据回显)
      this.formData.departmentName = data.name
      // 隐藏属性组件
      this.isShowTree = false
    },
    // 添加用户
    handleAddUser() {
      // 校验表单完整
      this.$refs.addForm.validate(async flag => {
        // 判断是否完整
        if (!flag) return
        // 发送请求
        await reqAddEmployee(this.formData)
        // 提示用户信息
        this.$message.success('添加用户成功~')
        // 关闭窗口
        this.handelColse()
        // 像父组件同步信息
        this.$emit('add-user')
        // 不推荐写法(在组件中必须是根目录才可以)
        // this.$parent.getUserList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: absolute;
  width: 50%;
  // min-height: 50px;
  // max-height: 250px;
  height: 250px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  // overflow: auto;
  background-color: #fff;

  ::v-deep {
    .el-tree-node__content {
      height: auto;
    }
    .el-scrollbar{
      height: 100%;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>

