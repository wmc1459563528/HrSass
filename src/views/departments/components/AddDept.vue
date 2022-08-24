<template>

  <el-dialog
    :title="dialogTitle"
    :visible="isShow"
    @close="handleCloce"
    @open="handleOpen"
  >
    <!-- 匿名插槽 -->
    <template #default>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          prop="name"
          label="部门名称"
        >
          <el-input
            v-model="form.name"
            style="width: 80%"
            placeholder="1-10个字符"
          />
        </el-form-item>
        <el-form-item
          prop="code"
          label="部门编码"
        >
          <el-input
            v-model="form.code"
            style="width: 80%"
            placeholder="1-10个字符"
          />
        </el-form-item>
        <el-form-item
          prop="manager"
          label="部门负责人"
        >
          <el-select
            v-model="form.manager"
            style="width: 80%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="introduce" label="部门介绍">
          <el-input
            v-model="form.introduce"
            style="width: 80%"
            placeholder="1-300个字符"
            type="textarea"
            :rows="3"
          />
        </el-form-item> </el-form></template>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <template #footer>
      <el-button @click="handleCloce">取 消</el-button>
      <el-button type="primary" @click="handleAdd">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetSimpleUserList } from '@/api/user'
import { reqAddDepartment, reqEditDepartment, reqUpdateDepartDetail } from '@/api/departments'

export default {
  name: 'AddDept',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    // 父级部门的数据
    nodeData: {
      type: Object,
      default: () => {}
    },
    // 整体部门的对象数组
    deptsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    /**
     * 自定义校验-所有的部门的部门名称不能相同
     */
    const checkName = (rules, value, callback) => {
    //   console.log(value, this.nodeData.id, this.deptsList)
      let childList = []
      if (this.form.id) { // todo 编辑部门的校验规则
        // 1.1 如果部门名称没有改变, 也是应该要通过校验
        if (value === this.nodeData.name) callback()
        // 1.2 获取与当前部门同级的所有部门
        childList = this.deptsList.filter(item => item.pid === this.nodeData.pid)
      } else { // todo 添加部门的校验规则
        // 1. 根据父级部门的id, 找到该部门下的所有子部门
        childList = this.deptsList.filter(item => item.pid === this.nodeData.id)
      }
      // console.log(childList)
      // 2. 判断输入的新部门名称是否和数组中部门的名称同名
      const flag = childList.some(item => item.name === value)
      // 3. 告知外部校验的结果
      flag ? callback(new Error('同级部门下已经有该部门')) : callback()
    }
    /**
     * 自定义校验-所有的部门的部门编码不能相同
     */
    const checkCode = (rules, value, callback) => {
      // 如果是编辑状态, 没有修改部门编码, 应该是直接通过校验
      if (this.form.id && value === this.nodeData.code) callback()
      const flag = this.deptsList.some(item => item.code === value)
      flag ? callback(new Error('公司已经有相同的部门编码')) : callback()
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          // 必填校验
          { required: true, message: '请输入部门名称', trigger: ['blur', 'change'] },
          //   长度校验
          { min: 1, max: 10, message: '部门名称只能是1-10位', trigger: ['blur', 'change'] },
          // 自定义校验部门名称
          { validator: checkName, trigger: 'blur' }
        ],
        code: [
          // 必填校验
          { required: true, message: '请输入部门编码', trigger: ['blur', 'change'] },
          //   长度校验
          { min: 1, max: 10, message: '部门编码只能是1-10位', trigger: ['blur', 'change'] },
          // 自定义校验部门名称
          { validator: checkCode, trigger: 'blur' }
        ],
        manager: [
          // 必填校验
          { required: true, message: '请输入部门负责人', trigger: ['blur', 'change'] }
        ],
        introduce: [
          // 必填校验
          { required: true, message: '请输入部门介绍', trigger: ['blur', 'change'] },
          //   长度校验
          { min: 1, max: 300, message: '部门介绍只能是1-300位', trigger: ['blur', 'change'] }
        ]

      },
      userList: [],
      dialogTitle: ''
    }
  },
  methods: {
    // 关闭窗口
    handleCloce() {
    // 1.1 发射自定义事件告知父组件关闭弹层
      // this.$emit('closeDialog', false)

      // 以固定的语法直接修改定义在props选项中的isShow的属性值
      // update:固定写法 (update:props名称, 值)
      this.$emit('update:isShow', false)

      // 1.2 重置表单(表单关联的属性值 和 校验状态)
      this.$refs.form.resetFields()
      // 1.3 加强表单重置
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    },
    // 获取负责人对象数组
    async getSimpleUserList() {
      const { data: res } = await reqGetSimpleUserList()
      // console.log(res)
      this.userList = res
    },
    // 利用dialog里边的open属性在打开时来调用方法，
    handleOpen() {
      this.getSimpleUserList()
    },
    // 添加子部门
    handleAdd() {
      this.$refs.form.validate(async(flag) => {
        // 校验不通过
        if (!flag) return
        // 3.2 判断是添加还是编辑
        if (this.form.id) {
          // 校验通过，调用添加接口函数
          await reqUpdateDepartDetail(this.form)
          // 提示用户
          this.$message.success('编辑部门成功~')
        } else {
          // 校验通过，调用添加接口函数
          await reqAddDepartment({ ...this.form, pid: this.nodeData.id })
          // 提示用户
          this.$message.success('添加子部门成功~')
        }

        // 关闭弹窗
        this.handleCloce()
        // 通知父组件更新数据
        this.$emit('addDept')
      })
    },
    // 根据部门ID修改部门详情
    async getDeptDetail(id) {
      // 调用获取部门详情的接口
      const res = await reqEditDepartment(id)
      // console.log(res)
      this.form = res.data
    }
  }
}
</script>

<style></style>
